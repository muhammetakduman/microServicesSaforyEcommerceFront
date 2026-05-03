import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { clearCartState } from '../../store/slices/cartSlice';
import { selectCartCount } from '../../store/slices/cartSlice';
import { authService } from '../../services/authService';
import logo from '../../assets/LOGO.svg';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, email, role, userId } = useSelector(state => state.auth);
    const cartCount = useSelector(selectCartCount);

    const handleLogout = async () => {
        try { await authService.logout(userId); } catch { /* ignore */ }
        dispatch(logout());
        dispatch(clearCartState());
        navigate('/');
    };

    const navLink = 'text-sm text-neutral-500 hover:text-neutral-900 transition-colors font-medium';

    return (
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <img src={logo} alt="Safory" className="h-8 w-auto" />
                    <span className="text-base font-bold text-neutral-900 tracking-tight group-hover:text-neutral-700 transition-colors">
                        Safory<span className="text-neutral-400 font-normal">Ecommerce</span>
                    </span>
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-7">
                    <Link to="/products" className={navLink}>
                        Ürünler
                    </Link>

                    {isAuthenticated && role === 'CUSTOMER' && (
                        <Link to="/cart" className={`${navLink} relative`}>
                            Sepet
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-4 bg-neutral-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-5">
                            {role === 'CUSTOMER' && (
                                <Link to="/orders" className={navLink}>
                                    Siparişlerim
                                </Link>
                            )}
                            {role === 'SELLER' && (
                                <>
                                    <Link to="/seller" className={navLink}>Ürünlerim</Link>
                                    <Link to="/seller/orders" className={navLink}>Satışlarım</Link>
                                </>
                            )}
                            {role === 'ADMIN' && (
                                <>
                                    <Link to="/admin" className={navLink}>Onay Bekleyenler</Link>
                                    <Link to="/admin/orders" className={navLink}>Tüm Siparişler</Link>
                                </>
                            )}

                            <div className="flex items-center gap-3 pl-3 border-l border-neutral-200">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-neutral-400 leading-none">{email}</p>
                                    <p className="text-xs font-semibold text-neutral-600 mt-0.5">{role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs border border-neutral-200 text-neutral-600 px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-colors font-medium"
                                >
                                    Çıkış
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className={navLink}>
                                Giriş Yap
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors font-medium"
                            >
                                Kayıt Ol
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
