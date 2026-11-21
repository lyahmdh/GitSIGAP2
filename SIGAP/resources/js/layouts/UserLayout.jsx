import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function UserLayout() {
    return <div className="min-h-screen bg-cream"><Navbar /><main className="mx-auto max-w-7xl p-5 md:p-8"><Outlet /></main></div>;
}
