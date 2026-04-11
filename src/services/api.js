import { getToken } from "../utils/auth";

const BASE_URL = "http://localhost:8080/users";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// POST /users/register
export const registerUser = (data) =>
  fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// POST /users/login
export const loginUser = (data) =>
  fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
// GET /users/me
export const getProfile = () =>
  fetch(`${BASE_URL}/me`, {
    method: "GET",
    headers: authHeaders(),
  });

  // PUT /users
export const updateProfile = (data) =>
  fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });