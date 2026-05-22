import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { markInterest } from '../services/api';
import { PhotoCarousel } from './PostFeed.jsx';
import '../styles/AnimalDetail.css';

export default function AnimalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [interestState, setInterestState] = useState('idle');
    const [interestMessage, setInterestMessage] = useState('');

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

    const handleInterest = async () => {
            setInterestState('loading');
            setInterestMessage('');
            try {
                const res = await markInterest(id);

                // 409 = ya manifestaste interés (o no se pudo guardar)
                if (res.status === 409) {
                    setInterestState('done');
                    setInterestMessage('Parece que ya manifestaste interés en este animal.');
                    return;
                }
                if (!res.ok) {
                    setInterestState('error');
                    setInterestMessage('No se pudo registrar tu interés. Intenta de nuevo.');
                    return;
                }

                const data = await res.json();
                setInterestState('done');
                setInterestMessage(
                    data.message || '¡Tu interés ha sido registrado! El dueño recibirá tus datos.'
                );
            } catch {
                setInterestState('error');
                setInterestMessage('Error de conexión. Intenta de nuevo.');
            }
    };


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

                    <button
                          className="interest-btn"
                          onClick={handleInterest}
                          disabled={interestState === 'loading' || interestState === 'done'}
                    >
                          {interestState === 'loading' ? 'Enviando...'
                                       : interestState === 'done' ? '✓ Interés registrado'
                                       : 'Me interesa'}
                    </button>

                    {interestMessage && (
                        <p className={`interest-message ${interestState === 'error'
                            ? 'interest-message--error'
                            : 'interest-message--success'}`}>
                            {interestMessage}
                        </p>
                    )}


                    <div className="map-placeholder">
                        <span>Mapa (Próximamente)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}