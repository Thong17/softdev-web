import { Layout } from "components/layouts/Layout";
import AdminNavbar from "./components/AdminNavbar";
import { useOutlet } from "react-router";

export const Admin = () => {
  const outlet = useOutlet()

  return (
    <Layout navbar={<AdminNavbar />}>
      { outlet || <h1>Admin</h1> }
    </Layout>
  );
}

export { User } from './user'
export { Role } from './role'

