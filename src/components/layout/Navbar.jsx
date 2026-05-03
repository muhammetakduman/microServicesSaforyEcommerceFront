import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { clearCartState } from '../../store/slices/cartSlice';
import { selectCartCount } from '../../store/slices/cartSlice';
import { authService } from '../../services/authService';

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

    return (
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/" className="text-base font-semibold text-neutral-900 tracking-tight">
                    ShopHub
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/products" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                        Products
                    </Link>

                    {isAuthenticated && role === 'CUSTOMER' && (
                        <Link to="/cart" className="relative text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-neutral-800 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            {role === 'CUSTOMER' && (
                                <Link to="/orders" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                                    Orders
                                </Link>
                            )}
                            {role === 'SELLER' && (
                                <>
                                    <Link to="/seller" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                                        My Products
                                    </Link>
                                    <Link to="/seller/orders" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                                        Sales
                                    </Link>
                                </>
                            )}
                            {role === 'ADMIN' && (
                                <>
                                    <Link to="/admin" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                                        Pending Products
                                    </Link>
                                    <Link to="/admin/orders" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                                        All Orders
                                    </Link>
                                </>
                            )}
                            <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                                {role}
                            </span>
                            <span className="text-sm text-neutral-500 hidden sm:block">{email}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm bg-neutral-900 text-white px-4 py-1.5 rounded-md hover:bg-neutral-700 transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
