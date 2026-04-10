const TOKEN_KEY = "token";

export const saveToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const removeToken = () => sessionStorage.removeItem(TOKEN_KEY);
export const isAuthenticated = () => !!getToken();