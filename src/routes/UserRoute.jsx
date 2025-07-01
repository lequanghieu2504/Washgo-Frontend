import { Outlet, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Logout from "@/pages/auth/Logout";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ChangePassword from "@/pages/auth/ChangePassword";
import OtpVerification from "@/components/common/OtpVerification";
import Home from "@/pages/visitor/Home";
import Search from "@/pages/visitor/Search";
import CarwashProfile from "@/pages/visitor/CarwashProfile";
import { useDevice } from "@/hooks/useDevice";
import MobileLayout from "@/layouts/MobileLayout";
import DesktopLayout from "@/layouts/DesktopLayout";
import CarwashMap from "@/pages/visitor/CarwashMap";
import UserInfo from "@/pages/client/UserInfo";
import UserProfile from "@/pages/client/UserProfile";
import BookingConfirmation from "@/pages/visitor/BookingConfirmation";
import { Test } from "@/components/debugging";

export default function UserRoute() {
  const device = useDevice();

  return (
    <Route path="/" element={<Outlet />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="logout" element={<Logout />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="otp-verification" element={<OtpVerification />} />
      <Route path="userInfo" element={<UserInfo />} />
      <Route path="userProfile" element={<UserProfile />} />
      <Route path="change-password" element={<ChangePassword />} />
      <Route path="confirm-booking" element={<BookingConfirmation />} />
      <Route path="test" element={<Test />} />

      <Route
        element={device === "mobile" ? <MobileLayout /> : <DesktopLayout />}
      >
        <Route path="map" element={<CarwashMap />} />
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="carwash/:id" element={<CarwashProfile />} />
      </Route>
    </Route>
  );
}
