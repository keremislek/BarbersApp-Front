import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const AddressMap = ({ address }) => {
  const [position, setPosition] = useState(null);

  // Adres koordinatlarına dönüştürme işlemi burada gerçekleşebilir
  // Bu örnekte, koordinatlar sabit bir değer olarak alınıyor
  const addressCoordinates = [41.0082, 28.9784]; // Örnek İstanbul koordinatları

  // Leaflet ikonları yükleme
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  return (
    <div className="map-container">
      <MapContainer center={addressCoordinates} zoom={13} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={addressCoordinates}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default AddressMap;
