import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div>
            <section className="py-20 text-center">
                <h1 className="text-4xl font-semibold text-neutral-900 mb-4 tracking-tight">
                    Simple, curated shopping.
                </h1>
                <p className="text-neutral-500 text-lg mb-8 max-w-md mx-auto">
                    Quality products, straightforward prices, fast delivery.
                </p>
                <Link
                    to="/products"
                    className="inline-block bg-neutral-900 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors"
                >
                    Shop now
                </Link>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
                {[
                    { title: 'Free Shipping', description: 'On all orders over $50.' },
                    { title: 'Easy Returns', description: '30-day hassle-free returns.' },
                    { title: 'Secure Payment', description: 'Your data is always protected.' },
                ].map(item => (
                    <div key={item.title} className="border border-neutral-200 rounded-lg p-6 bg-white">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-neutral-500">{item.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
