import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import "@fortawesome/fontawesome-free/css/all.min.css";

const MainLayout = () => {
    return (
        <>
            <Header />
            <main style={{ marginTop: "80px" }}>
                <Outlet />
            </main>
        </>
    );
};
export default MainLayout;
