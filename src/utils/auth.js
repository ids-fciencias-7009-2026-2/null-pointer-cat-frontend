/**
 * Authentication utility module for managing the user session token.
 *
 * The session token is stored in sessionStorage under a fixed key.
 * sessionStorage is scoped to the browser tab and is automatically
 * cleared when the tab or browser is closed.
 */

const TOKEN_KEY = "token";
export const saveToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const removeToken = () => sessionStorage.removeItem(TOKEN_KEY);
export const isAuthenticated = () => !!getToken();