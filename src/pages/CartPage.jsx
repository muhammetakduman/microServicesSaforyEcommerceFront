import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCart, setCartLoading, clearCartState } from '../store/slices/cartSlice';
import { cartService } from '../services/orderService';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount, loading } = useSelector(state => state.cart);
    const { userId } = useSelector(state => state.auth);

    useEffect(() => {
        const load = async () => {
            dispatch(setCartLoading(true));
            try {
                const data = await cartService.getCart(userId);
                dispatch(setCart(data));
            } catch { /* ignore */ } finally {
                dispatch(setCartLoading(false));
            }
        };
        if (userId) load();
    }, [userId, dispatch]);

    const handleUpdate = async (itemId, qty) => {
        if (qty < 1) return;
        try {
            const data = await cartService.updateItem(userId, itemId, qty);
            dispatch(setCart(data));
        } catch { /* ignore */ }
    };

    const handleRemove = async (itemId) => {
        try {
            const data = await cartService.removeItem(userId, itemId);
            dispatch(setCart(data));
        } catch { /* ignore */ }
    };

    const handleClear = async () => {
        try {
            await cartService.clearCart(userId);
            dispatch(clearCartState());
        } catch { /* ignore */ }
    };

    if (loading) return <div className="h-40 flex items-center justify-center text-sm text-neutral-400">Yukleniyor...</div>;

    if (items.length === 0) {
        return (
            <div className="text-center py-24">
                <p className="text-neutral-400 text-sm mb-4">Sepetin bos.</p>
                <Link to="/products" className="text-sm text-neutral-900 underline">Urunlere goz at</Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold text-neutral-900 mb-6">Sepet</h1>

            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.itemId} className="flex items-center gap-4 bg-white border border-neutral-200 rounded-lg p-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">{item.productName}</p>
                            <p className="text-sm text-neutral-400">{Number(item.unitPrice).toFixed(2)} TL</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleUpdate(item.itemId, item.quantity - 1)}
                                className="w-7 h-7 border border-neutral-200 rounded text-sm hover:border-neutral-400 transition-colors"
                            >-</button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button
                                onClick={() => handleUpdate(item.itemId, item.quantity + 1)}
                                className="w-7 h-7 border border-neutral-200 rounded text-sm hover:border-neutral-400 transition-colors"
                            >+</button>
                        </div>
                        <p className="text-sm font-medium text-neutral-900 w-20 text-right">
                            {Number(item.lineTotal).toFixed(2)} TL
                        </p>
                        <button
                            onClick={() => handleRemove(item.itemId)}
                            className="text-neutral-300 hover:text-neutral-600 transition-colors text-lg leading-none"
                        >&times;</button>
                    </div>
                ))}
            </div>

            <div className="mt-6 border-t border-neutral-200 pt-6 flex justify-between items-center">
                <button onClick={handleClear} className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
                    Sepeti temizle
                </button>
                <div className="text-right">
                    <p className="text-sm text-neutral-500 mb-1">Toplam</p>
                    <p className="text-xl font-semibold text-neutral-900 mb-4">{Number(totalAmount).toFixed(2)} TL</p>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="bg-neutral-900 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors"
                    >
                        Odeme Yap
                    </button>
                </div>
            </div>
        </div>
    );
}
