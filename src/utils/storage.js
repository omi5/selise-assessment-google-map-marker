const storage = {
    getMarkers: () => {
      const storedMarkers = localStorage.getItem("markers");
      return storedMarkers ? JSON.parse(storedMarkers) : [];
    },
    storeMarker: (marker) => {
      const storedMarkers = storage.getMarkers();
      storedMarkers.push(marker);
      localStorage.setItem("markers", JSON.stringify(storedMarkers));
    },
  };
  export default storage;