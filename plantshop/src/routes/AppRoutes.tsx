import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/main/MainLayout";
import Home from "../pages/home/Home";
import Cart from "../pages/cart/Cart";
import Wishlist from "../pages/wishlist/Wishlist";
const AppRoutes = () => (
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />

        </Route>
    </Routes>
);

export default AppRoutes;
