import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Cart from "../pages/cart/Cart";
const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
    </Routes>
);

export default AppRoutes;
