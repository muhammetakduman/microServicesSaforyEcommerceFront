import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders, setLoading, setError } from '../store/slices/orderSlice';
import { orderService } from '../services/orderService';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
    PENDING: 'bg-yellow-50 text-yellow-700',
    CONFIRMED: 'bg-blue-50 text-blue-700',
    SHIPPED: 'bg-indigo-50 text-indigo-700',
    DELIVERED: 'bg-green-50 text-green-700',
    CANCELLED: 'bg-red-50 text-red-700',
};

export default function OrdersPage() {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector(state => state.orders);

    const { userId } = useSelector(state => state.auth);

    useEffect(() => {
        const load = async () => {
            dispatch(setLoading(true));
            try {
                const data = await orderService.getMyOrders(userId);
                dispatch(setOrders(Array.isArray(data) ? data : data.content ?? []));
            } catch (err) {
                dispatch(setError(err.message));
            } finally {
                dispatch(setLoading(false));
            }
        };
        if (userId) load();
    }, [userId, dispatch]);

    if (loading) return <div className="h-40 flex items-center justify-center text-sm text-neutral-400">Loading...</div>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold text-neutral-900 mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-neutral-400 text-sm mb-4">No orders yet.</p>
                    <Link to="/products" className="text-sm text-neutral-900 underline">Start shopping</Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white border border-neutral-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">Order #{order.id}</p>
                                    <p className="text-xs text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[order.status] || 'bg-neutral-100 text-neutral-600'}`}>
                                        {order.status}
                                    </span>
                                    <p className="text-sm font-semibold text-neutral-900">${Number(order.totalAmount ?? order.total).toFixed(2)}</p>
                                </div>
                            </div>
                            {order.items?.length > 0 && (
                                <ul className="text-xs text-neutral-500 space-y-0.5">
                                    {order.items.map(item => (
                                        <li key={item.id}>{item.name} &times; {item.quantity}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
