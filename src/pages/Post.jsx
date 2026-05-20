import { useState } from "react";
import { registerAnimal } from "../services/api";
import "../styles/Post.css";

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

export default function Post({ onSuccess, onClose }) {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.animalName || !form.species || !form.animalZipcode) {
      setError("Name, species and zipcode are required.");
      return;
    }

    if (!form.photoUrl) {
      setError("At least one photo URL is required.");
      return;
    }

    setLoading(true)

    const animalRequest = {
      animalName: form.animalName,
      species: form.species,
      dateOfBirth: form.dateOfBirth || null,
      description: form.description || null,
      size: form.size || null,
      animalZipcode: form.animalZipcode,
      publishedAt: new Date().toISOString(),
      breedId: form.breedId ? parseInt(form.breedId) : null,
      photos: form.photoUrl ? [{ url: form.photoUrl }] : [],
    };

    try {
      const res = await registerAnimal(animalRequest);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Failed to register animal.");
        return;
      }
      const data = await res.json();
      setSuccess("Animal registered successfully!");
      setTimeout(() => {
        onSuccess?.(data);
        onClose?.();
      }, 1500);
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
        setLoading(false)
    }
  };

  return (
  <form className="post-form" onSubmit={handleSubmit}>

      <div className="post-form-group">
        <label className="post-form-label">Animal Name *</label>
        <input
          className="post-form-input"
          name="animalName"
          placeholder="Animal Name"
          onChange={handleChange}
        />
      </div>

      <div className="post-form-group">
        <label className="post-form-label">Species</label>
        <select
          className="post-form-select"
          name="species"
          onChange={handleChange}
        >
          <option value="">Select Species</option>
          <option value="DOG">Dog</option>
          <option value="CAT">Cat</option>
        </select>
      </div>

      <div className="post-form-group">
        <label className="post-form-label">Date of Birth</label>
        <input
          className="post-form-input"
          name="dateOfBirth"
          type="date"
          onChange={handleChange}
        />
      </div>

      <div className="post-form-group">
        <label className="post-form-label">Size</label>
        <select
          className="post-form-select"
          name="size"
          onChange={handleChange}
        >
          <option value="">Select Size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="extra_large">Extra Large</option>
        </select>
      </div>

      <div className="post-form-group">
        <label className="post-form-label">Zip Code</label>
        <input
          className="post-form-input"
          name="animalZipcode"
          placeholder="Zip Code"
          onChange={handleChange}
        />
      </div>

      <div className="post-form-group">
        <label className="post-form-label">Photo URL</label>
        <input
          className="post-form-input"
          name="photoUrl"
          placeholder="Photo URL (http://...)"
          onChange={handleChange}
        />
      </div>

      <div className="post-form-group">
        <label className="post-form-label">Description</label>
        <textarea
          className="post-form-textarea"
          name="description"
          placeholder="Tell us about this animal..."
          onChange={handleChange}
        />
      </div>

      {error && <p className="post-form-error">{error}</p>}
      {success && <p className="post-form-success">{success}</p>}

    <div className="post-form-actions">
      <button
        className="post-btn-cancel"
        type="button"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        className="post-btn-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </div>

    </form>
  );
}