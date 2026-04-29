import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";


export default function PublicRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}
