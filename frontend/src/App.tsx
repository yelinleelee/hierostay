import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/LoginPage";
import { MyPage } from "./pages/MyPage";
import { StaysPage } from "./pages/Stays";
import { StayDetailPage } from "./pages/StayDetail";
import { MyBookingsPage } from "./pages/Bookings/MyBookings";
import { HostBookingsPage } from "./pages/HostBookings";
import { MessagesPage } from "./pages/MessagesPage";
import { HostDashboard } from "./pages/Host/Dashboard";
import { HostCalendarPage } from "./pages/Host/Calendar";
import { HostListingsPage } from "./pages/Host/Listings";
import { HostMessagesPage } from "./pages/Host/Messages";
import { BrandStoryPage } from "./pages/BrandStory";
import { AboutPage } from "./pages/About";
import { NeighborhoodPage } from "./pages/Neighborhood";
import { HieroLandingPage } from "./pages/Host/Hiero";
import { LaunchingPage } from "./pages/Host/Launching";
import { RegisterLayout } from "./host/RegisterLayout";
import { SelectMethod } from "./host/SelectMethod";
import { TypeStep } from "./host/steps/TypeStep";
import { BasicsStep } from "./host/steps/BasicsStep";
import { DescriptionStep } from "./host/steps/DescriptionStep";
import { LocationStep } from "./host/steps/LocationStep";
import { PhotosStep } from "./host/steps/PhotosStep";
import { PriceStep } from "./host/steps/PriceStep";
import { SuccessStep } from "./host/steps/SuccessStep";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/stays" element={<StaysPage />} />
            <Route path="/stays/:id" element={<StayDetailPage />} />
            <Route path="/brand-story" element={<BrandStoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/neighborhood" element={<NeighborhoodPage />} />
            <Route path="/host/hiero" element={<HieroLandingPage />} />
            <Route path="/host/launching" element={<LaunchingPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/bookings/my" element={<MyBookingsPage />} />
              <Route path="/messages" element={<MessagesPage />} />

              <Route path="/host/register/select" element={<SelectMethod />} />
              <Route path="/host/register" element={<RegisterLayout />}>
                <Route index element={<Navigate to="type" replace />} />
                <Route path="type" element={<TypeStep />} />
                <Route path="basics" element={<BasicsStep />} />
                <Route path="description" element={<DescriptionStep />} />
                <Route path="location" element={<LocationStep />} />
                <Route path="photos" element={<PhotosStep />} />
                <Route path="price" element={<PriceStep />} />
                <Route path="success" element={<SuccessStep />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requireHost />}>
              <Route path="/host" element={<HostDashboard />} />
              <Route path="/host/bookings" element={<HostBookingsPage />} />
              <Route path="/host/calendar" element={<HostCalendarPage />} />
              <Route path="/host/listings" element={<HostListingsPage />} />
              <Route path="/host/messages" element={<HostMessagesPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
