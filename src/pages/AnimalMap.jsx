import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function AnimalMap({ zipcode, country = 'Spain' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    if (!zipcode || !mapRef.current) return;

    const initMap = async () => {
      try {
        // Geocodificate CP with Nominatim
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${zipcode}&country=${country}&format=json&limit=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();

        if (!data.length) {
          setStatus('error');
          return;
        }

        const center = [parseFloat(data[0].lat), parseFloat(data[0].lon)];

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Create map with th coordenates from the CP
        const map = L.map(mapRef.current, { zoomControl: true }).setView(center, 13);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        // Circle to represent the area
        L.circle(center, {
          radius: 1200,        
          color: '#e07b39',    
          fillColor: '#e07b39',
          fillOpacity: 0.15,
          weight: 2,
        }).addTo(map);

        
        L.popup({ closeButton: false })
          .setLatLng(center)
          .setContent(`<b>Zone CP ${zipcode}</b><br><small>Approximate location</small>`)
          .openOn(map);

        setStatus('ready');
      } catch (err) {
        console.error('Error on loading map:', err);
        setStatus('error');
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [zipcode, country]);

  return (
    <div className="animal-map-wrapper">
      {status === 'loading' && (
        <div className="map-overlay-msg">Loading map...</div>
      )}
      {status === 'error' && (
        <div className="map-overlay-msg map-overlay-error">
          Couldn't load a map for CP {zipcode}
        </div>
      )}
      <div
        ref={mapRef}
        style={{
          height: '280px',
          width: '100%',
          borderRadius: '10px',
          visibility: status === 'ready' ? 'visible' : 'hidden',
        }}
      />
    </div>
  );
}