import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';

const STATUS_STYLES = {
    APPROVED: 'bg-green-50 text-green-700',
    PENDING: 'bg-yellow-50 text-yellow-700',
    REJECTED: 'bg-red-50 text-red-700',
};

const STATUS_LABELS = {
    APPROVED: 'Onaylandı',
    PENDING: 'Beklemede',
    REJECTED: 'Reddedildi',
};

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' };

export default function SellerProductsPage() {
    const { userId } = useSelector(state => state.auth);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const [stockEdits, setStockEdits] = useState({});

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await productService.getMyProducts(userId);
            setProducts(Array.isArray(data) ? data : data.content ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        loadProducts();
        productService.getCategories().then(setCategories).catch(() => { });
    }, [userId, loadProducts]);

    const openAddForm = () => {
        setEditingProduct(null);
        setForm(EMPTY_FORM);
        setFormError('');
        setShowForm(true);
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name ?? '',
            description: product.description ?? '',
            price: product.price ?? '',
            stock: product.stock ?? '',
            imageUrl: product.imageUrl ?? '',
            categoryId: product.categoryId ?? '',
        });
        setFormError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setFormError('');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                stock: Number(form.stock),
                categoryId: Number(form.categoryId),
            };
            if (form.imageUrl) payload.imageUrl = form.imageUrl;

            if (editingProduct) {
                await productService.updateProduct(userId, editingProduct.id, payload);
            } else {
                await productService.addProduct(userId, payload);
            }
            closeForm();
            loadProducts();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
        try {
            await productService.deleteProduct(userId, productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStockChange = (productId, value) => {
        setStockEdits(prev => ({ ...prev, [productId]: { value, saving: false } }));
    };

    const handleStockSave = async (productId) => {
        const edit = stockEdits[productId];
        if (!edit) return;
        setStockEdits(prev => ({ ...prev, [productId]: { ...prev[productId], saving: true } }));
        try {
            await productService.updateStock(userId, productId, Number(edit.value));
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Number(edit.value) } : p));
            setStockEdits(prev => { const n = { ...prev }; delete n[productId]; return n; });
        } catch (err) {
            alert(err.message);
            setStockEdits(prev => ({ ...prev, [productId]: { ...prev[productId], saving: false } }));
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900">Ürünlerim</h1>
                    <p className="text-sm text-neutral-400 mt-0.5">{products.length} ürün</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/seller/orders"
                        className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        Siparişlerim →
                    </Link>
                    <button
                        onClick={openAddForm}
                        className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors"
                    >
                        + Ürün Ekle
                    </button>
                </div>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="bg-white border border-neutral-200 rounded-lg p-5 mb-6">
                    <h2 className="text-sm font-semibold text-neutral-900 mb-4">
                        {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                    </h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm text-neutral-600 mb-1">Ürün Adı</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm text-neutral-600 mb-1">Açıklama</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-600 mb-1">Fiyat (₺)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                    className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-600 mb-1">Stok</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={form.stock}
                                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                                    className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-600 mb-1">Kategori</label>
                                <select
                                    required
                                    value={form.categoryId}
                                    onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                                    className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400 bg-white"
                                >
                                    <option value="">Kategori seç</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-600 mb-1">Görsel URL <span className="text-neutral-400">(opsiyonel)</span></label>
                                <input
                                    type="url"
                                    value={form.imageUrl}
                                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                                />
                            </div>
                        </div>

                        {formError && <p className="text-sm text-red-500">{formError}</p>}

                        <div className="flex gap-2 pt-1">
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="text-sm bg-neutral-900 text-white px-5 py-2 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50"
                            >
                                {formLoading ? 'Kaydediliyor...' : (editingProduct ? 'Güncelle' : 'Ekle')}
                            </button>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="text-sm border border-neutral-200 text-neutral-600 px-5 py-2 rounded-md hover:border-neutral-400 transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Product List */}
            {loading ? (
                <div className="h-40 flex items-center justify-center text-sm text-neutral-400">Yükleniyor...</div>
            ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
            ) : products.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-neutral-400 text-sm mb-4">Henüz ürün eklemediniz.</p>
                    <button onClick={openAddForm} className="text-sm text-neutral-900 underline">İlk ürününüzü ekleyin</button>
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
                                <th className="text-left text-xs font-medium text-neutral-400 px-4 py-3">DURUM</th>
                                <th className="text-right text-xs font-medium text-neutral-400 px-4 py-3">İŞLEMLER</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, idx) => (
                                <tr
                                    key={product.id}
                                    className={`border-b border-neutral-50 ${idx === products.length - 1 ? 'border-b-0' : ''}`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md bg-neutral-100" />
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
                                    <td className="px-4 py-3">
                                        {stockEdits[product.id] !== undefined ? (
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={stockEdits[product.id].value}
                                                    onChange={e => handleStockChange(product.id, e.target.value)}
                                                    className="w-16 border border-neutral-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:border-neutral-500"
                                                />
                                                <button
                                                    onClick={() => handleStockSave(product.id)}
                                                    disabled={stockEdits[product.id].saving}
                                                    className="text-xs text-green-700 hover:text-green-900 font-medium disabled:opacity-50"
                                                >
                                                    {stockEdits[product.id].saving ? '...' : 'Kaydet'}
                                                </button>
                                                <button
                                                    onClick={() => setStockEdits(prev => { const n = { ...prev }; delete n[product.id]; return n; })}
                                                    className="text-xs text-neutral-400 hover:text-neutral-600"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleStockChange(product.id, product.stock)}
                                                className="text-neutral-900 font-medium hover:underline"
                                            >
                                                {product.stock}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[product.status] ?? 'bg-neutral-100 text-neutral-500'}`}>
                                            {STATUS_LABELS[product.status] ?? product.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => openEditForm(product)}
                                                className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-xs text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                Sil
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
