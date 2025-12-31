import React, {useState} from 'react';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
    // State quản lý Tab đang active
    const [activeTab, setActiveTab] = useState('profile');

    // Danh sách các tab (Key dùng để logic, Label dùng để hiển thị)
    const menuTabs = [
        {key: 'profile', label: 'Hồ sơ'},
        {key: 'orders', label: 'Đơn hàng'},
    ];

    // State giả lập dữ liệu user
    const [formData, setFormData] = useState({
        firstName: 'Bảo An',
        lastName: 'Nguyễn',
        email: 'nguyenbaoan@gmail.com',
        phone: '0989 895 433',
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>

                {/* Tiêu đề trang */}
                <h1 className={styles.pageTitle}>Tài khoản của tôi</h1>

                {/* Thanh Tabs Navigation */}
                <nav className={styles.tabs}>
                    {menuTabs.map((tab) => (
                        <div
                            key={tab.key}
                            className={`${styles.tabItem} ${
                                activeTab === tab.key ? styles.activeTab : ''
                            }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </div>
                    ))}
                </nav>

                {/* Nội dung chính: Chỉ hiển thị khi Tab là Profile */}
                {activeTab === 'profile' && (
                    <div className={styles.profileLayout}>

                        {/* Cột Trái: Form nhập liệu */}
                        <div className={styles.formSection}>
                            <div style={{display: 'flex', gap: '20px'}}>
                                <div className={styles.formGroup} style={{flex: 1}}>
                                    <label className={styles.label}>Họ</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className={styles.input}
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formGroup} style={{flex: 1}}>
                                    <label className={styles.label}>Tên</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className={styles.input}
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Địa chỉ Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={styles.input}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className={styles.input}
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button className={styles.saveBtn}>
                                    Sửa thông tin
                                </button>

                                <button className={styles.logoutBtn}>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>

                        {/* Cột Phải: Ảnh đại diện */}

                        {/*<div className={styles.avatarWrapper}>
                            <img
                                //src="https://i.pravatar.cc/300?img=12"
                                //src="https://cdn-icons-png.freepik.com/512/3607/3607444.png"
                                src="https://images.vexels.com/media/users/3/175595/isolated/preview/60441b8371d1f5a6f017dcfb42f71b71-plant-man-woman-tree-leaf-flat-person.png"
                                //src="https://img.freepik.com/free-vector/hand-drawn-flat-design-tree-planting-illustration_23-2149205729.jpg?semt=ais_hybrid&w=740&q=80"
                                alt="Avatar người dùng"
                                className={styles.avatar}
                            />
                        </div>*/}

                        {/* Cột Phải: Ảnh đại diện */}
                        <div className={styles.photoSection}>
                            <p className={styles.label} style={{marginBottom: '15px'}}></p>
                            <div className={styles.avatarWrapper}>
                                <img
                                    //src="https://i.pinimg.com/736x/fa/88/c2/fa88c242e9d0511f0976baaeb288a7a2.jpg"
                                    src="https://cdn.prod.website-files.com/6516b906a45da7a169a81553/653fbb4b1d9ed3bffbf4ba68_user_physiopoint3.png"
                                    alt="Avatar người dùng"
                                    className={styles.avatar}
                                />
                            </div>
                            <label className={styles.userName}>
                                Bảo An
                            </label>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className={styles.ordersTab}>

                        {/* HEADER */}
                        <div className={styles.headerBlock}>
                            <div className={styles.colProductsHeader}>Sản phẩm</div>
                            <div className={styles.colDateHeader}>Ngày Đặt</div>
                            <div className={styles.colStatusHeader}>Trạng Thái</div>
                            <div className={styles.colPriceHeader}>Tổng Tiền</div>
                            <div className={styles.colActionHeader}></div>
                        </div>

                        {/*DANH SÁCH ĐƠN HÀNG*/}
                        <div className={styles.orderList}>
                            <div className={styles.orderBlock}>
                                {/* CỘT 1: DANH SÁCH SẢN PHẨM */}
                                <div className={styles.colProducts}>
                                    <div className={styles.productItem}>
                                        <img
                                            src="https://mowgarden.com/wp-content/uploads/2022/09/cay-ngu-gia-bi-xanh-de-ban-chau-men-su-768x768.jpg"
                                            alt="Cây ngũ gia bì xanh"
                                            className={styles.thumb}
                                        />
                                        <div className={styles.productMeta}>
                                            <span className={styles.prodName}>Cây ngũ gia bì xanh</span>
                                            <span className={styles.prodQty}>x1</span>
                                        </div>
                                    </div>
                                    <div className={styles.productItem}>
                                        <img
                                            src="https://mowgarden.com/wp-content/uploads/2022/10/cay-bang-singapore-mini-uyen-uong-768x768.jpg"
                                            alt="Cây bàng Singapore"
                                            className={styles.thumb}
                                        />
                                        <div className={styles.productMeta}>
                                            <span className={styles.prodName}>Cây bàng Singapore</span>
                                            <span className={styles.prodQty}>x2</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CỘT 2: NGÀY ĐẶT */}
                                <div className={styles.colDate}>
                                    <span className={styles.textData}>31/12/2025</span>
                                </div>

                                {/* CỘT 3: TRẠNG THÁI */}
                                <div className={styles.colStatus}>
           <span className={`${styles.badge} ${styles.badgeProcessing}`}>
             Đang xử lý
           </span>
                                </div>

                                {/* CỘT 4: TỔNG TIỀN */}
                                <div className={styles.colPrice}>
                                    <span className={styles.priceData}>4.500.000đ</span>
                                </div>

                                {/* CỘT 5: BUTTON */}
                                <div className={styles.colAction}>
                                    <button className={styles.btnDetail}>Xem chi tiết</button>
                                </div>

                            </div>
                            <div className={styles.orderBlock}>
                                {/* CỘT 1 */}
                                <div className={styles.colProducts}>
                                    <div className={styles.productItem}>
                                        <img
                                            src="https://mowgarden.com/wp-content/uploads/2022/08/cay-rong-bac-de-ban-mowgarden-768x768.jpg"
                                            alt="Cây Rồng Bạc"
                                            className={styles.thumb}
                                        />
                                        <div className={styles.productMeta}>
                                            <span className={styles.prodName}>Cây Rồng Bạc</span>
                                            <span className={styles.prodQty}>x1</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CỘT 2 */}
                                <div className={styles.colDate}>
                                    <span className={styles.textData}>30/12/2025</span>
                                </div>

                                {/* CỘT 3 */}
                                <div className={styles.colStatus}>
                                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>Đã giao</span>
                                </div>

                                {/* CỘT 4 */}
                                <div className={styles.colPrice}>
                                    <span className={styles.priceData}>150.000đ</span>
                                </div>

                                {/* CỘT 5 */}
                                <div className={styles.colAction}>
                                    <button className={styles.btnDetail}>Xem chi tiết</button>
                                </div>

                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;