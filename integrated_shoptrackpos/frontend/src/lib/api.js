export const API_BASE_URL = "http://localhost:8000/api"; // Adjust if backend runs elsewhere

export const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

export const setAuthTokens = (access, refresh) => {
  localStorage.setItem("accessToken", access);
  if (refresh) {
    localStorage.setItem("refreshToken", refresh);
  }
};

export const removeAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Basic fetch wrapper
export const apiClient = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Attempt to parse error details from backend
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { detail: response.statusText };
    }
    console.error("API Error:", errorData);
    // Throw an error object that includes status and parsed data
    const error = new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // Handle responses with no content (e.g., 204 No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

