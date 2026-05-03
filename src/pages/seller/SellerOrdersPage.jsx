import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';

const ITEM_STATUS_STYLES = {
    PREPARING: 'bg-yellow-50 text-yellow-700',
    SHIPPED: 'bg-indigo-50 text-indigo-700',
    DELIVERED: 'bg-green-50 text-green-700',
    PENDING: 'bg-neutral-100 text-neutral-500',
    CANCELLED: 'bg-red-50 text-red-600',
};

const ITEM_STATUS_LABELS = {
    PREPARING: 'Hazırlanıyor',
    SHIPPED: 'Kargoda',
    DELIVERED: 'Teslim Edildi',
    PENDING: 'Beklemede',
    CANCELLED: 'İptal',
};

const NEXT_STATUS = {
    PREPARING: 'SHIPPED',
    SHIPPED: 'DELIVERED',
};

const NEXT_STATUS_LABEL = {
    PREPARING: 'Kargoya Ver',
    SHIPPED: 'Teslim Edildi',
};

export default function SellerOrdersPage() {
    const { userId } = useSelector(state => state.auth);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        if (!userId) return;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await orderService.getSellerItems(userId);
                setItems(Array.isArray(data) ? data : data.content ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userId]);

    const handleStatusUpdate = async (item) => {
        const nextStatus = NEXT_STATUS[item.status];
        if (!nextStatus) return;
        setUpdatingId(item.id);
        try {
            await orderService.updateItemStatus(userId, item.id, nextStatus);
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: nextStatus } : i));
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const grouped = items.reduce((acc, item) => {
        const key = item.orderId;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900">Satış Siparişlerim</h1>
                    <p className="text-sm text-neutral-400 mt-0.5">{items.length} kalem</p>
                </div>
                <Link
                    to="/seller"
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                    ← Ürünlerim
                </Link>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center text-sm text-neutral-400">Yükleniyor...</div>
            ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
            ) : items.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-neutral-400 text-sm">Henüz siparişiniz bulunmuyor.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.entries(grouped).map(([orderId, orderItems]) => (
                        <div key={orderId} className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                            <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-100">
                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Sipariş #{orderId}</p>
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-100">
                                        <th className="text-left text-xs font-medium text-neutral-400 px-4 py-2.5">ÜRÜN</th>
                                        <th className="text-left text-xs font-medium text-neutral-400 px-4 py-2.5">ADET</th>
                                        <th className="text-left text-xs font-medium text-neutral-400 px-4 py-2.5">TUTAR</th>
                                        <th className="text-left text-xs font-medium text-neutral-400 px-4 py-2.5">DURUM</th>
                                        <th className="text-right text-xs font-medium text-neutral-400 px-4 py-2.5">İŞLEM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className={idx < orderItems.length - 1 ? 'border-b border-neutral-50' : ''}
                                        >
                                            <td className="px-4 py-3 font-medium text-neutral-900">{item.productName}</td>
                                            <td className="px-4 py-3 text-neutral-500">{item.quantity}</td>
                                            <td className="px-4 py-3 text-neutral-900">
                                                {item.lineTotal != null
                                                    ? `₺${Number(item.lineTotal).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                                                    : item.unitPrice != null
                                                        ? `₺${(Number(item.unitPrice) * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                                                        : '—'
                                                }
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ITEM_STATUS_STYLES[item.status] ?? 'bg-neutral-100 text-neutral-500'}`}>
                                                    {ITEM_STATUS_LABELS[item.status] ?? item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {NEXT_STATUS[item.status] ? (
                                                    <button
                                                        onClick={() => handleStatusUpdate(item)}
                                                        disabled={updatingId === item.id}
                                                        className="text-xs bg-neutral-900 text-white px-3 py-1 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {updatingId === item.id ? '...' : NEXT_STATUS_LABEL[item.status]}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-neutral-300">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
