import { Outlet } from "react-router-dom";
export default function OwnerLayout() {
  return (
    <>
      <p>OwnerLayout page</p>
      <div>
        <Outlet />
      </div>
    </>
  );
}
