import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setLoading, setError } from '../store/slices/productSlice';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';

export default function ProductsPage() {
    const dispatch = useDispatch();
    const { items, loading, error, totalPages, currentPage } = useSelector(state => state.products);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(setLoading(true));
            try {
                let data;
                if (search.trim()) {
                    data = await productService.search({ keyword: search.trim(), page, size: 20 });
                } else {
                    data = await productService.getAll({ page, size: 20 });
                }
                dispatch(setProducts({
                    items: data.content ?? [],
                    total: data.totalElements ?? 0,
                    totalPages: data.totalPages ?? 1,
                    currentPage: data.number ?? page,
                }));
            } catch (err) {
                dispatch(setError(err.message));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchProducts();
    }, [page, search, dispatch]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(0);
    };

    return (
        <div>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Urun ara..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full max-w-sm border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                />
            </div>

            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white border border-neutral-200 rounded-lg overflow-hidden animate-pulse">
                            <div className="aspect-square bg-neutral-100" />
                            <div className="p-4 space-y-2">
                                <div className="h-3 bg-neutral-100 rounded w-1/2" />
                                <div className="h-4 bg-neutral-100 rounded w-3/4" />
                                <div className="h-4 bg-neutral-100 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {items.length === 0 && (
                        <p className="text-center text-neutral-400 text-sm py-16">Urun bulunamadi.</p>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            {Array.from({ length: totalPages }, (_, i) => i).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 text-sm rounded-md transition-colors ${p === currentPage
                                        ? 'bg-neutral-900 text-white'
                                        : 'border border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
                                >
                                    {p + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
