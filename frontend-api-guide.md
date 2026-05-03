# 🛒 Marketplace — Frontend API Kılavuzu

> **Tüm istekler API Gateway üzerinden geçer.**  
> Base URL: `http://localhost:8080`  
> Direkt servis portlarına istek ATMA — her şey gateway'den geçmeli.

---

## 📌 Genel Kurallar

### 1. Authentication (Kimlik Doğrulama)
Public endpoint'ler dışındaki **tüm isteklere** şu header eklenmelidir:

```
Authorization: Bearer <accessToken>
```

### 2. Token Yaşam Döngüsü

| Token | Süre | Kullanım |
|-------|------|---------|
| `accessToken` | 24 saat | Her API isteğinde Authorization header'ı |
| `refreshToken` | 7 gün | Sadece token yenileme endpoint'inde |

### 3. Rol Sistemi

| Rol | Açıklama |
|-----|---------|
| `CUSTOMER` | Alışveriş yapan müşteri |
| `SELLER` | Ürün satan satıcı |
| `ADMIN` | Yönetici |

---

## 🔐 1. AUTH — Kimlik Doğrulama

**Base path:** `/api/auth`  
**⚠️ Tüm auth endpoint'leri PUBLIC'tir (token gerekmez)**

---

### 1.1 Müşteri Kaydı
```
POST /api/auth/register/customer
```

**Request Body:**
```json
{
  "email": "ahmet@mail.com",
  "password": "şifre123",
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "phone": "05551234567"
}
```
> `phone` alanı opsiyoneldir. `password` en az 6 karakter olmalıdır.

**Response: `201 Created`**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "ahmet@mail.com",
  "role": "CUSTOMER"
}
```

---

### 1.2 Satıcı Kaydı
```
POST /api/auth/register/seller
```

**Request Body:** _(Müşteri kaydı ile aynı)_
```json
{
  "email": "satis@firma.com",
  "password": "şifre123",
  "firstName": "Fatma",
  "lastName": "Demir"
}
```

**Response: `201 Created`** _(AuthResponse — role: "SELLER")_

---

### 1.3 Giriş Yap
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "ahmet@mail.com",
  "password": "şifre123"
}
```

**Response: `200 OK`** _(AuthResponse — yukarıdakiyle aynı yapı)_

> 💡 **Frontend'de yapılması gereken:**  
> `accessToken` ve `refreshToken`'ı localStorage veya secure cookie'de sakla.  
> `userId` ve `role`'ü state management'a (Redux, Zustand vb.) kaydet.

---

