import { Layout } from "components/layouts/Layout";
import AdminNavbar from "./components/AdminNavbar";

export const Admin = () => {
  return (
    <Layout navbar={<AdminNavbar />}>
      <h1>Admin</h1>
    </Layout>
  );
}

export { User } from './user'
export { Role } from './role'

