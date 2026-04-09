export const loginWithGoogle = () => {
  localStorage.setItem("is_logged_in", "true");
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
};
