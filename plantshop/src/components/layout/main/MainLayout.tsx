import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../footer/Footer.tsx";

const MainLayout = () => {
    return (
        <>
            <Header />
            <main style={{ marginTop: "124px" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};
export default MainLayout;
