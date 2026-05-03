import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import logo from '../assets/LOGO.svg';

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.loginUser(form.email, form.password);
            dispatch(setCredentials({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                userId: data.userId,
                role: data.role,
                email: data.email,
            }));
            navigate('/');
        } catch (err) {
            setError(err.message || 'E-posta veya sifre hatali.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-12">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <img src={logo} alt="Safory" className="h-14 w-auto mb-3" />
                <h1 className="text-xl font-bold text-neutral-900">Safory Ecommerce</h1>
                <p className="text-sm text-neutral-400 mt-1">Hesabina giris yap</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-7 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">E-posta</label>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition"
                            placeholder="ornek@mail.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Sifre</label>
                        <input
                            type="password"
                            required
                            autoComplete="current-password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition"
                            placeholder="Sifreniz"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neutral-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50 mt-1"
                    >
                        {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
                    </button>
                </form>

                <p className="text-sm text-neutral-500 mt-5 text-center">
                    Hesabin yok mu?{' '}
                    <Link to="/register" className="text-neutral-900 font-semibold hover:underline">
                        Kayit ol
                    </Link>
                </p>
            </div>
        </div>
    );
}
