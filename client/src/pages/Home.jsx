import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <p>Home page</p>
      <Link to="/login">Go to Login</Link>
    </>
  );
}
