import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  IconSend,
  IconLoader2,
  IconUser,
  IconArrowLeft,
  IconPaperclip,
  IconVideo,
  IconPlayerPlayFilled,
  IconX,
  IconFile,
  IconMoodSmile,
} from "@tabler/icons-react";
import EmojiPicker from "emoji-picker-react";

// For production, fallback to window.location.origin
const ENDPOINT = `${import.meta.env.VITE_API_URL || ""}`;
var socket, selectedChatCompare;

const VideoMessage = ({ fileUrl, fileType, isSender }) => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden mb-1 flex-shrink-0 cursor-pointer group bg-black max-w-full ${isSender ? "rounded-tr-none" : "rounded-tl-none"}`}
      style={{ width: "250px", aspectRatio: "4/5" }}
      onClick={() => setPlaying(true)}
    >
      <video
        src={`${ENDPOINT}/uploads/${fileUrl}`}
        className="w-full h-full object-cover"
        controls={playing}
        autoPlay={playing}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
      />
      {!playing && (
        <>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
              <IconPlayerPlayFilled size={24} />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[10px] sm:text-xs font-semibold drop-shadow-md">
            <IconVideo size={14} /> {formatDuration(duration)}
          </div>
        </>
      )}
    </div>
  );
};

const ImageMessage = ({ fileUrl, isSender }) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden mb-1 flex-shrink-0 bg-black max-w-full ${isSender ? "rounded-tr-none" : "rounded-tl-none"}`}
      style={{ width: "250px" }}
    >
      <img
        src={`${ENDPOINT}/uploads/${fileUrl}`}
        className="w-full h-auto object-cover max-h-[300px]"
        alt="Attachment"
      />
    </div>
  );
};

