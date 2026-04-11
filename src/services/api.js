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

  