import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom"; // 1. Thêm Link vào đây
import {AxiosError} from "axios";
import AuthService from "../../../services/auth.service";
import styles from "./Login.module.css";
import {useDispatch} from "react-redux";
import {setCartItems} from "../../../store/cartSlice";
import {mergeCartItems} from "../../../utils/cart";
import type {CartViewItem} from "../../../types/cart.type";
import {mergeWishlistItems} from "../../../utils/wishlist";
import type {WishlistItem} from "../../../types/wishlist.type";
import {setWishlist} from "../../../store/wishlistSlice";
import {loginSuccess} from "../../../store/authSlice";
import {addToCart} from "../../../store/cartSlice";
import type { Session } from "../../../mocks/utils";


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState<string>("");

    //State điều khiển Modal thông báo
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    //State lưu thông tin đăng nhập
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    //Hàm cập nhật state khi nhập liệu
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // Gọi auth.service.login()
            await AuthService.login(credentials);

            // Lấy thông tin user vừa lưu để xử lý
            const storedData = JSON.parse(localStorage.getItem("user") || "{}");
            const user = storedData.user;
            const token = storedData.token;
            const userId = user?.id;

            // Gửi tín hiệu Login thành công cho redux
            if (user && token) {
                dispatch(loginSuccess({user, token}));
            }
            const sessions: Session[] = JSON.parse(
                localStorage.getItem("plant_shop_sessions") || "[]"
            );

            const expiry = Date.now() + 1000 * 60 * 60 * 24; // 24h
            const newSession: Session = { token, userId, expiry };

            localStorage.setItem(
                "plant_shop_sessions",
                JSON.stringify([...sessions.filter(s => s.token !== token), newSession])
            );

            // MERGE CART
            const guestCart: CartViewItem[] = JSON.parse(
                localStorage.getItem("cart_guest") || "[]"
            );

            const userCart: CartViewItem[] = JSON.parse(
                localStorage.getItem(`cart_user_${userId}`) || "[]"
            );

            const mergedCart = mergeCartItems(guestCart, userCart);

            // dispatch
            dispatch(setCartItems(mergedCart));

            //  xóa cart guest
            localStorage.removeItem("cart_guest");
            /* MERGE WISHLIST  */
            const guestWishlist: WishlistItem[] = JSON.parse(
                localStorage.getItem("wishlist_guest") || "[]"
            );

            const userWishlist: WishlistItem[] = JSON.parse(
                localStorage.getItem(`wishlist_user_${userId}`) || "[]"
            );

            const mergedWishlist = mergeWishlistItems(
                guestWishlist,
                userWishlist,
                userId
            );

            // Cập nhật Redux Wishlist
            dispatch(setWishlist(mergedWishlist));

            // Lưu lại wishlist mới của user vào local
            localStorage.setItem(
                `wishlist_user_${userId}`,
                JSON.stringify(mergedWishlist)
            );
            localStorage.removeItem("wishlist_guest");

            // Hiển thị thông báo thành công
            const redirect = localStorage.getItem("redirect_after_login");
            const buyNowProduct = localStorage.getItem("buy_now_product");

            if (redirect === "/checkout" && buyNowProduct) {
                dispatch(addToCart({productId: Number(buyNowProduct), quantity: 1}));
            }

            localStorage.removeItem("redirect_after_login");
            localStorage.removeItem("buy_now_product");

            setShowSuccessModal(true);
            setTimeout(() => navigate(redirect || "/"), 1000);

        } catch (err) {
            //Xử lý lỗi
            const error = err as AxiosError<{ message: string }>;
            const msg = error.response?.data?.message || "Đăng nhập thất bại";
            setError(msg);
        }
    };

    return (
        <div className={styles.container}>
            {/*Form đăng nhập*/}
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Đăng nhập</h2>

                <div className={styles.field}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Nhập email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/*Hiển thị lỗi nếu có*/}
                {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

                <button type="submit" className={styles.button}>
                    Đăng nhập
                </button>

                {/* đăng ký mới*/}
                <div className={styles.registerPrompt}>
                    <span>Bạn chưa có tài khoản? </span>
                    <Link to="/register" className={styles.registerLink}>
                        Đăng ký ngay
                    </Link>
                </div>

            </form>

            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        {/*Icon dấu tích*/}
                        <div className={styles.iconContainer}>
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>

                        <h3 className={styles.successTitle}>Đăng nhập thành công!</h3>
                        <p className={styles.successText}>
                            Đang chuyển hướng về trang chủ
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;