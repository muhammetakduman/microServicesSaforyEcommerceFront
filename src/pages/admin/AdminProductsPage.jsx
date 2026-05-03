import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionId, setActionId] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await productService.getPendingProducts();
            setProducts(Array.isArray(data) ? data : data.content ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleApprove = async (id) => {
        setActionId(id);
        try {
            await productService.approveProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert(err.message);
        } finally {
            setActionId(null);
        }
    };

    const handleReject = async (id) => {
        setActionId(id);
        try {
            await productService.rejectProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert(err.message);
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900">Onay Bekleyen Ürünler</h1>
                    <p className="text-sm text-neutral-400 mt-0.5">{products.length} ürün bekliyor</p>
                </div>
                <Link
                    to="/admin/orders"
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                    Tüm Siparişler →
                </Link>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center text-sm text-neutral-400">Yükleniyor...</div>
            ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
            ) : products.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-neutral-400 text-sm">Onay bekleyen ürün bulunmuyor.</p>
                </div>
            ) : (
                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-100">
                                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">ÜRÜN</th>
                                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">KATEGORİ</th>
                                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">FİYAT</th>
                                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">STOK</th>
                                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">SATICI ID</th>
                                <th className="text-right text-xs font-medium text-neutral-400 px-4 py-3">İŞLEM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, idx) => (
                                <tr
                                    key={product.id}
                                    className={`${idx < products.length - 1 ? 'border-b border-neutral-50' : ''} ${actionId === product.id ? 'opacity-50' : ''}`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-10 h-10 object-cover rounded-md bg-neutral-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-300 text-xs">N/A</div>
                                            )}
                                            <div>
                                                <p className="font-medium text-neutral-900">{product.name}</p>
                                                <p className="text-xs text-neutral-400 mt-0.5 max-w-[200px] truncate">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-neutral-500">{product.categoryName ?? '—'}</td>
                                    <td className="px-4 py-3 font-medium text-neutral-900">
                                        ₺{Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-neutral-500">{product.stock}</td>
                                    <td className="px-4 py-3 text-neutral-400 text-xs">#{product.sellerId}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleApprove(product.id)}
                                                disabled={actionId === product.id}
                                                className="text-xs bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                                            >
                                                Onayla
                                            </button>
                                            <button
                                                onClick={() => handleReject(product.id)}
                                                disabled={actionId === product.id}
                                                className="text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                                            >
                                                Reddet
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
