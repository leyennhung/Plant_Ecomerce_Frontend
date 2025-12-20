import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/main/MainLayout";
import Home from "../pages/home/Home";


const AppRoutes = () => (
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
        </Route>
    </Routes>
);

export default AppRoutes;