### 1.4 Token Yenile
```
POST /api/auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response: `200 OK`** _(Yeni AuthResponse — yeni accessToken + yeni refreshToken)_

> ⚠️ **Refresh Token Rotation:** Her yenilemede eski refreshToken geçersiz olur, yeni bir tane gelir. Yeni refreshToken'ı kaydet!

---

### 1.5 Çıkış Yap
```
POST /api/auth/logout?userId=1
```
> 🔒 Requires: `Authorization: Bearer <token>`

**Response: `204 No Content`**

> 💡 Frontend'de localStorage/cookie'deki token'ları temizle.

---

### 1.6 Ben Kimim? (Auth Bilgisi)
```
GET /api/auth/me?userId=1
```
> 🔒 Requires token

**Response: `200 OK`** _(Metin — tam profil için /api/users/me kullan)_

---

## 👤 2. USER — Kullanıcı Profili

**Base path:** `/api/users`  
> 🔒 Tüm endpoint'ler token gerektirir

---

### 2.1 Kendi Profilimi Gör
```
GET /api/users/me?userId=1
```

**Response: `200 OK`**
```json
{
  "userId": 1,
  "email": "ahmet@mail.com",
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "fullName": "Ahmet Yılmaz",
  "phone": "05551234567",
  "profilePhotoUrl": null,
  "address": {
    "addressLine": "Atatürk Mah. No:5",
    "district": "Kadıköy",
    "city": "İstanbul",
    "postalCode": "34710",
    "country": "Türkiye"
  },
  "active": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

---

### 2.2 Profil Güncelle
```
PUT /api/users/me?userId=1
```

**Request Body:** _(null gönderilen alanlar değişmez)_
```json
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "phone": "05559876543",
  "profilePhotoUrl": "https://cdn.example.com/photo.jpg",
  "address": {
    "addressLine": "Yeni Mah. No:10",
    "district": "Beşiktaş",
    "city": "İstanbul",
    "postalCode": "34353",
    "country": "Türkiye"
  }
}
```

**Response: `200 OK`** _(Güncellenmiş UserResponse)_

---

### 2.3 ID ile Kullanıcı Getir
```
GET /api/users/{userId}
```

**Response: `200 OK`** _(UserResponse)_

---

## 🛍️ 3. PRODUCT — Ürünler

**Base path:** `/api/products`

---

### 3.1 Tüm Ürünleri Listele _(PUBLIC)_
```
GET /api/products?page=0&size=20
```

**Query Params:**
| Param | Tip | Varsayılan | Açıklama |
|-------|-----|-----------|---------|
| `page` | int | 0 | Sayfa numarası (0'dan başlar) |
| `size` | int | 20 | Sayfadaki ürün sayısı |

**Response: `200 OK`**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Laptop Pro",
      "description": "Yüksek performanslı laptop",
      "price": 25000.00,
      "stock": 15,
      "imageUrl": "https://cdn.example.com/laptop.jpg",
      "categoryId": 3,
      "categoryName": "Elektronik",
      "sellerId": 2,
      "status": "APPROVED"
    }
  ],
  "totalElements": 150,
  "totalPages": 8,
  "number": 0,
  "size": 20
}
```

---

### 3.2 Ürün Detayı _(PUBLIC)_
```
GET /api/products/{id}
```

**Response: `200 OK`** _(Tek ProductResponse)_

---

### 3.3 Ürün Ara _(PUBLIC)_
```
GET /api/products/search?keyword=laptop&page=0&size=20
```

---

### 3.4 Kategorileri Listele _(PUBLIC)_
```
GET /api/products/categories
```

**Response: `200 OK`**
```json
[
  { "id": 1, "name": "Elektronik" },
  { "id": 2, "name": "Giyim" },
  { "id": 3, "name": "Kitap" }
]
```

---

### 3.5 Ürün Ekle _(SELLER)_
```
POST /api/products/seller
```
> 🔒 Requires: `Authorization: Bearer <token>` + `X-Seller-Id: <sellerId>` header

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
X-Seller-Id: 2
```

**Request Body:**
```json
{
  "name": "Yeni Laptop",
  "description": "Intel i7, 16GB RAM",
  "price": 28000.00,
  "stock": 10,
  "imageUrl": "https://cdn.example.com/new-laptop.jpg",
  "categoryId": 1
}
```

**Response: `201 Created`** _(ProductResponse — status: "PENDING" — admin onayı bekler)_

---

### 3.6 Ürün Güncelle _(SELLER)_
```
PUT /api/products/seller/{productId}
```
> 🔒 `X-Seller-Id` header gereklidir

**Request Body:** _(ProductRequest ile aynı)_

---

### 3.7 Ürün Sil _(SELLER)_
```
DELETE /api/products/seller/{productId}
```
> 🔒 `X-Seller-Id` header gereklidir

**Response: `204 No Content`**

---

### 3.8 Kendi Ürünlerimi Listele _(SELLER)_
```
GET /api/products/seller/my-products?page=0&size=20
```
> 🔒 `X-Seller-Id` header gereklidir

---

### 3.9 Stok Güncelle _(SELLER)_
```
PATCH /api/products/seller/{productId}/stock
```
> 🔒 `X-Seller-Id` header gereklidir

**Request Body:**
```json
{ "stock": 50 }
```

---

### 3.10 Onay Bekleyen Ürünler _(ADMIN)_
```
GET /api/products/admin/pending?page=0&size=20
```

---

### 3.11 Ürün Onayla _(ADMIN)_
```
PUT /api/products/admin/{productId}/approve
```

---

### 3.12 Ürün Reddet _(ADMIN)_
```
PUT /api/products/admin/{productId}/reject
```

---

## 🛒 4. CART — Alışveriş Sepeti

**Base path:** `/api/cart`  
> 🔒 Tüm endpoint'ler token gerektirir

---

### 4.1 Sepeti Görüntüle
```
GET /api/cart?customerId=1
```

**Response: `200 OK`**
```json
{
  "cartId": 1,
  "customerId": 1,
  "items": [
    {
      "itemId": 10,
      "productId": 5,
      "productName": "Laptop Pro",
      "sellerId": 2,
      "unitPrice": 25000.00,
      "quantity": 2,
      "lineTotal": 50000.00
    }
  ],
  "totalAmount": 50000.00
}
```

> 💡 Sepet yoksa otomatik boş sepet oluşturulur.

