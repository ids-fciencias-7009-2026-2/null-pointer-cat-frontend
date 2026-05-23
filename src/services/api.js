/**
 * API service module for handling all HTTP requests to the backend.
 *
 * Base URL: http://localhost:8080/users
 * All authenticated requests include a Bearer token in the Authorization header.
 */

import { getToken } from "../utils/auth";

const BASE_URL = "http://localhost:8080/users";

/**
 * Builds the headers required for authenticated requests.
 * Retrieves the session token from sessionStorage and includes it
 * in the Authorization header using the Bearer scheme.
 *
 * @returns {Object} Headers object with Content-Type and Authorization fields.
 */
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/**
 * Registers a new user in the system.
 *
 * URL:    POST /users/register
 * Auth:   Not required
 *
 * @param {Object} data - User registration data (username, email, password, firstname, lastname, zipcode).
 * @returns {Promise<Response>} Fetch response from the backend.
 */
export const registerUser = (data) =>
  fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

/**
 * Authenticates a user using their email and password.
 *
 * URL:    POST /users/login
 * Auth:   Not required
 *
 * @param {Object} data - Login credentials (email, password).
 * @returns {Promise<Response>} Fetch response containing the session token on success.
 */
export const loginUser = (data) =>
  fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

/**
 * Retrieves the profile of the currently authenticated user.
 *
 * URL:    GET /users/me
 * Auth:   Required (Bearer token in headers)
 *
 * @returns {Promise<Response>} Fetch response containing the user's profile data.
 */
export const getProfile = () =>
  fetch(`${BASE_URL}/me`, {
    method: "GET",
    headers: authHeaders(),
  });

/**
 * Updates the profile of the currently authenticated user.
 *
 * URL:    PUT /users
 * Auth:   Required (Bearer token in headers)
 *
 * @param {Object} data - Updated user data (e.g., username, firstname, lastname, zipcode, etc.).
 * @returns {Promise<Response>} Fetch response with the updated user information.
 */
export const updateProfile = (data) =>
  fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  


const ANIMALS_URL = "http://localhost:8080/animals";

export const searchAnimals = ({ species, size, zipcode, breedName } = {}) => {
  const params = new URLSearchParams();
  if (species)   params.append("species",   species);
  if (size)      params.append("size",      size);
  if (zipcode)   params.append("zipcode",   zipcode);
  if (breedName) params.append("breedName", breedName);

  const query = params.toString();
  return fetch(`${ANIMALS_URL}${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: authHeaders(),
  });
};


export const registerAnimal = (data) =>
  fetch(`${ANIMALS_URL}/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const getMyAnimals = () =>
  fetch(`${ANIMALS_URL}/my_animals`, {
    method: "GET",
    headers: authHeaders(),
  });

export const updateAnimal = (id, data) =>
  fetch(`${ANIMALS_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });


const PHOTOS_URL = "http://localhost:8080/photos";

export const uploadPhoto = (file) => {
  const formData = new FormData()
  formData.append("file", file)
  return fetch(`${PHOTOS_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  })
}
