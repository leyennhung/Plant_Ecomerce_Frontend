import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/main/MainLayout";
 import Home from "../pages/home/Home";
import ProductList from "../pages/products/list/ProductList";
import ProductDetail from "../pages/products/detail/ProductDetail";


const AppRoutes = () => (
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
        </Route>
    </Routes>
);

export default AppRoutes;
