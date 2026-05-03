import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../services/authService';

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
            setError(err.message || 'E-posta veya şifre hatalı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-16">
            <h1 className="text-xl font-semibold text-neutral-900 mb-1">Giriş Yap</h1>
            <p className="text-sm text-neutral-400 mb-6">Hesabına giriş yap.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-neutral-600 mb-1">E-posta</label>
                    <input
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                    />
                </div>
                <div>
                    <label className="block text-sm text-neutral-600 mb-1">Şifre</label>
                    <input
                        type="password"
                        required
                        autoComplete="current-password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-neutral-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </button>
            </form>

            <p className="text-sm text-neutral-500 mt-4 text-center">
                Hesabın yok mu?{' '}
                <Link to="/register" className="text-neutral-900 underline">
                    Kayıt ol
                </Link>
            </p>
        </div>
    );
}
