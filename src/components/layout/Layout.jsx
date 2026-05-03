import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import logo from '../../assets/LOGO.svg';

export default function Layout() {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
                <Outlet />
            </main>
            <footer className="border-t border-neutral-200 bg-white mt-16 py-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Safory" className="h-7 w-auto opacity-70" />
                        <span className="text-sm font-semibold text-neutral-500">Safory Ecommerce</span>
                    </div>
                    <p className="text-xs text-neutral-400">&copy; {new Date().getFullYear()} Safory Ecommerce. Tum haklar saklidir.</p>
                    <p className="text-xs text-neutral-400">Guvenli odeme &bull; Hizli teslimat &bull; Kolay iade</p>
                </div>
            </footer>
        </div>
    );
}
