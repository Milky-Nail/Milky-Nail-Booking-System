export const loginWithGoogle = () => {
  localStorage.setItem("is_logged_in", "true");
  const apiBase = import.meta.env.VITE_API_BASE_URL || "/api";
  window.location.href = `${apiBase}/auth/google`;
};
