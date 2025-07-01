import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useLogout() {
  const { t } = useTranslation();

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    // Clear local storage ngay lập tức để UI cập nhật nhanh
    localStorage.removeItem("refreshToken");
    console.log(t("logout.local_storage_cleared"));

    if (!refreshToken) {
      console.log(t("logout.no_refresh_token"));
      return;
    }

    try {
      console.log(t("logout.backend_call_attempt"));
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const responseText = await response.json();

      if (!response.ok) {
        console.error(
          t("logout.backend_call_failed", {
            status: response.status,
            responseText,
          })
        );
      } else {
        console.log(t("logout.backend_call_success"), responseText);
      }
    } catch (err) {
      console.error(t("logout.backend_call_error"), err);
    }
  }, [t]);

  return { logout };
}
