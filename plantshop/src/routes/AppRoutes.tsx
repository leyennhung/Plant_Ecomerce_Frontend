import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/main/MainLayout";
import Home from "../pages/home/Home";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import Profile from "../pages/profile/Profile.tsx";


const AppRoutes = () => (
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Profile/>}/>
        </Route>
    </Routes>
);

export default AppRoutes;
