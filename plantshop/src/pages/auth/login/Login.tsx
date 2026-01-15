import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
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
            //Gọi auth.service.login()
            await AuthService.login(credentials);

            //  MERGE CART 
            const guestCart: CartViewItem[] = JSON.parse(
                localStorage.getItem("cart_guest") || "[]"
            );

            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            const userId = stored?.user?.id;

            const userCart: CartViewItem[] = JSON.parse(
                localStorage.getItem(`cart_user_${userId}`) || "[]"
            );

            const mergedCart = mergeCartItems(guestCart, userCart);

            // dispatch
            dispatch(setCartItems(mergedCart));

            //  xóa cart guest
            localStorage.removeItem("cart_guest");
            /*  MERGE WISHLIST  */
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

            dispatch(setWishlist(mergedWishlist));
            localStorage.setItem(
                `wishlist_user_${userId}`,
                JSON.stringify(mergedWishlist)
            );
            localStorage.removeItem("wishlist_guest");
            setShowSuccessModal(true);
            setTimeout(() => navigate("/"), 2000);

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

                        <h3 className={styles.successTitle}>Đăngg nhập thành công!</h3>
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