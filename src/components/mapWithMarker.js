import React, { useEffect, useState } from "react";
import storage from "../utils/storage";
const MapWithMarker = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [markerName, setMarkerName] = useState("");
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyANM-S8csQhiY7y2RGmzCD1PDN0dIxFzlY&libraries=places`;
    script.async = true;
    script.onload = initializeMap;
    document.body.appendChild(script);
  }, []);
  const initializeMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 12,
    });
    const storedMarkers = storage.getMarkers();
    storedMarkers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: mapInstance,
        title: markerData.title,
      });
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div>${markerData.title}</div>`,
      });
      infoWindow.open(mapInstance, marker);
    });
    setMap(mapInstance);
  };
  const handleAddMarker = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setLatitude("");
    setLongitude("");
    setMarkerName("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    console.log("Latitude:", lat);
    console.log("Longitude:", lng);
    if (!isNaN(lat) && !isNaN(lng) && markerName.trim() !== "") {
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: markerName,
      });
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div>${markerName}</div>`,
      });
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
      setMarkers([...markers, marker]);
      storage.storeMarker({ position: marker.position, title: marker.title });
      handleModalClose();
    } else {
      console.error("Invalid input for latitude, longitude, or marker name.");
    }
  };
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(marker.position);
      });
      map.fitBounds(bounds);
    }
  }, [markers, map]);
  return (
    <div className="relative size-full min-h-full">
    <button
        className="absolute z-10 top-0 right-0 mr-4 mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAddMarker}
        >
        Add Location
    </button>
      <div id="map" style={{ height: "833px" }}></div>
      
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 mb-3"
                      id="modal-title"
                    >
                      Add Location
                    </h3>
                    <hr/>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="markerName"
                          >
                            Marker Name
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="markerName"
                            type="text"
                            placeholder="Enter marker name"
                            value={markerName}
                            onChange={(e) => setMarkerName(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="latitude"
                          >
                            Latitude
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="latitude"
                            type="text"
                            placeholder="Enter latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="longitude"
                          >
                            Longitude
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="longitude"
                            type="text"
                            placeholder="Enter longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={handleModalClose}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Add Marker
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MapWithMarker;








