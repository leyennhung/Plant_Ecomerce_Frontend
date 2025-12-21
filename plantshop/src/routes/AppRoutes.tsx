import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Cart from "../pages/cart/Cart";
import Wishlist from '../pages/wishlist/Wishlist';
const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
);

export default AppRoutes;
