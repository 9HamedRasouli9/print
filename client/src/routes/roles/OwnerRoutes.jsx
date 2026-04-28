import { Route, Routes } from "react-router-dom";
import OwnerLayout from "../../layout/OwnerLayout";
import OwnerDashboard from "../../pages/OwnerDashboard";
import Customer from "../../pages/Customers";

export default function OwnerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OwnerLayout />}>
        <Route index element={<OwnerDashboard />} />
        <Route path="customer" element={<Customer />} />
      </Route>
    </Routes>
  );
}
