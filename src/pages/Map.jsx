import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MyMap = () => {
  return (
    <MapContainer center={[0, 0]} zoom={5} style={{ height: '50px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[0, 0]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyMap;
