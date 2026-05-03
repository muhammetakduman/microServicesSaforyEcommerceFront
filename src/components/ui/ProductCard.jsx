import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cartService } from '../../services/orderService';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { isAuthenticated, userId } = useSelector(state => state.auth);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const outOfStock = product.stock === 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { navigate('/login'); return; }
        if (outOfStock) return;
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
            setTimeout(() => setAdded(false), 2000);
        } catch { /* ignore */ } finally { setAdding(false); }
    };

    return (
        <Link to={`/products/${product.id}`} className="group block">
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all duration-200">
                <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                    <img
                        src={product.imageUrl || product.image || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {outOfStock && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <span className="text-xs font-semibold text-neutral-500 border border-neutral-300 bg-white px-3 py-1 rounded-full">
                                Stokta Yok
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wide font-medium">{product.categoryName ?? product.category}</p>
                    <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 mb-3 leading-snug">{product.name}</h3>
                    <div className="flex items-end justify-between gap-2">
                        <div>
                            <span className="text-base font-bold text-neutral-900">
                                {Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                            </span>
                            <p className={`text-xs mt-0.5 font-medium ${outOfStock ? 'text-red-400' : 'text-green-600'}`}>
                                {outOfStock ? 'Stok yok' : `${product.stock} adet`}
                            </p>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={adding || outOfStock}
                            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 ${added
                                    ? 'bg-green-600 text-white'
                                    : outOfStock
                                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                        : 'bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-50'
                                }`}
                        >
                            {adding ? '...' : added ? 'Eklendi' : 'Sepete Ekle'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

