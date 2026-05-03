import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="border-t border-neutral-200 mt-16 py-8 text-center text-sm text-neutral-400">
                &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
            </footer>
        </div>
    );
}
