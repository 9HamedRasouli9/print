import { Route, Routes } from "react-router-dom";
import OwnerLayout from "../../layout/OwnerLayout";
import OwnerDashboard from "../../pages/OwnerDashboard";
import Customer from "../../pages/Customers";
import Orders from "../../pages/Orders";
import PrintJobs from "../../pages/PrintJobs";
import Invoices from "../../pages/Invoices";
import Settings from "../../pages/Settings";

export default function OwnerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OwnerLayout />}>
        <Route index element={<OwnerDashboard />} />
        <Route path="customer" element={<Customer />} />
        <Route path="orders" element={<Orders />} />
        <Route path="prints" element={<PrintJobs />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
