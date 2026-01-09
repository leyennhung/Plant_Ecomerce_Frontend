import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
    const navigate = useNavigate();

    // State quản lý Tab đang active
    const [activeTab, setActiveTab] = useState('profile');

    // State quản lý chế độ Sửa (true = đang sửa, false = chỉ xem)
    const [isEditing, setIsEditing] = useState(false);

    // Load dữ liệu từ local storage
    const [formData, setFormData] = useState(() => {
        const storedUserJSON = localStorage.getItem('user');
        const parsedData = storedUserJSON ? JSON.parse(storedUserJSON) : {};
        const storedUser = parsedData.user || parsedData;

        console.log("Dữ liệu user lấy được:", storedUser);

        return {
            username: storedUser.username || '',
            firstName: storedUser.first_name || '',
            lastName: storedUser.last_name || '',
            email: storedUser.email || '',
            phone: storedUser.phone || '',
        };
    });

    // Danh sách các tab
    const menuTabs = [
        { key: 'profile', label: 'Hồ sơ' },
        { key: 'orders', label: 'Đơn hàng' },
    ];

    // Xử lý khi nhập liệu
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Xử lý nút sửa / lưu thông tin
    const handleEditOrSave = () => {
        if (isEditing) {
            // Lấy dữ liệu gốc từ LocalStorage
            const storedJSON = localStorage.getItem('user');
            const oldData = storedJSON ? JSON.parse(storedJSON) : {};

            let newData;

            // Kiểm tra nếu dữ liệu gốc có chứa object 'user' thì phải cập nhật vào bên trong nó
            if (oldData.user) {
                newData = {
                    ...oldData, // Giữ nguyên các trường ở lớp ngoài
                    user: {
                        ...oldData.user, // Giữ nguyên dữ liệu cũ trong object user

                        // Cập nhật các trường mới sửa
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        phone: formData.phone
                    }
                };
            } else {
                // Trường hợp nếu dữ liệu không bị lồng nhau
                newData = {
                    ...oldData,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    phone: formData.phone,
                };
            }

            // Lưu lại LocalStorage
            localStorage.setItem('user', JSON.stringify(newData));

            // Tắt chế độ sửa
            setIsEditing(false);

        } else {
            //
            setIsEditing(true);
        }
    };

    // Xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('user'); // Xóa user
        navigate('/login'); // Quay về trang đăng nhập
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

                {/* Tab là Hồ sơ */}
                {activeTab === 'profile' && (
                    <div className={styles.profileLayout}>

                        {/* Cột Trái: Form nhập liệu */}
                        <div className={styles.formSection}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div className={styles.formGroup} style={{ flex: 1 }}>
                                    <label className={styles.label}>Họ</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className={styles.input}
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Chưa cập nhật"
                                    />
                                </div>
                                <div className={styles.formGroup} style={{ flex: 1 }}>
                                    <label className={styles.label}>Tên</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className={styles.input}
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Chưa cập nhật"
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
                                    disabled={true} // Email không cho sửa
                                    style={{ backgroundColor: '#f0f2f5', cursor: 'not-allowed' }}
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
                                    disabled={!isEditing}
                                    placeholder="Chưa cập nhật"
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button
                                    className={styles.saveBtn}
                                    onClick={handleEditOrSave}
                                    style={{ backgroundColor: isEditing ? '#28a745' : '' }}
                                >
                                    {isEditing ? 'Lưu thông tin' : 'Sửa thông tin'}
                                </button>

                                <button className={styles.logoutBtn} onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>

                        {/* Cột Phải: Ảnh đại diện */}
                        <div className={styles.photoSection}>
                            <p className={styles.label} style={{ marginBottom: '15px' }}></p>
                            <div className={styles.avatarWrapper}>
                                <img
                                    src="https://cdn.prod.website-files.com/6516b906a45da7a169a81553/653fbb4b1d9ed3bffbf4ba68_user_physiopoint3.png"
                                    alt="Avatar người dùng"
                                    className={styles.avatar}
                                />
                            </div>
                            <label className={styles.userName}>
                                {formData.username}
                            </label>
                        </div>
                    </div>
                )}

                 Tab là Đơn hàng
                {activeTab === 'orders' && (
                    <div className={styles.ordersTab}>
                         HEADER
                        <div className={styles.headerBlock}>
                            <div className={styles.colProductsHeader}>Sản phẩm</div>
                            <div className={styles.colDateHeader}>Ngày Đặt</div>
                            <div className={styles.colStatusHeader}>Trạng Thái</div>
                            <div className={styles.colPriceHeader}>Tổng Tiền</div>
                            <div className={styles.colActionHeader}></div>
                        </div>

                        DANH SÁCH ĐƠN HÀNG
                        <div className={styles.orderList}>
                            <div className={styles.orderBlock}>
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
                                <div className={styles.colDate}>
                                    <span className={styles.textData}>31/12/2025</span>
                                </div>
                                <div className={styles.colStatus}>
                                    <span className={`${styles.badge} ${styles.badgeProcessing}`}>
                                        Đang xử lý
                                    </span>
                                </div>
                                <div className={styles.colPrice}>
                                    <span className={styles.priceData}>4.500.000đ</span>
                                </div>
                                <div className={styles.colAction}>
                                    <button className={styles.btnDetail}>Xem chi tiết</button>
                                </div>
                            </div>

                            <div className={styles.orderBlock}>
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
                                <div className={styles.colDate}>
                                    <span className={styles.textData}>30/12/2025</span>
                                </div>
                                <div className={styles.colStatus}>
                                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>Đã giao</span>
                                </div>
                                <div className={styles.colPrice}>
                                    <span className={styles.priceData}>150.000đ</span>
                                </div>
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