import { Route } from "react-router-dom";
import { RequireRole } from "@/components/common/RequireRole";
import UserInfo from "@/pages/client/UserInfo";
import { useDevice } from "@/hooks/useDevice";
import MobileLayout from "@/layouts/MobileLayout";
import DesktopLayout from "@/layouts/DesktopLayout";

export default function ClientRoute() {
  const device = useDevice();
  return (
    <Route element={<RequireRole roles={["CLIENT"]} />}>
      <Route
        element={device === "mobile" ? <MobileLayout /> : <DesktopLayout />}
      >
        <Route path="userInfo" element={<UserInfo />} />
      </Route>
    </Route>
  );
}
