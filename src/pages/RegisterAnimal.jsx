import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAnimal } from "../services/api";
import "../styles/Register.css";

const INITIAL_FORM = {
  animalName: "",
  species: "",
  dateOfBirth: "",
  description: "",
  size: "",
  animalZipcode: "",
  breedId: "",
  photoUrl: "",
};

export default function RegisterAnimal() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.animalName || !form.species || !form.animalZipcode) {
    setError("Name, species and zipcode are requireds");
      return;
    }

    if (!form.photoUrl) {
        setError("At least one photo URL is required.")
        return
    }
    
    if (form.dateOfBirth && form.dateOfBirth > new Date().toISOString().split('T')[0]) {
        setError("Date of birth cannot be in the future.")
        return
    }


    const animalRequest = {
      animalName: form.animalName,
      species: form.species,
      dateOfBirth: form.dateOfBirth || null,
      description: form.description || null,
      size: form.size || null,
      animalZipcode: form.animalZipcode,
      publishedAt: new Date().toISOString(),
      breedId: form.breedId ? parseInt(form.breedId) : null,
      photos: form.photoUrl ? [{ url: form.photoUrl }] : []
    };

    try {
      const res = await registerAnimal(animalRequest);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Failed to register animal.");
        return;
      }
      setError("");
      setSuccess("Animal registered successfullly!");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="register-container">
        <h2 className="register-title">Register Animal</h2>

        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}

        <input className="register-input" name="animalName" placeholder="Animal Name" onChange={handleChange} />

        <input className="register-input" name="species" placeholder="Species" onChange={handleChange} />

        <input className="register-input" name="dateOfBirth" type="date" onChange={handleChange} />

        <select className="register-input" name="size" onChange={handleChange} style={{ appearance: 'none' }}>
            <option value="">Select Size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra_large">Extra Large</option>
        </select>

        <input className="register-input" name="animalZipcode" placeholder="Zip code" onChange={handleChange} />

        <input className="register-input" name="photoUrl" placeholder="Photo URL (http://...)" onChange={handleChange} />

        <textarea
          className="register-input"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          style={{ minHeight: "80px", paddingTop: "10px" }}
        />

        <button className="register-button" onClick={handleRegister}>
          Register Animal
        </button>

        <p className="register-footer">
          <Link to="/dashboard">Cancel</Link>
        </p>
      </div>
    </div>
  );
}