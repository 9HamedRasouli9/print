import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/app/*" element={<ProtectedRoutes />} />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}
