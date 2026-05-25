import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { markInterest } from '../services/api';
import { PhotoCarousel } from './PostFeed.jsx';
import '../styles/AnimalDetail.css';
import AnimalMap from './AnimalMap.jsx';

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
                Loading(false);
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
                setInterestMessage('You have already showed interest in this pet.');
                return;
            }
            if (!res.ok) {
                setInterestState('error');
                setInterestMessage("Your interest could not be registered. Try again.");
                return;
            }

            const data = await res.json();
            setInterestState('done');
            setInterestMessage(
                data.message || "Your interest has been registered! The pet's owner will receive your contact information."
            );
        } catch {
            setInterestState('error');
            setInterestMessage('Conexion error. Try again.');
        }
    };


    if (loading) return <div className="pf-message">Loading information...</div>;
    if (!animal) return <div className="pf-message">The animal's information was not found.</div>;

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
                        <h2 className="section-title">Pet information</h2>
                        <div className="info-box"><strong>Size:</strong> {animal.size}</div>
                        <div className="info-box"><strong>Location:</strong> PC {animal.animalZipcode}</div>
                        <div className="info-box"><strong>Birthdate:</strong> {new Date(animal.dateOfBirth).toLocaleDateString()}</div>
                    </div>

                    <div className="detail-description">
                        <h3>Description</h3>
                        <p>{animal.description}</p>
                    </div>

                    {/* renderizado de la información de la raza (de la rama apis) */}
                    {animal.breedName && (
                        <div className="detail-breed-card">
                            <h3 className="breed-card-title">Breed Information: {animal.breedName}</h3>
                            <div className="breed-card-content">
                                <p><strong>General Info:</strong> {animal.breedGeneralInfo || 'No extra info available.'}</p>
                                <p><strong>Traits:</strong> {animal.breedRelevantCharacteristics || 'N/A'}</p>

                                {animal.breedCareRecommendations && (
                                    <div className="breed-care-alert">
                                        <strong>Care Recommendations:</strong>
                                        <p>{animal.breedCareRecommendations}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Botón de interés y su feedback (de la rama main) */}
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

                    <div className="detail-section">
                        <h2 className="section-title">Location</h2>
                        <p className="map-disclaimer">
                            📍 Only the general area of the CP is shown
                        </p>
                        <AnimalMap zipcode={animal.animalZipcode} country="Mexico" />
                    </div>

                </div>
            </div>
        </div>
    );
}