---

### 4.2 Sepete Ürün Ekle
```
POST /api/cart/items?customerId=1
```

**Request Body:**
```json
{
  "productId": 5,
  "productName": "Laptop Pro",
  "sellerId": 2,
  "unitPrice": 25000.00,
  "quantity": 1
}
```

**Response: `201 Created`** _(Güncellenmiş CartResponse)_

> 💡 Aynı ürün tekrar eklenirse miktar toplanır (1+1=2).

---

### 4.3 Sepet Kalemi Güncelle
```
PUT /api/cart/items/{itemId}?customerId=1
```

**Request Body:**
```json
{ "quantity": 3 }
```

**Response: `200 OK`** _(Güncellenmiş CartResponse)_

---

### 4.4 Sepetten Ürün Kaldır
```
DELETE /api/cart/items/{itemId}?customerId=1
```

**Response: `200 OK`** _(Güncellenmiş CartResponse)_

---

### 4.5 Sepeti Tamamen Temizle
```
DELETE /api/cart/clear?customerId=1
```

**Response: `204 No Content`**

> ℹ️ Sipariş verilince sepet otomatik temizlenir (RabbitMQ event).

---

## 📦 5. ORDER — Siparişler

**Base path:** `/api/orders`  
> 🔒 Tüm endpoint'ler token gerektirir

---

### 5.1 Sipariş Oluştur _(CUSTOMER)_
```
POST /api/orders
```

> 🔥 **Bu endpoint SAGA Choreography başlatır:**  
> Sipariş Oluşturuldu → Stok Rezerve → Ödeme → Tamamlandı/İptal

**Request Body:**
```json
{
  "customerId": 1,
  "items": [
    {
      "productId": 5,
      "productName": "Laptop Pro",
      "sellerId": 2,
      "unitPrice": 25000.00,
      "quantity": 1
    }
  ],
  "shippingDetails": {
    "recipientName": "Ahmet Yılmaz",
    "phone": "05551234567",
    "addressLine": "Atatürk Mah. No:5",
    "district": "Kadıköy",
    "city": "İstanbul",
    "postalCode": "34710",
    "country": "Türkiye"
  },
  "paymentInfo": {
    "cardNumber": "5528790000000008",
    "cardHolderName": "Ahmet Yılmaz",
    "expireMonth": "12",
    "expireYear": "2030",
    "cvc": "123"
  }
}
```

**Response: `201 Created`**
```json
{
  "orderId": 100,
  "customerId": 1,
  "status": "PENDING",
  "items": [...],
  "totalAmount": 25000.00,
  "createdAt": "2024-01-15T14:30:00"
}
```

> ⚠️ SAGA asenkron çalışır. Sipariş başlangıçta `PENDING` durumundadır.  
> Durum güncellemelerini polling veya WebSocket ile takip et.

**Sipariş Durum Akışı:**
```
PENDING → STOCK_RESERVED → PAYMENT_TRIGGERED → COMPLETED
                        ↘ STOCK_FAILED
                                              ↘ PAYMENT_FAILED → CANCELLED
```

---

### 5.2 Siparişlerim _(CUSTOMER)_
```
GET /api/orders/my-orders?customerId=1
```

**Response: `200 OK`** _(OrderResponse listesi)_

---

### 5.3 Sipariş Detayı
```
GET /api/orders/{orderId}
```

**Response: `200 OK`** _(Tek OrderResponse)_

---

### 5.4 Sipariş İptal Et _(CUSTOMER)_
```
PUT /api/orders/{orderId}/cancel?customerId=1
```

> ⚠️ Yalnızca `PENDING` durumundaki siparişler iptal edilebilir.

**Response: `200 OK`** _(İptal edilmiş OrderResponse)_

---

### 5.5 Satış Kalemlerim _(SELLER)_
```
GET /api/orders/seller/items?sellerId=2
```

**Response: `200 OK`** _(OrderItemResponse listesi)_

---

### 5.6 Kalem Durumu Güncelle _(SELLER)_
```
PUT /api/orders/seller/items/{orderItemId}/status?sellerId=2&status=SHIPPED
```

**Status değerleri:** `PREPARING` → `SHIPPED` → `DELIVERED`

**Response: `200 OK`** _(Güncellenmiş OrderItemResponse)_

---

### 5.7 Tüm Siparişler _(ADMIN)_
```
GET /api/orders/admin
```

---

