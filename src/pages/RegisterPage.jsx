import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import logo from '../assets/LOGO.svg';

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [role, setRole] = useState('CUSTOMER');
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = { ...form };
            if (!payload.phone) delete payload.phone;
            const data = role === 'CUSTOMER'
                ? await authService.registerCustomer(payload)
                : await authService.registerSeller(payload);
            dispatch(setCredentials({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                userId: data.userId,
                role: data.role,
                email: data.email,
            }));
            navigate('/');
        } catch (err) {
            setError(err.message || 'Kayıt başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <img src={logo} alt="Safory" className="h-14 w-auto mb-3" />
                <h1 className="text-xl font-bold text-neutral-900">Safory Ecommerce</h1>
                <p className="text-sm text-neutral-400 mt-1">Yeni bir hesap olustur</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-7 shadow-sm">
                {/* Role selector */}
                <div className="flex gap-2 mb-5">
                    {['CUSTOMER', 'SELLER'].map(r => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`flex-1 py-2 text-sm rounded-lg border transition-colors font-medium ${role === r
                                ? 'bg-neutral-900 text-white border-neutral-900'
                                : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
                        >
                            {r === 'CUSTOMER' ? 'Musteri' : 'Satici'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Ad</label>
                            <input
                                type="text"
                                required
                                value={form.firstName}
                                onChange={e => setForm({ ...form, firstName: e.target.value })}
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Soyad</label>
                            <input
                                type="text"
                                required
                                value={form.lastName}
                                onChange={e => setForm({ ...form, lastName: e.target.value })}
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">E-posta</label>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="ornek@mail.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Sifre <span className="text-neutral-400 font-normal">(min. 6 karakter)</span>
                        </label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            autoComplete="new-password"
                            placeholder="Sifreniz"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Telefon <span className="text-neutral-400 font-normal">(opsiyonel)</span>
                        </label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            placeholder="05551234567"
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition"
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
                        {loading ? 'Hesap olusturuluyor...' : 'Kayit Ol'}
                    </button>
                </form>

                <p className="text-sm text-neutral-500 mt-5 text-center">
                    Zaten hesabin var mi?{' '}
                    <Link to="/login" className="text-neutral-900 font-semibold hover:underline">
                        Giris yap
                    </Link>
                </p>
            </div>
        </div>
    );
}
