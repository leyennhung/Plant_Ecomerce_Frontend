import styles from "./Login.module.css";

const Login = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: gọi auth.service.login()
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Đăng nhập</h2>

                <div className={styles.field}>
                    <label>Email</label>
                    <input type="email" placeholder="Nhập email" required />
                </div>

                <div className={styles.field}>
                    <label>Mật khẩu</label>
                    <input type="password" placeholder="Nhập mật khẩu" required />
                </div>

                <button type="submit" className={styles.button}>
                    Đăng nhập
                </button>
            </form>
        </div>
    );
};

export default Login;
