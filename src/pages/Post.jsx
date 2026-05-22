import { useState } from "react";
import { registerAnimal, uploadPhoto } from "../services/api";
import "../styles/Post.css";

const MAX_PHOTOS = 5;

const INITIAL_FORM = {
  animalName:    "",
  species:       "",
  dateOfBirth:   "",
  description:   "",
  size:          "",
  animalZipcode: "",
  breedId:       "",
};

export default function Post({ onSuccess, onClose }) {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [photos, setPhotos]   = useState([]);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const files     = Array.from(e.target.files);
    const remaining = MAX_PHOTOS - photos.length;

    if (files.length > remaining) {
      setError(`You can only upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    setError("");
    e.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.animalName || !form.species || !form.animalZipcode) {
      setError("Name, species and zipcode are required.");
      return;
    }

    if (photos.length === 0) {
      setError("At least one photo is required.");
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const photo of photos) {
        const res = await uploadPhoto(photo.file);
        if (!res.ok) {
          setError("Failed to upload one or more photos.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        uploadedUrls.push({ url: data.url });
      }

      const animalRequest = {
        animalName:    form.animalName,
        species:       form.species,
        dateOfBirth:   form.dateOfBirth || null,
        description:   form.description || null,
        size:          form.size || null,
        animalZipcode: form.animalZipcode,
        publishedAt:   new Date().toISOString(),
        breedId:       form.breedId ? parseInt(form.breedId) : null,
        photos:        uploadedUrls,
      };

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
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
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
        <label className="post-form-label">Species *</label>
        <select className="post-form-select" name="species" onChange={handleChange}>
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
          max={new Date().toISOString().split('T')[0]}
          onChange={handleChange}
        />
      </div>

      <div className="post-form-group">
        <label className="post-form-label">Size</label>
        <select className="post-form-select" name="size" onChange={handleChange}>
          <option value="">Select Size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="extra_large">Extra Large</option>
        </select>
      </div>

      <div className="post-form-group">
        <label className="post-form-label">Zip Code *</label>
        <input
          className="post-form-input"
          name="animalZipcode"
          placeholder="Zip Code"
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

      {/* Photo upload */}
      <div className="post-form-group">
        <label className="post-form-label">
          Photos ({photos.length}/{MAX_PHOTOS}) *
        </label>

        {photos.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "8px 0" }}>
            {photos.map((photo, i) => (
              <div key={i} style={{ position: "relative", width: "72px", height: "72px" }}>
                <img
                  src={photo.preview}
                  alt={`preview ${i + 1}`}
                  style={{
                    width: "72px", height: "72px",
                    objectFit: "cover", borderRadius: "8px",
                    border: "2px solid var(--border-color)"
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  style={{
                    position: "absolute", top: "-6px", right: "-6px",
                    background: "#c33", color: "#fff", border: "none",
                    borderRadius: "50%", width: "20px", height: "20px",
                    cursor: "pointer", fontSize: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < MAX_PHOTOS && (
          <label style={{
            display: "block", padding: "10px", textAlign: "center",
            border: "2px dashed var(--border-color)", borderRadius: "10px",
            cursor: "pointer", color: "var(--text-secondary)", fontSize: "0.9rem"
          }}>
            + Add photos
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </label>
        )}
      </div>

      {error   && <p className="post-form-error">{error}</p>}
      {success && <p className="post-form-success">{success}</p>}

      <div className="post-form-actions">
        <button className="post-btn-cancel" type="button" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="post-btn-submit" type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

    </form>
  );
}