import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../services/authService';

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
        <div className="max-w-sm mx-auto mt-16">
            <h1 className="text-xl font-semibold text-neutral-900 mb-1">Kayıt Ol</h1>
            <p className="text-sm text-neutral-400 mb-6">Yeni bir hesap oluştur.</p>

            {/* Role selector */}
            <div className="flex gap-2 mb-5">
                {['CUSTOMER', 'SELLER'].map(r => (
                    <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex-1 py-2 text-sm rounded-md border transition-colors ${role === r
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
                    >
                        {r === 'CUSTOMER' ? 'Müşteri' : 'Satıcı'}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm text-neutral-600 mb-1">Ad</label>
                        <input
                            type="text"
                            required
                            value={form.firstName}
                            onChange={e => setForm({ ...form, firstName: e.target.value })}
                            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-600 mb-1">Soyad</label>
                        <input
                            type="text"
                            required
                            value={form.lastName}
                            onChange={e => setForm({ ...form, lastName: e.target.value })}
                            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                        />
                    </div>
                </div>
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
                    <label className="block text-sm text-neutral-600 mb-1">Şifre <span className="text-neutral-400">(min. 6 karakter)</span></label>
                    <input
                        type="password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                    />
                </div>
                <div>
                    <label className="block text-sm text-neutral-600 mb-1">Telefon <span className="text-neutral-400">(opsiyonel)</span></label>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="05551234567"
                        className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-neutral-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
                </button>
            </form>

            <p className="text-sm text-neutral-500 mt-4 text-center">
                Zaten hesabın var mı?{' '}
                <Link to="/login" className="text-neutral-900 underline">
                    Giriş yap
                </Link>
            </p>
        </div>
    );
}
