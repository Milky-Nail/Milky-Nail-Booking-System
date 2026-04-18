import apiClient from "../../api/client";

export const loginWithLine = async () => {
  const data = await apiClient.post(
    `auth/line/init`,
    {},
    { withCredentials: true }
  );
  const state = (data as unknown as { state: string }).state;
  const clientId = import.meta.env.VITE_LINE_CHANNEL_ID;
  //encodeURIComponent轉譯成UTF-8
  const redirectUri = encodeURIComponent(
    `${import.meta.env.VITE_API_FULL_URL}/auth/line/callback`
  );
  const scope = "profile openid email";
  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&prompt=consent`; //prompt=consent強制每次都要同意授權，避免靜默授權 (Silent Login)
  window.location.href = lineAuthUrl;
};
