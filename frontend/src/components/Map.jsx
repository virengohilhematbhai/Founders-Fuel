import React from 'react';

const EmbeddedMap = ({ address, companyName, location }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Logic to determine the query: prioritized Coordinates (lat,lng) -> then Address
  let query = "";
  if (location && location.lat && location.lng) {
    query = `${location.lat},${location.lng}`;
  } else {
    query = address || "Innovation Hub, Gujrat, India";
  }

  const encodedQuery = encodeURIComponent(query);
  
  // The Embed API URL - Using Place mode to show a clear marker
  const mapUrl = apiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedQuery}`
    : `https://maps.google.com/maps?q=${encodedQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  // Function to open the location in full Google Maps
  const openInFullMaps = () => {
    const fullUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    window.open(fullUrl, '_blank');
  };

  return (
    <div 
      className="w-full h-full min-h-[180px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10 group relative cursor-pointer bg-gray-100 dark:bg-white/5"
      onClick={openInFullMaps}
      title="Click to open in Google Maps"
    >
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0, pointerEvents: 'none' }}
        src={mapUrl}
        allowFullScreen
        title={`Map of ${companyName || 'Company Location'}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      
      {/* Overlay to encourage clicking and inform the user */}
      <div className="absolute inset-x-0 bottom-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-tighter">
          View in Google Maps
        </p>
      </div>

      {!apiKey && (
        <div className="absolute top-2 right-2 bg-brandOrange/90 text-black text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm backdrop-blur-md">
          PREVIEW MODE
        </div>
      )}
    </div>
  );
};

export default EmbeddedMap;