const DocumentMessage = ({ fileUrl, fileOriginalName, fileSize, isSender }) => {
  const ext = fileOriginalName
    ? fileOriginalName.split(".").pop().toUpperCase()
    : "FILE";
  const displayExt = ext.substring(0, 3);

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "kB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden mb-1 flex-shrink-0 flex flex-col w-[260px] sm:w-[300px] ${isSender ? "bg-white/10 text-white" : "bg-black/5 dark:bg-white/5 text-gray-900 dark:text-white"} ${isSender ? "rounded-tr-none" : "rounded-tl-none"}`}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="relative w-10 h-10 bg-gray-400 dark:bg-gray-600  rounded flex items-center justify-center text-white shrink-0">
          <IconFile className="opacity-50 w-full h-full p-2" />
          <span className="absolute text-[9px] font-bold mt-2 bg-black/40 px-1 rounded">
            {displayExt}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate leading-tight">
            {fileOriginalName || "document.file"}
          </p>
          <p className="text-[11px] opacity-70 mt-0.5">
            {ext} • {formatBytes(fileSize)}
          </p>
        </div>
      </div>
      <div className="border-t border-black/10 dark:border-white/10 flex items-center divide-x divide-black/10 dark:divide-white/10">
        <a
          href={`${ENDPOINT}/uploads/${fileUrl}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2 text-center text-[13px] font-semibold text-[#00a884] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Open
        </a>
        <a
          href={`${ENDPOINT}/uploads/${fileUrl}`}
          download={fileOriginalName}
          className="flex-1 py-2 text-center text-[13px] font-semibold text-[#00a884] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Save as...
        </a>
      </div>
    </div>
  );
};

const ChatInterface = ({ user }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/message/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // give notification or update chat list with new message latestMessage
        fetchChats();
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("video/") || file.type.startsWith("image/")) {
        setFilePreviewUrl(URL.createObjectURL(file));
      } else {
        setFilePreviewUrl("document");
      }
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (e.key === "Enter") e.preventDefault();
      if (newMessage.trim() || selectedFile) {
        socket.emit("stop typing", selectedChat._id);
        try {
          const token = localStorage.getItem("token");
          const msgToSend = newMessage;
          const fileToSend = selectedFile;

          setNewMessage("");
          setSelectedFile(null);
          setFilePreviewUrl(null);

          const formData = new FormData();
          formData.append("chatId", selectedChat._id);
          if (msgToSend) formData.append("content", msgToSend);
          if (fileToSend) formData.append("file", fileToSend);

          const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/message`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
          const data = await res.json();
          socket.emit("new message", data);
          setMessages([...messages, data]);
          fetchChats(); // update latest message in list
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const capitalizeName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getMessageSenderName = (sender) => {
    if (!sender) return "Unknown";
    if (sender.userType === "startup") {
      return capitalizeName(sender.companyName || sender.fullName || "Startup");
    }
    if (sender.fullName) return capitalizeName(sender.fullName);
    return "User";
  };

  const getChatName = (chat) => {
    if (!chat || !chat.users) return "";
    const otherUser = chat.users.find((u) => u._id !== (user._id || user.id));
    if (!otherUser) return "Unknown User";

    if (otherUser.userType === "startup") {
      return capitalizeName(
        otherUser.companyName ||
          (chat.job && chat.job.company) ||
          otherUser.fullName,
      );
    }
    return capitalizeName(otherUser.fullName);
  };

  const isSameDay = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.toDateString() === date2.toDateString();
  };

  const isSameSender = (m1, m2) => {
    return m1?.sender?._id === m2?.sender?._id;
  };

  return (
    <div className="flex bg-white dark:bg-[#0d0a1c] h-full overflow-hidden relative w-full rounded-lg shadow">
      {/* Left Pane - Chat List */}
      <div
        className={`w-full md:w-1/3 xl:w-1/4 border-r border-gray-200 dark:border-white/10 flex flex-col bg-white dark:bg-[#0d0a1c] ${selectedChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 md:p-6 pb-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Messages
            </h2>
          </div>
          {/* Subtle search bar placeholder logic could go here */}
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
          {chats.map((chat) => {
            const isSelected = selectedChat?._id === chat._id;
            const chatName = getChatName(chat);
            const latestMsg = chat.latestMessage;
            
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer transition-all flex items-center gap-3 relative group ${isSelected ? "bg-brandOrange/5 dark:bg-white/5 border-l-4 border-brandOrange" : "hover:bg-gray-50 dark:hover:bg-white/[0.02] border-l-4 border-transparent"}`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-brandOrange border border-brandOrange/20 shadow-sm ${isSelected ? "bg-brandOrange/20" : "bg-brandOrange/10"}`}>
                    <IconUser size={22} stroke={1.5} />
                  </div>
                  {/* Status Indicator (Purely decorative for now) */}
                  {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0d0a1c] rounded-full scale-110"></div> */}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`text-[15px] font-bold truncate transition-colors ${isSelected ? "text-brandOrange" : "text-gray-900 dark:text-white"}`}>
                      {chatName}
                    </h3>
                    {latestMsg && (
                      <span className="text-[10px] font-medium text-gray-400 shrink-0 ml-2 uppercase tracking-wider">
                        {formatTime(latestMsg.createdAt)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-0.5">
                    {chat.job && chat.job.title && (
                      <span className="text-[10px] font-black text-brandOrange/70 uppercase tracking-widest truncate leading-tight">
                        {chat.job.title}
                      </span>
                    )}
                    <p className={`text-xs truncate leading-tight ${isSelected ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}>
                      {latestMsg ? (
                        <>
                          {latestMsg.sender?._id === (user._id || user.id) ? (
                            <span className="opacity-60 italic mr-1">You:</span>
                          ) : null}
                          {latestMsg.content || (latestMsg.fileUrl ? "Sent an attachment" : "New message")}
                        </>
                      ) : (
                        "No messages yet"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {chats.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center opacity-40 py-16">
              <IconUser size={40} stroke={1} className="mb-3" />
              <p className="text-sm font-medium">No active chats</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Pane - Chat Window */}
      <div
        className={`flex-1 flex flex-col ${!selectedChat ? "hidden md:flex" : "flex"}`}
      >
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center gap-3">
              <button
                className="md:hidden p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setSelectedChat(null)}
              >
                <IconArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-brandOrange/20 flex items-center justify-center">
                <IconUser size={16} className="text-brandOrange" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getChatName(selectedChat)}
                </span>
                {selectedChat.job && selectedChat.job.title && (
                  <span className="text-xs text-brandOrange font-medium">
                    {selectedChat.job.title}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-6 scroll-smooth custom-scrollbar">
              {/* Chat Background Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay">
                 <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <IconLoader2 className="animate-spin text-brandOrange" />
                </div>
              ) : (
                messages.map((m, index) => {
                  const isSender = m.sender?._id === (user._id || user.id);
                  const prevMessage = messages[index - 1];
                  const showDayLabel = !prevMessage || !isSameDay(m.createdAt, prevMessage.createdAt);
                  const isFirstInGroup = !prevMessage || !isSameSender(m, prevMessage) || showDayLabel;

                  return (
                    <React.Fragment key={m._id}>
                      {showDayLabel && (
                        <div className="flex justify-center my-4">
                          <span className="px-3 py-1 rounded-lg bg-white/50 dark:bg-white/5 text-[11px] font-bold text-gray-500 uppercase tracking-widest backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-sm">
                            {new Date(m.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`flex w-full relative ${isSender ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-4" : "mt-5"}`}
                      >
                        {!isSender && isFirstInGroup && (
                           <div className="w-8 h-8 rounded-full bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center mr-2 self-end mb-0.5 shrink-0">
                             <IconUser size={16} className="text-brandOrange" />
                           </div>
                        )}
                        <div
                          className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isSender ? "items-end" : "items-start"}`}
                          style={{ marginLeft: !isSender && !isFirstInGroup ? "2.5rem" : undefined }}
                        >
                          <div
                            className={`group relative py-1.5 px-3 sm:px-4 rounded-2xl text-[14px] shadow-sm flex flex-col transition-all border ${
                              isSender
                                ? "bg-brandOrange/90 dark:bg-brandOrange/80 text-black rounded-tr-none border-brandOrange/10"
                                : "bg-white dark:bg-white/10 text-gray-900 dark:text-white rounded-tl-none border-gray-100 dark:border-white/5"
                            }`}
                          >
                            {/* Only show name if multiple users (e.g. group) or if explicitly needed. WhatsApp usually hides it. */}
                            {false && !isSender && isFirstInGroup && (
                              <div className="text-[11px] font-black mb-0.5 text-brandOrange/80">
                                {getMessageSenderName(m.sender)}
                              </div>
                            )}

                            {m.fileUrl && m.fileType?.startsWith("video/") && (
                                <VideoMessage fileUrl={m.fileUrl} fileType={m.fileType} isSender={isSender} />
                            )}
                            {m.fileUrl && m.fileType?.startsWith("image/") && (
                                <ImageMessage fileUrl={m.fileUrl} isSender={isSender} />
                            )}
                            {m.fileUrl && (!m.fileType || (!m.fileType.startsWith("video/") && !m.fileType.startsWith("image/"))) && (
                                <DocumentMessage fileUrl={m.fileUrl} fileOriginalName={m.fileOriginalName} fileSize={m.fileSize} isSender={isSender} />
                            )}

                            <div className="flex flex-wrap items-end justify-between gap-x-3 sm:gap-x-4">
                              {m.content && (
                                <p className="flex-1 leading-relaxed py-0.5 min-w-0 break-words">
                                  {m.content}
                                </p>
                              )}
                              <div className={`text-[9px] sm:text-[10px] ml-auto mb-[-1px] flex items-center gap-1 font-semibold opacity-70 ${isSender ? "text-black" : "text-gray-500"}`}>
                                {formatTime(m.createdAt)}
                                {isSender && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="">
                                    {/* <path d="M18 6 7 17l-5-5"></path> */}
                                    {/* <path d="m22 10-7.5 7.5L13 16"></path> */}
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
              {isTyping && (
                <div className="flex justify-start ml-10">
                  <div className="bg-white dark:bg-white/5 text-gray-400 text-[11px] px-4 py-2 rounded-2xl rounded-tl-none italic border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-brandOrange/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-brandOrange/40 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-brandOrange/40 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                    </div>
                    {getChatName(selectedChat)} is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 md:p-4 bg-white dark:bg-[#0d0a1c] border-t border-gray-200 dark:border-white/10">
              <div className="flex flex-col gap-3">
                {filePreviewUrl && selectedFile && (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-between border border-black/5 dark:border-white/10 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center">
                        {filePreviewUrl !== "document" ? (
                          selectedFile.type.startsWith("video/") ? (
                            <video src={filePreviewUrl} className="w-full h-full object-cover" />
                          ) : (
                            <img src={filePreviewUrl} className="w-full h-full object-cover" alt="Preview" />
                          )
                        ) : (
                          <div className="flex flex-col items-center">
                            <IconFile size={24} className="text-brandOrange" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                          {selectedFile.name}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                          Preparing attachment...
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <IconX size={20} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 md:gap-3 bg-gray-100 dark:bg-white/5 p-1.5 pl-3 rounded-[24px] border border-transparent focus-within:border-brandOrange/30 focus-within:bg-white dark:focus-within:bg-white/10 transition-all shadow-inner relative group">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 rounded-full transition-colors ${showEmojiPicker ? "text-brandOrange bg-brandOrange/10" : "text-gray-500 hover:text-brandOrange"}`}
                  >
                    <IconMoodSmile size={22} />
                  </button>
                  
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-4 z-50">
                      <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-brandBlue transition-colors rounded-full"
                  >
                    <IconPaperclip size={22} />
                  </button>

                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none text-gray-900 dark:text-white py-2.5 outline-none text-sm placeholder:text-gray-400"
                    value={newMessage}
                    onChange={typingHandler}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
                  />

                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() && !selectedFile}
                    className="w-10 h-10 flex items-center justify-center bg-brandOrange text-black rounded-full shadow-lg shadow-brandOrange/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  >
                    <IconSend size={18} stroke={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
