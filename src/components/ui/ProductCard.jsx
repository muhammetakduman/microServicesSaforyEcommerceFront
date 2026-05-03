import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cartService } from '../../services/orderService';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { isAuthenticated, userId } = useSelector(state => state.auth);
    const [adding, setAdding] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
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
        } catch { /* ignore */ } finally { setAdding(false); }
    };

    return (
        <Link to={`/products/${product.id}`} className="group block">
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-300 hover:shadow-sm transition-all">
                <div className="aspect-square bg-neutral-100 overflow-hidden">
                    <img
                        src={product.imageUrl || product.image || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-4">
                    <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wide">{product.category}</p>
                    <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-neutral-900">
                            ${Number(product.price).toFixed(2)}
                        </span>
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50"
                        >
                            {adding ? '...' : 'Sepete ekle'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
