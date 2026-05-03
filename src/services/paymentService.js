import apiFetch from './api';

export const paymentService = {
    // Direkt odeme baslat (SAGA disinda)
    initPayment: ({ orderId, customerId, amount, cardNumber, cardHolderName, expireMonth, expireYear, cvc, customerEmail, items }) =>
        apiFetch('/api/payments/init', {
            method: 'POST',
            body: {
                orderId,
                customerId,
                amount,
                cardNumber,
                cardHolderName,
                expireMonth,
                expireYear,
                cvc,
                customerEmail,
                items: items ?? [],
            },
        }),

    // Siparis odemesini sorgula
    getByOrderId: (orderId) =>
        apiFetch(`/api/payments/order/${orderId}`),

    // Odeme detayi
    getById: (paymentId) =>
        apiFetch(`/api/payments/${paymentId}`),

    // Iade (amount gonderilmezse tam iade)
    refund: (paymentId, amount) =>
        apiFetch(`/api/payments/${paymentId}/refund`, {
            method: 'POST',
            body: amount != null ? { amount } : {},
        }),
};
