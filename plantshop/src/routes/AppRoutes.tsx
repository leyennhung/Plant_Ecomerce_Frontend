import {Routes, Route} from "react-router-dom";
import MainLayout from "../components/layout/main/MainLayout";
import Home from "../pages/home/Home";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import Profile from "../pages/profile/Profile.tsx";
import Cart from "../pages/cart/Cart";
import Wishlist from "../pages/wishlist/Wishlist";
import Checkout from "../pages/checkout/Checkout";
import PrivacyPolicy from "../pages/privacy/PrivacyPolicy";
import Orders from "../pages/order/Orders";
const AppRoutes = () => (
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/wishlist" element={<Wishlist/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/orders" element={<Orders />} />
        </Route>
    </Routes>
);

export default AppRoutes;
