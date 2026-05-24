import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getToken } from '../utils/auth';
import '../styles/AnimalMapView.css';

/**
 * AnimalMapView
 *
 * Displays a Leaflet map showing the approximate location of all animals
 * available for adoption. Animals are grouped by postal code (CP) and
 * rendered as scattered dots inside a circle that represents
 * the zone, exact addresses are never revealed.
 *
 * Data flow:
 *  1. Fetches the list of animals from GET /animals/locations (JWT required).
 *  2. Groups animals by CP and geocodes each unique CP via GET /geocoding/{cp}.
 *  3. For every CP zone, draws a circle and places one dot per animal at a
 *     random position within the circle radius.
 *  4. Clicking a dot opens a popup with the animal's name and species.
 *  5. The map auto-fits its bounds to show all zones on load.
 */

export default function AnimalMapView({ refresh }) {
  const mapRef           = useRef(null);
  const mapInstanceRef   = useRef(null);
  const [status, setStatus] = useState('loading');
  const [count, setCount]   = useState(0);

  useEffect(() => {
    const token = getToken();

    const initMap = async () => {
      try {
        // 1. Fetch animals
        const res = await fetch('http://localhost:8080/animals/locations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('fetch failed');
        const animals = await res.json();
        setCount(animals.length);

        // 2. Group by zipcode
        const byZip = animals.reduce((acc, a) => {
          (acc[a.animalZipcode] = acc[a.animalZipcode] || []).push(a);
          return acc;
        }, {});

        // 3. Geocode unique zipcodes
        const geocoded = await Promise.all(
          Object.entries(byZip).map(async ([zip, list]) => {
            try {
              const gRes = await fetch(`http://localhost:8080/geocoding/${zip}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!gRes.ok) return null;
              const { lat, lng } = await gRes.json();
              return { zip, lat, lng, animals: list };
            } catch {
              return null;
            }
          })
        );

        const validZones = geocoded.filter(Boolean);
        if (!validZones.length) throw new Error('no coordinates');

        // 4. Init map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapRef.current, { zoomControl: true });
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        // 5. Add a circle + popup per zipcode
        const bounds = [];
        validZones.forEach(({ zip, lat, lng, animals: list }) => {
          const center = [lat, lng];
          bounds.push(center);

          L.circle(center, {
            radius: 1200,
            color: '#63b7bf',
            fillColor: '#63b7bf',
            fillOpacity: 0.15,
            weight: 2,
          }).addTo(map);

          // One dot per animal, scattered randomly inside the circle
        list.forEach(animal => {
            const angle    = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 900; // max 900m yo keep the dots inside the 1200m circle

            const offsetLat = distance * Math.cos(angle) / 111320;
            const offsetLng = distance * Math.sin(angle) / (111320 * Math.cos(lat * Math.PI / 180));

            const dotPosition = [lat + offsetLat, lng + offsetLng];

            L.circleMarker(dotPosition, {
            radius: 6,
            color: '#fff',
            weight: 1.5,
            fillColor: '#e03939cd',
            fillOpacity: 0.9,
            })
            .addTo(map)
            .bindPopup(`
                <b>${animal.animalName}</b><br/>
                <small style="color:#888">${animal.species} · CP ${zip}</small>
            `);
        });
        });

        // 6. Fit map to show all zones
        if (bounds.length === 1) {
          map.setView(bounds[0], 13);
        } else {
          map.fitBounds(bounds, { padding: [40, 40] });
        }

        setStatus('ready');
      } catch (err) {
        console.error(err);
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
  }, [refresh]);

  return (
    <div className="amv-wrapper">
      <div className="amv-header">
        <span className="amv-title">Animals near you</span>
        {status === 'ready' && (
          <span className="amv-count">{count} animals</span>
        )}
      </div>
      <p className="amv-disclaimer">
        📍 This shows the approximate location of the animals. Exact addresses are not revealed.
      </p>
      {status === 'loading' && <div className="amv-msg">Loading map…</div>}
      {status === 'error'   && <div className="amv-msg amv-msg--error">Could not load animals.</div>}
      <div
        ref={mapRef}
        style={{
          height: '500px',
          width: '100%',
          borderRadius: '12px',
          visibility: status === 'ready' ? 'visible' : 'hidden',
        }}
      />
    </div>
  );
}