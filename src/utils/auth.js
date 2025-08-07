// src/utils/auth.js
const fetchWithAuth = async (url, options = {}) => {
  // Check if localStorage is available (for SSR/SSG safety)
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  // If no token and we are not on the login page, redirect
  if (!token && !url.includes("/AdminLogin")) {
    // Avoid redirecting endlessly from the login page itself
    // Use window.location for full page reload to clear state
    if (typeof window !== "undefined") {
      window.location.href = "/AdminLogin";
    }
    throw new Error("Not authenticated");
  }

  const headers = {
    ...options.headers,
    // Only add Authorization header if a token exists
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 specifically even if the initial token check passed (e.g., token expired mid-session)
  if (response.status === 401) {
    // Token expired or invalid
    // Clear authentication data
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRole");
      localStorage.removeItem("adminUsername");
      localStorage.removeItem("adminId");
      localStorage.removeItem("isAdminLoggedIn");
    }
    // Use window.location for full page reload to clear state
    if (typeof window !== "undefined") {
      window.location.href = "/AdminLogin";
    }
    throw new Error("Session expired. Please login again.");
  }

  return response;
};

export { fetchWithAuth };
