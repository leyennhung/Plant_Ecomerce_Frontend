import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import menuplant1 from "../../../assets/images/plantmenu1.png";
import logo from "../../../assets/images/Logo.png";
import {categoryService} from "../../../services/category.service";
import type {Category} from "../../../types/category.type";

const Header = () => {
    const [openMenu, setOpenMenu] = useState<number | null>(null); // id category đang mở
    const [openUser, setOpenUser] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // ref bao cả menu trigger + mega menu
    const menuRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        categoryService.getAll().then(setCategories); // load categories từ API
    }, []);

    // Click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                userRef.current &&
                !userRef.current.contains(e.target as Node)
            ) {
                setOpenMenu(null);
                setOpenUser(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuClick = (id: number) => {
        setOpenMenu(prev => (prev === id ? null : id));
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.content}>
                    {/* 1. LOGO */}
                    <div className={styles.logo}>
                        <img src={logo} alt="Logo" />
                    </div>

                    {/* 3. ACTION */}
                    <div className={styles.action}>
                        <i className="fa-solid fa-magnifying-glass" />
                        <i className="fa-solid fa-cart-shopping" />
                        <div className={styles.userWrapper}
                            ref={userRef}
                            onClick={() => setOpenUser(prev => !prev)}>
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
                <div className={styles.menuheader}>
                    {/* 2. MENU */}
                    <div className={styles.menu} ref={menuRef}>
                        {categories.map(cat => (
                            <div key={cat.id}
                                 className={`${styles.menuItem} ${
                                     openMenu === cat.id ? styles.active : ""
                                 }`}
                                 onClick={() => handleMenuClick(cat.id)}>
                                <span>{cat.name}</span>
                                <i className={`fa-solid ${
                                    openMenu === cat.id
                                        ? "fa-angle-up"
                                        : "fa-angle-down"
                                }`}/>
                            </div>
                        ))}
                        {/*<div className={styles.menuItem}>*/}
                        {/*    <span>Hướng dẫn</span>*/}
                        {/*    <i className="fa-solid fa-angle-down" />*/}
                        {/*</div>*/}
                    </div>
                </div>
            </header>

            {/* 2.1 MEGA MENU */}
            {openMenu && (
                <div className={styles.megaMenu}>
                    <div className={styles.megaContent}>
                        {categories
                            .filter(cat => cat.id === openMenu)
                            .map(cat =>
                                cat.attribute_groups.map(group => (
                                    <div key={group.group.id} className={styles.column}>
                                        <h4>Theo {group.group.name}</h4>
                                        {group.attributes.map(attr => (
                                            <a key={attr.id} className={styles.attrLink}>
                                                <i className="fa-solid fa-seedling" aria-hidden="true" />
                                                <span className={styles.attrText}>{attr.name}</span>
                                            </a>
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
        </>
    );
};

export default Header;
