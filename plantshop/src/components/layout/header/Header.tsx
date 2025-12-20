import { useState } from "react";
import styles from "./Header.module.css";
import menuplant1 from "../../../assets/images/plantmenu1.png";
import logo from "../../../assets/images/Logo.png";

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openUser, setOpenUser] = useState(false);

    return (
        <div className={styles.headerWrapper}
            onMouseEnter={() => setOpenMenu(true)}
            onMouseLeave={() => setOpenMenu(false)}>
            <header className={styles.header}>
                {/* Logo */}
                <div className={styles.logo}><img src={logo} alt="Logo" /></div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <div className={styles.menuWrapper}
                        onMouseEnter={() => setOpenMenu(true)}>
                        <div className={styles.menuTitle}>
                            <span className={styles.link}>Cây trong nhà</span>
                            <i className={`fa-solid ${
                                    openMenu ? "fa-angle-up" : "fa-angle-down"
                                }`}/>
                        </div>
                    </div>

                    <span className={styles.link}>Cây ngoài trời</span>
                    <span className={styles.link}>Chậu cây</span>
                    <span className={styles.link}>Phụ kiện</span>
                    <span className={styles.link}>Hướng dẫn</span>
                </nav>

                {/* Actions */}
                <div className={styles.actions}>
                    {/* SEARCH */}
                    <div className={styles.iconWrapper}>
                        <i className="fa-solid fa-magnifying-glass" />
                    </div>

                    {/* CART */}
                    <div className={styles.iconWrapper}>
                        <i className="fa-solid fa-cart-shopping" />
                        {/*<span className={styles.badge}>2</span>*/}
                    </div>
                    {/* USER */}
                    <div className={styles.userWrapper}
                        onClick={() => setOpenUser(prev => !prev)}>
                        <i className="fa-solid fa-user" />

                        {openUser && (
                            <div className={styles.userDropdown}>
                                <div className={styles.dropdownItem}>
                                    <i className="fa-solid fa-user-circle" />
                                    Thông tin tài khoản
                                </div>
                                <div className={styles.dropdownItem}>
                                    <i className="fa-solid fa-box" />
                                    Đơn mua
                                </div>
                                <div className={styles.divider} />
                                <div className={`${styles.dropdownItem} ${styles.logout}`}>
                                    <i className="fa-solid fa-right-from-bracket" />
                                    Đăng xuất
                                </div>
                            </div>     )}
                        </div>
                </div>

            </header>

            {/* 👉 MEGA MENU NẰM NGOÀI HEADER */}
            {openMenu && (
                <div className={styles.megaMenu}>
                    <div className={styles.menuContent}>
                        <div className={styles.menuColumn}>
                            <h4>Theo kiểu dáng cây</h4>
                            <a className={styles.menuItem}>Cây Cao & Lớn</a>
                            <a className={styles.menuItem}>Cây Cảnh Mini</a>
                            <a className={styles.menuItem}>Cây Treo Trong Nhà</a>
                            <a className={styles.menuItem}>Cây Nhiệt Đới</a>
                            <a className={styles.menuItem}>Cây Kiểng Lá</a>
                        </div>

                        <div className={styles.menuColumn}>
                            <h4>Theo vị trí đặt</h4>
                            <a className={styles.menuItem}>Cây Cảnh Để Bàn</a>
                            <a className={styles.menuItem}>Cây Cảnh Văn Phòng</a>
                            <a className={styles.menuItem}>Cây Trong Bếp & Nhà Tắm</a>
                            <a className={styles.menuItem}>Cây Trước Cửa & Hành Lang</a>
                            <a className={styles.menuItem}>Cây Trồng Ban Công</a>
                        </div>

                        <div className={styles.menuColumn}>
                            <h4>Theo chức năng</h4>
                            <a className={styles.menuItem}>Cây Lọc Không Khí</a>
                            <a className={styles.menuItem}>Cây Dễ Trồng</a>
                            <a className={styles.menuItem}>Cây Cần Ít Ánh Sáng</a>
                            <a className={styles.menuItem}>Cây Thủy Sinh</a>
                            <a className={styles.menuItem}>Cây Phong Thủy</a>
                        </div>

                        <div className={styles.menuImage}>
                            <img src={menuplant1} alt="plants" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