### 5.8 Sipariş Durumu Zorla Güncelle _(ADMIN)_
```
PUT /api/orders/admin/{orderId}/status?status=COMPLETED
```

---

## 📊 6. STOCK — Stok Yönetimi

**Base path:** `/api/v1/stocks`  
> 🔒 Token gerektirir

---

### 6.1 Stok Sorgula
```
GET /api/v1/stocks/{productId}
```

**Response: `200 OK`**
```json
{
  "productId": 5,
  "productName": "Laptop Pro",
  "sellerId": 2,
  "availableQuantity": 15
}
```

---

### 6.2 Yeni Stok Kaydı Oluştur _(Seller/Admin)_
```
POST /api/v1/stocks?productId=5&productName=Laptop&sellerId=2&quantity=50
```

**Response: `200 OK`** _(StockUpdateResponse)_

---

### 6.3 Stok Güncelle _(Seller/Admin)_
```
PATCH /api/v1/stocks
```

**Request Body:**
```json
{
  "productId": 5,
  "quantity": 10,
  "operation": "INCREASE"
}
```

> `operation` değerleri: `INCREASE` | `DECREASE`

---

## ⚠️ Hata Yanıtları

Tüm servisler standart HTTP hata kodları döner:

| HTTP Kodu | Anlam | Örnek Durum |
|-----------|-------|------------|
| `400 Bad Request` | Geçersiz istek | Eksik zorunlu alan |
| `401 Unauthorized` | Token yok/geçersiz | Authorization header eksik |
| `403 Forbidden` | Yetkisiz erişim | CUSTOMER → SELLER endpoint'i |
| `404 Not Found` | Kayıt bulunamadı | Olmayan userId |
| `409 Conflict` | Çakışma | Kayıtlı e-posta ile tekrar kayıt |
| `500 Internal Server Error` | Sunucu hatası | DB bağlantı sorunu |

**Hata Response Örneği:**
```json
{
  "timestamp": "2024-01-15T14:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Kullanıcı bulunamadı: 999",
  "path": "/api/users/999"
}
```

---

## 🗺️ Servis Port Haritası

> **Doğrudan erişme! Sadece gateway kullan (8080)**

| Servis | Port | Açıklama |
|--------|------|---------|
| **API Gateway** | **8080** | ✅ Frontend bu porta istek atar |
| Auth Service | 8081 | JWT, register, login |
| User Service | 8082 | Kullanıcı profilleri |
| Product Service | 8084 | Ürün ve kategoriler |
| Cart Service | 8085 | Alışveriş sepeti |
| Order Service | 8086 | Siparişler (SAGA) |
| Stock Service | 8089 | Stok yönetimi |
| Config Server | 8888 | Dahili konfigürasyon |
| Discovery Server | 8761 | Eureka (dahili) |

---

## 🚀 Örnek Frontend Akışı (Alışveriş)

```
1. POST /api/auth/login               → accessToken al
2. GET  /api/products?page=0          → Ürünleri listele
3. GET  /api/products/{id}            → Ürün detayı
4. POST /api/cart/items?customerId=1  → Sepete ekle
5. GET  /api/cart?customerId=1        → Sepeti görüntüle
6. POST /api/orders                   → Sipariş ver (SAGA)
7. GET  /api/orders/{orderId}         → Sipariş durumunu takip et
8. POST /api/auth/logout?userId=1     → Çıkış yap
```

---

## 🔑 Axios Örneği (React/Next.js)

```javascript
// api.js — Axios instance kurulumu
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
});

// Her isteğe otomatik token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 gelirse otomatik token yenile
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const res = await axios.post('http://localhost:8080/api/auth/refresh-token', { refreshToken });
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        // Başarısız isteği tekrar dene
        error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axios(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ---- Kullanım Örnekleri ----

// Giriş yap
export const login = (email, password) =>
  api.post('/api/auth/login', { email, password });

// Ürünleri getir
export const getProducts = (page = 0, size = 20) =>
  api.get(`/api/products?page=${page}&size=${size}`);

// Sepete ekle
export const addToCart = (customerId, item) =>
  api.post(`/api/cart/items?customerId=${customerId}`, item);

// Sipariş ver
export const createOrder = (orderData) =>
  api.post('/api/orders', orderData);
```

---

> 📅 **Son Güncelleme:** 2026-05-01  
> 📁 **Proje:** microservicesFinalProject  
> 🏗️ **Mimari:** Spring Boot 3.5 + Spring Cloud + RabbitMQ + Saga Choreography

