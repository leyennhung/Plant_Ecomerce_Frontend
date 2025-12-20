import styles from "./Register.module.css";

const Register = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: gọi auth.service.register()
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Đăng ký</h2>

                <div className={styles.field}>
                    <label>Họ và tên</label>
                    <input type="text" placeholder="Nhập họ và tên" required />
                </div>

                <div className={styles.field}>
                    <label>Email</label>
                    <input type="email" placeholder="Nhập email" required />
                </div>

                <div className={styles.field}>
                    <label>Mật khẩu</label>
                    <input type="password" placeholder="Nhập mật khẩu" required />
                </div>

                <div className={styles.field}>
                    <label>Xác nhận mật khẩu</label>
                    <input type="password" placeholder="Nhập lại mật khẩu" required />
                </div>

                <button type="submit" className={styles.button}>
                    Đăng ký
                </button>
            </form>
        </div>
    );
};

export default Register;
