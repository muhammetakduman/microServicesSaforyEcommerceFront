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

    if (loading) return <div className="h-64 flex items-center justify-center text-sm text-neutral-400">Yukleniyor...</div>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;
    if (!product) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className="text-sm text-neutral-400 hover:text-neutral-700 mb-6 block">
                &larr; Geri
            </button>

            <div className="grid md:grid-cols-2 gap-10">
                <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                    <img
                        src={product.imageUrl || product.image || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">{product.category}</p>
                    <h1 className="text-2xl font-semibold text-neutral-900 mb-3">{product.name}</h1>
                    <p className="text-2xl font-bold text-neutral-900 mb-6">{Number(product.price).toFixed(2)} TL</p>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-8">{product.description}</p>
                    {added ? (
                        <button onClick={() => navigate('/cart')} className="bg-neutral-100 text-neutral-900 py-3 rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors">
                            Sepete Git
                        </button>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="bg-neutral-900 text-white py-3 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
                        >
                            {adding ? 'Ekleniyor...' : 'Sepete Ekle'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
