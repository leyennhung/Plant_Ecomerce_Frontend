# 🌱 Plant Shop -Ecomerce – Frontend Project
Dự án Frontend mô phỏng **website bán cây cảnh** được xây dựng bằng **React + TypeScript**, sử dụng **Mock Service Worker (MSW)** để giả lập Fake API trong quá trình phát triển.
---------------------------------------------------------------------------------------------
## 🚀 Công nghệ & Framework sử dụng
-     **Nodejs v24.11.1**
- ⚛️ **React 18** – Xây dựng UI
- ⚡ **Vite** – Build tool nhanh, nhẹ
- 🟦 **TypeScript** – Quản lý type an toàn
- 🌐 **Axios** – Gọi API
- 🧭 **React Router DOM** – Điều hướng trang
- 🧪 **MSW (Mock Service Worker)** – Mock backend API
- 🎨 **CSS / CSS Module** – Styling giao diện

---------------------------------------------------------------------------------------------
## Thư viện:
- npm install axios
- npm install react-router-dom
- npm install msw --save-dev
- npm install @reduxjs/toolkit react-redux
- npm install react @types/react @types/react-dom --save-dev

---------------------------------------------------------------------------------------------

  ## 📦 Cài đặt & Chạy dự án
  ### 1️⃣ Clone project
- bash
- git clone https://github.com/your-username/plant-shop.git
- cd plant-shop

  ### 2️⃣ Cài đặt thư viện
  - npm install    ( sinh ra node_modules/)
  - npm run build  ( sẽ sinh ra dist/, gồm assets/ và index.html)

  ### 3️⃣ Chạy môi trường development
  - npm run dev
  - Truy cập http://localhost:5173

 --------------------------------------------------------------------------------------------------------------------
 ## Cây thư mục
 ```src/
├── assets/                     # Ảnh, icon, font
│   ├── images/
│   └── icons/
│
├── components/                 # Component UI dùng chung
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Input.tsx
│   │   └── Input.module.css
│   │
│   └── layout/
│       ├── Header.tsx
│       ├── Header.module.css
│       ├── Footer.tsx
│       └── Footer.module.css
│
├── pages/                      # Pages theo route
│
│   ├── home/
│   │   ├── Home.tsx
│   │   └── Home.module.css
│
│   ├── product/
│   │   ├── list/
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductList.module.css
│   │   │
│   │   └── detail/
│   │       ├── ProductDetail.tsx
│   │       └── ProductDetail.module.css
│
│   ├── cart/
│   │   ├── Cart.tsx
│   │   └── Cart.module.css
│
│   └── auth/
│       ├── login/
│       │   ├── Login.tsx
│       │   └── Login.module.css
│       │
│       └── register/
│           ├── Register.tsx
│           └── Register.module.css
│
├── services/                   # Gọi API
│   ├── api.ts
│   ├── product.service.ts
│   ├── auth.service.ts
│   └── order.service.ts
│
├── store/                      # Global state
│   ├── index.ts
│   ├── authSlice.ts
│   ├── cartSlice.ts
│   └── wishlistSlice.ts
│
├── types/                      # ⭐ Domain Models (FULL)
│   ├── product.type.ts
│   ├── category.type.ts
│   ├── attribute.type.ts
│   ├── image.type.ts
│   ├── user.type.ts
│   ├── contact.type.ts
│   ├── location.type.ts
│   ├── cart.type.ts
│   ├── wishlist.type.ts
│   ├── order.type.ts
│   └── order-detail.type.ts
│
├── utils/                      # Hàm tiện ích
│   ├── formatPrice.ts
│   ├── storage.ts
│   └── validate.ts
│
├── routes/                     # Router config
│   └── AppRoutes.tsx
│
├── mocks/                      # MSW 
│   ├── data/              #JSON
│   │   ├── products.json
│   │   ├── categories.json
│   │   ├── users.json
│   │   └── orders.json
│   │
│   ├── handlers/
│   │   ├── product.handler.ts
│   │   ├── category.handler.ts
│   │   ├── auth.handler.ts
│   │   ├── cart.handler.ts
│   │   ├── wishlist.handler.ts
│   │   └── order.handler.ts
│   │
│   ├── browser.ts
│   └── server.ts
│
├── App.tsx
├── main.tsx
└── index.css                   # Global CSS

--------------------------------------------------------------------------------------------------------------------
 ## Luồng hoạt động

 Component, Page
   ↓
Service (axios)
   ↓
GET /api/products
   ↓
MSW handler
   ↓
products.json
   ↓
UI render

  
