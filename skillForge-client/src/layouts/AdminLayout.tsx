import { Outlet } from 'react-router-dom';
import { AdminNavbar } from '@/components/admin/AdminNavbar';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
