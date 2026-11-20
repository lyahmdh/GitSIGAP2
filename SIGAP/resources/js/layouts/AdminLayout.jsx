import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
                <Sidebar admin />
                <main className="min-w-0 flex-1 p-5 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}