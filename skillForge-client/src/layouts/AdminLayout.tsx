import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/admin/AdminNavbar/AdminNavbar';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-muted/40">
            <AdminNavbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
