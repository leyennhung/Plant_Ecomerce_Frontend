import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
    const navigate = useNavigate();

    // State quản lý chế độ Sửa (true = đang sửa, false = chỉ xem)
    const [isEditing, setIsEditing] = useState(false);

    // State popup
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

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

            // Popup lưu thành công
            setShowSavePopup(true);
            setTimeout(() => {
                setShowSavePopup(false);
            }, 2000);

        } else {
            setIsEditing(true);
        }
    };

    // Xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Mở popup xác nhận Đăng xuất
    const handleConfirmLogout = () => {
        setShowLogoutPopup(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>

                <h1 className={styles.pageTitle}>Tài khoản của tôi</h1>

                <div className={styles.profileLayout}>

                    {/* CỘT TRÁI – FORM */}
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
                                className={styles.input}
                                value={formData.email}
                                disabled
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
                    </div>

                    {/* CỘT PHẢI – AVATAR */}
                    <div className={styles.photoSection}>
                        <div className={styles.avatarWrapper}>
                            <img
                                src="https://cdn.prod.website-files.com/6516b906a45da7a169a81553/653fbb4b1d9ed3bffbf4ba68_user_physiopoint3.png"
                                className={styles.avatar}
                                alt="avatar"
                            />
                        </div>

                        <div className={styles.userName}>
                            {formData.username}
                        </div>

                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.saveBtn}
                                onClick={handleEditOrSave}
                            >
                                {isEditing ? 'Lưu' : 'Sửa thông tin'}
                            </button>

                            <button
                                className={styles.logoutBtn}
                                onClick={handleConfirmLogout}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*POPUP LƯU THÀNH CÔNG*/}
            {showSavePopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupBox}>
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
                        <p>Cập nhật thông tin thành công</p>
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
                                className={styles.saveBtn}
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
    );
};

export default Profile;
