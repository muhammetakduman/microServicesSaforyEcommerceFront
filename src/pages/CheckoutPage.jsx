import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCartState } from '../store/slices/cartSlice';
import { setCurrentOrder } from '../store/slices/orderSlice';
import { orderService } from '../services/orderService';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount } = useSelector(state => state.cart);
    const { userId } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [shipping, setShipping] = useState({
        recipientName: '', phone: '', addressLine: '', district: '', city: '', postalCode: '', country: 'Turkiye',
    });
    const [payment, setPayment] = useState({
        cardNumber: '', cardHolderName: '', expireMonth: '', expireYear: '', cvc: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await orderService.create({
                customerId: userId,
                items: items.map(i => ({
                    productId: i.productId,
                    productName: i.productName,
                    sellerId: i.sellerId,
                    unitPrice: i.unitPrice,
                    quantity: i.quantity,
                })),
                shippingDetails: shipping,
                paymentInfo: payment,
            });
            dispatch(setCurrentOrder(data));
            dispatch(clearCartState());
            navigate('/orders');
        } catch (err) {
            setError(err.message || 'Siparis olusturulamadi.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = 'w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-400';

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-semibold text-neutral-900 mb-6">Odeme</h1>

            {/* Order summary */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
                <h2 className="text-sm font-medium text-neutral-700 mb-3">Siparis Ozeti</h2>
                <ul className="space-y-1 text-sm text-neutral-600">
                    {items.map(item => (
                        <li key={item.itemId} className="flex justify-between">
                            <span>{item.productName} &times; {item.quantity}</span>
                            <span>{Number(item.lineTotal).toFixed(2)} TL</span>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-neutral-100 mt-3 pt-3 flex justify-between text-sm font-semibold text-neutral-900">
                    <span>Toplam</span>
                    <span>{Number(totalAmount).toFixed(2)} TL</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Shipping */}
                <div className="space-y-3">
                    <h2 className="text-sm font-medium text-neutral-700">Teslimat Bilgileri</h2>
                    <input className={inputCls} placeholder="Ad Soyad" required value={shipping.recipientName}
                        onChange={e => setShipping({ ...shipping, recipientName: e.target.value })} />
                    <input className={inputCls} placeholder="Telefon" required value={shipping.phone}
                        onChange={e => setShipping({ ...shipping, phone: e.target.value })} />
                    <input className={inputCls} placeholder="Adres" required value={shipping.addressLine}
                        onChange={e => setShipping({ ...shipping, addressLine: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                        <input className={inputCls} placeholder="Ilce" required value={shipping.district}
                            onChange={e => setShipping({ ...shipping, district: e.target.value })} />
                        <input className={inputCls} placeholder="Sehir" required value={shipping.city}
                            onChange={e => setShipping({ ...shipping, city: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input className={inputCls} placeholder="Posta Kodu" required value={shipping.postalCode}
                            onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} />
                        <input className={inputCls} placeholder="Ulke" required value={shipping.country}
                            onChange={e => setShipping({ ...shipping, country: e.target.value })} />
                    </div>
                </div>

                {/* Payment */}
                <div className="space-y-3">
                    <h2 className="text-sm font-medium text-neutral-700">Kart Bilgileri</h2>
                    <input className={inputCls} placeholder="Kart Numarasi (16 hane)" required maxLength={16}
                        value={payment.cardNumber} onChange={e => setPayment({ ...payment, cardNumber: e.target.value })} />
                    <input className={inputCls} placeholder="Kart Uzerindeki Ad" required
                        value={payment.cardHolderName} onChange={e => setPayment({ ...payment, cardHolderName: e.target.value })} />
                    <div className="grid grid-cols-3 gap-3">
                        <input className={inputCls} placeholder="Ay (MM)" required maxLength={2}
                            value={payment.expireMonth} onChange={e => setPayment({ ...payment, expireMonth: e.target.value })} />
                        <input className={inputCls} placeholder="Yil (YYYY)" required maxLength={4}
                            value={payment.expireYear} onChange={e => setPayment({ ...payment, expireYear: e.target.value })} />
                        <input className={inputCls} placeholder="CVC" required maxLength={4}
                            value={payment.cvc} onChange={e => setPayment({ ...payment, cvc: e.target.value })} />
                    </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="w-full bg-neutral-900 text-white py-3 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Siparis veriliyor...' : 'Siparis Ver'}
                </button>
            </form>
        </div>
    );
}
