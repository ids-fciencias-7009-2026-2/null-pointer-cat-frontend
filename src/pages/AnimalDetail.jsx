import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { PhotoCarousel } from './PostFeed.jsx';
import '../styles/AnimalDetail.css';
import AnimalMap from './AnimalMap.jsx';

export default function AnimalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = getToken();
                const response = await fetch(`http://localhost:8080/animals/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setAnimal(data);
                }
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="pf-message">Cargando ficha informativa...</div>;
    if (!animal) return <div className="pf-message">No se encontró la información del animal.</div>;

    return (
        <div className="detail-page-container">
            <button className="back-btn" onClick={() => navigate(-1)}>← Volver al listado</button>

            <div className="detail-layout">
                <div className="detail-gallery">
                    <PhotoCarousel photos={animal.photos} animalName={animal.animalName} />
                </div>

                <div className="detail-info-panel">
                    <h1 className="detail-title">{animal.animalName}</h1>

                    <div className="detail-tags">
                        <span className="pf-species-tag">{animal.species}</span>
                        <span className="breed-tag">{animal.breedName || 'RAZA'}</span>
                    </div>

                    <div className="detail-section">
                        <h2 className="section-title">Datos del animal</h2>
                        <div className="info-box"><strong>Tamaño:</strong> {animal.size}</div>
                        <div className="info-box"><strong>Ubicación:</strong> CP {animal.animalZipcode}</div>
                        <div className="info-box"><strong>Fecha de nacimiento:</strong> {new Date(animal.dateOfBirth).toLocaleDateString()}</div>
                    </div>

                    <div className="detail-description">
                        <h3>Descripción</h3>
                        <p>{animal.description}</p>
                    </div>

                    <div className="detail-section">
                        <h2 className="section-title">Location</h2>
                            <p className="map-disclaimer">
                                📍 Only the general are of the CP is shown
                            </p>
                        <AnimalMap zipcode={animal.animalZipcode} country="Spain" />
                    </div>

                </div>
            </div>
        </div>
    );
}