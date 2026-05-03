import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';

const STATUS_STYLES = {
    PENDING: 'bg-yellow-50 text-yellow-700',
    STOCK_RESERVED: 'bg-blue-50 text-blue-600',
    PAYMENT_TRIGGERED: 'bg-indigo-50 text-indigo-700',
    COMPLETED: 'bg-green-50 text-green-700',
    STOCK_FAILED: 'bg-orange-50 text-orange-600',
    PAYMENT_FAILED: 'bg-red-50 text-red-500',
    CANCELLED: 'bg-neutral-100 text-neutral-500',
};

const ALL_STATUSES = [
    'PENDING',
    'STOCK_RESERVED',
    'PAYMENT_TRIGGERED',
    'COMPLETED',
    'STOCK_FAILED',
    'PAYMENT_FAILED',
    'CANCELLED',
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [statusDropdown, setStatusDropdown] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await orderService.getAllOrders();
                setOrders(Array.isArray(data) ? data : data.content ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleForceStatus = async (orderId, status) => {
        setUpdatingId(orderId);
        setStatusDropdown(null);
        try {
            await orderService.forceUpdateOrderStatus(orderId, status);
            setOrders(prev =>
                prev.map(o => o.id === orderId || o.orderId === orderId
                    ? { ...o, status }
                    : o
                )
            );
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900">Tüm Siparişler</h1>
                    <p className="text-sm text-neutral-400 mt-0.5">{orders.length} sipariş</p>
                </div>
                <Link
                    to="/admin"
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                    ← Onay Bekleyen Ürünler
                </Link>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center text-sm text-neutral-400">Yükleniyor...</div>
            ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
            ) : orders.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-neutral-400 text-sm">Henüz sipariş bulunmuyor.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => {
                        const id = order.id ?? order.orderId;
                        const isUpdating = updatingId === id;
                        return (
                            <div key={id} className={`bg-white border border-neutral-200 rounded-lg p-4 ${isUpdating ? 'opacity-60' : ''}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <p className="text-sm font-semibold text-neutral-900">Sipariş #{id}</p>
                                            <span className="text-xs text-neutral-400">Müşteri #{order.customerId}</span>
                                            <p className="text-xs text-neutral-400">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleString('tr-TR') : ''}
                                            </p>
                                        </div>
                                        {order.items?.length > 0 && (
                                            <ul className="mt-2 text-xs text-neutral-500 space-y-0.5">
                                                {order.items.map((item, i) => (
                                                    <li key={i}>{item.productName ?? item.name} &times; {item.quantity}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                                        <p className="text-sm font-semibold text-neutral-900">
                                            ₺{Number(order.totalAmount ?? order.total ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${STATUS_STYLES[order.status] ?? 'bg-neutral-100 text-neutral-500'}`}>
                                            {order.status}
                                        </span>
                                        <div className="relative">
                                            <button
                                                onClick={() => setStatusDropdown(statusDropdown === id ? null : id)}
                                                disabled={isUpdating}
                                                className="text-xs border border-neutral-200 text-neutral-600 px-3 py-1 rounded-md hover:border-neutral-400 transition-colors disabled:opacity-50"
                                            >
                                                {isUpdating ? 'Güncelleniyor...' : 'Durum Değiştir ▾'}
                                            </button>
                                            {statusDropdown === id && (
                                                <div className="absolute right-0 mt-1 w-44 bg-white border border-neutral-200 rounded-md shadow-lg z-10">
                                                    {ALL_STATUSES.map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => handleForceStatus(id, s)}
                                                            className={`w-full text-left text-xs px-3 py-2 hover:bg-neutral-50 transition-colors ${order.status === s ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}
                                                        >
                                                            {order.status === s && '✓ '}{s}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Close dropdown on outside click */}
            {statusDropdown !== null && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setStatusDropdown(null)}
                />
            )}
        </div>
    );
}
