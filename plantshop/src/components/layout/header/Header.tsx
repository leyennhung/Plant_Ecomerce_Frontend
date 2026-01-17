import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import menuplant1 from "../../../assets/images/plantmenu1.png";
import logo from "../../../assets/images/Logo.png";

import { categoryService } from "../../../services/category.service";
import type { Category } from "../../../types/category.type";

import Search from "../../../pages/search/Search";
import {useDispatch, useSelector} from "react-redux";
import type { RootState } from "../../../store";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../store/authSlice";

const Header = () => {
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [openUser, setOpenUser] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);

    const userRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const wishListCount = wishlistItems.length;

    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    useEffect(() => {
        categoryService.getAll().then(setCategories);
    }, []);

    // Click outside user menu
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                userRef.current &&
                !userRef.current.contains(e.target as Node)
            ) {
                setOpenUser(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Kiểm tra đăng nhập khi click icon user
    const handleUserClick = () => {
        if (isAuthenticated) {
            setOpenUser(prev => !prev);
        } else {
            navigate("/login");
        }
    };

    // Xử lý đăng xuất
    const handleLogout = () => {
        dispatch(logout());
        setOpenUser(false);
        setShowLogoutPopup(false);
        navigate("/login");
    };


    // Mở popup xác nhận Đăng xuất
    const handleConfirmLogout = () => {
        setShowLogoutPopup(true);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.content}>
                    {/* 1.LOGO */}
                    <div className={styles.logo}>
                        <Link to="/">
                            <img src={logo} alt="Logo" />
                        </Link>
                    </div>

                    {/* 3. ACTION */}
                    <div className={styles.action}>
                        <i
                            className="fa-solid fa-magnifying-glass"
                            onClick={() => setSearchOpen(true)}
                        />
                        <Search open={searchOpen} onClose={() => setSearchOpen(false)} />

                        <Link to="/carts" className={styles.cartWrapper}>
                            <i className="fa-solid fa-cart-shopping" />
                            {cartCount > 0 && (
                                <span className={styles.cartBadge}>{cartCount}</span>
                            )}
                        </Link>

                        {/* Gắn link Wishlist */}
                        <Link to="/wishlist"className={styles.wishListWrapper}>
                            <i className="fa-solid fa-heart" />
                            {wishListCount > 0 && (<span className={styles.wishListBadge}>{wishListCount}</span>)}
                        </Link>

                        {/* Xử lý logic User */}
                        <div className={styles.userWrapper}
                             ref={userRef}
                             onClick={handleUserClick}
                        >
                            <i className="fa-solid fa-user" />

                            {/* Chỉ hiển thị menu khi đã login và đang mở */}
                            {openUser && isAuthenticated && (
                                <div className={styles.userDropdown}>
                                    {/* Link tới Profile */}
                                    <Link to="/profile" className={styles.dropdownItem}>
                                        <i className="fa-solid fa-user-circle" />
                                        <span>Tài khoản</span>
                                    </Link>

                                    {/* Link tới Orders */}
                                    <Link to="/orders" className={styles.dropdownItem}>
                                        <i className="fa-solid fa-box" />
                                        <span>Đơn mua</span>
                                    </Link>

                                    <div className={styles.divider} />

                                    {/* Nút đăng xuất */}
                                    <div
                                        className={`${styles.dropdownItem} ${styles.logout}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleConfirmLogout();
                                        }}
                                    >
                                        <i className="fa-solid fa-right-from-bracket" />
                                        <span>Đăng xuất</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2.MENU + MEGA */}
                <div
                    className={styles.menuWrapper}
                    onMouseLeave={() => setOpenMenu(null)}>
                    <div className={styles.menuheader}>
                        <div className={styles.menu}>
                            {categories.map(cat => (
                                <Link key={cat.id}
                                    to={`/products/category/${cat.slug}`}
                                    className={styles.menuItem}
                                    onMouseEnter={() => setOpenMenu(cat.id)}>
                                    <span>{cat.name}</span>
                                    <i className="fa-solid fa-angle-down" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* MEGA MENU */}
                    {openMenu && (
                        <div className={styles.megaMenu}>
                            <div className={styles.megaContent}>
                                {categories
                                    .filter(cat => cat.id === openMenu)
                                    .map(cat =>
                                        cat.attribute_groups.map(group => (
                                            <div key={group.group.id}
                                                className={styles.column}>
                                                <h4>Theo {group.group.name}</h4>
                                                {group.attributes.map(attr => (
                                                    <Link key={attr.id}
                                                        to={`/products/category/${cat.slug}?attrId=${attr.id}`}
                                                        className={styles.attrLink}
                                                        onClick={() => setOpenMenu(null)}>
                                                        <i className="fa-solid fa-seedling" />
                                                        <span className={styles.attrText}>
                                                            {attr.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ))
                                    )}

                                <div className={styles.image}>
                                    <img src={menuplant1} alt="plant" />
                                </div>
                            </div>
                        </div>
                    )}
                    {/*POPUP XÁC NHẬN ĐĂNG XUẤT*/}
                    {showLogoutPopup && (
                        <div className={styles.popupOverlay}>
                            <div className={styles.popupBox}>
                                <p>Bạn có chắc muốn đăng xuất?</p>
                                <div className={styles.popupActions}>
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={handleLogout}
                                    >
                                        Đồng ý
                                    </button>
                                    <button
                                        className={styles.logoutBtn}
                                        onClick={() => setShowLogoutPopup(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
