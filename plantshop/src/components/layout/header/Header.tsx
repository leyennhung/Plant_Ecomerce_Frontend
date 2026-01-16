import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import menuplant1 from "../../../assets/images/plantmenu1.png";
import logo from "../../../assets/images/Logo.png";

import { categoryService } from "../../../services/category.service";
import type { Category } from "../../../types/category.type";

import Search from "../../../pages/search/Search";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { Link } from "react-router-dom";

const Header = () => {
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [openUser, setOpenUser] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);

    const userRef = useRef<HTMLDivElement>(null);

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

                        <i className="fa-solid fa-heart" />

                        <div className={styles.userWrapper}
                            ref={userRef}
                            onClick={() => setOpenUser(prev => !prev)}
                        >
                            <i className="fa-solid fa-user" />
                            {openUser && (
                                <div className={styles.userDropdown}>
                                    <div className={styles.dropdownItem}>
                                        <i className="fa-solid fa-user-circle" />
                                        <span>Tài khoản</span>
                                    </div>

                                    <div className={styles.dropdownItem}>
                                        <i className="fa-solid fa-box" />
                                        <span>Đơn mua</span>
                                    </div>

                                    <div className={styles.divider} />

                                    <div className={`${styles.dropdownItem} ${styles.logout}`}>
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
                </div>
            </header>
        </>
    );
};

export default Header;
