import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProduct, setLoading, setError } from '../store/slices/productSlice';
import { productService } from '../services/productService';
import { cartService } from '../services/orderService';

export default function ProductDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedProduct: product, loading, error } = useSelector(state => state.products);
    const { isAuthenticated, userId } = useSelector(state => state.auth);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const load = async () => {
            dispatch(setLoading(true));
            try {
                const data = await productService.getById(id);
                dispatch(setSelectedProduct(data));
            } catch (err) {
                dispatch(setError(err.message));
            } finally {
                dispatch(setLoading(false));
            }
        };
        load();
        return () => dispatch(setSelectedProduct(null));
    }, [id, dispatch]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        setAdding(true);
        try {
            await cartService.addItem(userId, {
                productId: product.id,
                productName: product.name,
                sellerId: product.sellerId,
                unitPrice: product.price,
                quantity: 1,
            });
            setAdded(true);
        } catch { /* ignore */ } finally { setAdding(false); }
    };

    if (loading) return (
        <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 animate-pulse">
                <div className="aspect-square bg-neutral-200 rounded-xl" />
                <div className="space-y-4 pt-2">
                    <div className="h-3 bg-neutral-200 rounded w-1/4" />
                    <div className="h-6 bg-neutral-200 rounded w-3/4" />
                    <div className="h-8 bg-neutral-200 rounded w-1/3" />
                    <div className="h-3 bg-neutral-200 rounded w-full" />
                    <div className="h-3 bg-neutral-200 rounded w-5/6" />
                </div>
            </div>
        </div>
    );
    if (error) return <p className="text-sm text-red-500">{error}</p>;
    if (!product) return null;

    const outOfStock = product.stock === 0;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className="text-sm text-neutral-400 hover:text-neutral-700 mb-6 flex items-center gap-1 transition-colors">
                &larr; Geri
            </button>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Image */}
                <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
                    <img
                        src={product.imageUrl || product.image || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-2">
                        {product.categoryName ?? product.category}
                    </p>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-3 leading-snug">{product.name}</h1>
                    <p className="text-3xl font-bold text-neutral-900 mb-2">
                        {Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </p>

                    {/* Stock badge */}
                    <div className="mb-6">
                        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${outOfStock
                                ? 'bg-red-50 text-red-500 border border-red-200'
                                : product.stock <= 5
                                    ? 'bg-orange-50 text-orange-600 border border-orange-200'
                                    : 'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                            {outOfStock
                                ? 'Stokta Yok'
                                : product.stock <= 5
                                    ? `Son ${product.stock} adet!`
                                    : `Stokta ${product.stock} adet var`}
                        </span>
                    </div>

                    <p className="text-sm text-neutral-600 leading-relaxed mb-8">{product.description}</p>

                    <div className="mt-auto space-y-3">
                        {added ? (
                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                            >
                                Sepete Git &rarr;
                            </button>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={adding || outOfStock}
                                className="w-full bg-neutral-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50"
                            >
                                {adding ? 'Ekleniyor...' : outOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
