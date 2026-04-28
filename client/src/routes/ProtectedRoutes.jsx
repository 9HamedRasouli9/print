import OwnerRoutes from "./roles/OwnerRoutes";


export default function ProtectedRoutes() {
  const user = { role: "owner" };
  if (user.role === "owner") return <OwnerRoutes />;
  return null;
}
