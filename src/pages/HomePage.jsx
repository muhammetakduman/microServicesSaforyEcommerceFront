import { Link } from 'react-router-dom';
import logo from '../assets/LOGO.svg';

const FEATURES = [
    {
        title: 'Guvenli Odeme',
        desc: 'Kartiniz her zaman koruma altinda. SSL sifreleme ile odeme gerceklestirin.',
    },
    {
        title: 'Hizli Teslimat',
        desc: 'Siparisleriniz ayni gun kargoya verilir, hizla kapiniza ulasir.',
    },
    {
        title: 'Kolay Iade',
        desc: '30 gun icinde urun iadesi yapabilirsiniz, hicbir sorun cikarmadan.',
    },
];

export default function HomePage() {
    return (
        <div className="space-y-20">

            {/* Hero */}
            <section className="flex flex-col items-center text-center py-20 gap-6">
                <img src={logo} alt="Safory" className="h-20 w-auto opacity-90" />
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">
                        Safory Ecommerce
                    </h1>
                    <p className="text-neutral-500 text-lg mt-3 max-w-md mx-auto leading-relaxed">
                        Binlerce urunu kesfet, guvenle satin al. Satici misin? Hemen urununu listele.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/products"
                        className="bg-neutral-900 text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-neutral-700 transition-colors"
                    >
                        Alisverise Basla
                    </Link>
                    <Link
                        to="/register"
                        className="border border-neutral-300 text-neutral-700 px-8 py-3 rounded-md text-sm font-semibold hover:border-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                        Ucretsiz Kayit
                    </Link>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Features */}
            <section>
                <h2 className="text-center text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-8">
                    Neden Safory?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {FEATURES.map(f => (
                        <div
                            key={f.title}
                            className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-sm transition-shadow"
                        >
                            <h3 className="text-sm font-bold text-neutral-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-neutral-900 rounded-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Satici misin?</h2>
                    <p className="text-neutral-400 text-sm mt-1 max-w-sm">
                        Urunlerini hemen listele, milyonlarca musteriye ulas. Kayit tamamen ucretsiz.
                    </p>
                </div>
                <Link
                    to="/register"
                    className="flex-shrink-0 bg-white text-neutral-900 px-7 py-2.5 rounded-md text-sm font-semibold hover:bg-neutral-100 transition-colors"
                >
                    Satici Ol
                </Link>
            </section>

        </div>
    );
}
