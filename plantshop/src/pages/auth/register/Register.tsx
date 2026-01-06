import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import AuthService from "../../../services/auth.service";
import type {RegisterRequest} from "../../../types/user.type";
import styles from "./Register.module.css";

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");

    // 1. Thêm State để bật tắt Modal thông báo
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState<RegisterRequest>({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await AuthService.register(formData);

            // 2. Thay thế alert() bằng việc bật Modal
            // alert("Đăng ký thành công!..."); -> XÓA DÒNG NÀY
            // navigate("/auth/login"); -> XÓA DÒNG NÀY (để user tự bấm)

            setShowSuccessModal(true); // Hiện Modal lên

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const msg = error.response?.data?.message || "Đăng ký thất bại";
            setError(msg);
        }
    };

    // Hàm xử lý khi bấm nút "Ở lại"
    const handleStay = () => {
        setShowSuccessModal(false); // Tắt modal
        // Tùy chọn: Reset form để nhập mới nếu muốn
        setFormData({ username: "", email: "", password: "" });
    };

    // Hàm xử lý khi bấm nút "Đến trang đăng nhập"
    const handleGoToLogin = () => {
        navigate("/login");
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Đăng ký</h2>

                <div className={styles.field}>
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Nhập username"
                           value={formData.username} onChange={handleChange} required />
                </div>

                <div className={styles.field}>
                    <label>Email</label>
                    <input type="email" name="email" placeholder="Nhập email"
                           value={formData.email} onChange={handleChange} required />
                </div>

                <div className={styles.field}>
                    <label>Mật khẩu</label>
                    <input type="password" name="password" placeholder="Nhập mật khẩu"
                           value={formData.password} onChange={handleChange} required />
                </div>

                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                <button type="submit" className={styles.button}>
                    Đăng ký
                </button>
            </form>

            {/* 3. Phần giao diện Modal (Chỉ hiện khi showSuccessModal = true) */}
            {showSuccessModal && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Đăng ký thành công!</h3>

                        <div className={styles.modalActions}>
                            {/* Nút bên trái: Ở lại */}
                            <button
                                type="button"
                                className={styles.btnStay}
                                onClick={handleStay}
                            >
                                Ở lại
                            </button>

                            {/* Nút bên phải: Đến trang Login */}
                            <button
                                type="button"
                                className={styles.btnLogin}
                                onClick={handleGoToLogin}
                            >
                                Đến trang đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;