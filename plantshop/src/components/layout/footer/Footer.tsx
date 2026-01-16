import styles from "../footer/Footer.module.css"
import logo from "../../../assets/images/logo_while.png"
// import intro from "../../../assets/images/vuoncay.png"

    const Footer = () => {
        return (
            <footer className={styles.footer}>
                <div className={styles.content}>
                    {/* COL 1 */}
                    <div className={styles.col1}>
                        <div className={styles.logo}>
                            <img src={logo} alt="Plant a Plant Logo" />
                        </div>
                        <div className={styles.intro}>
                            <p>
                                <strong>PLANT A PLANT</strong> mang đến giải pháp cây giống
                                khỏe – xanh – bền vững, giúp bạn gieo trồng niềm tin,
                                nuôi dưỡng mầm sống và kiến tạo không gian xanh cho
                                gia đình, nông trại và công trình.
                            </p>
                        </div>
                        {/*<div className={styles.imgintro}>*/}
                        {/*    <img src={intro} alt="Plant a Plant Logo" />*/}
                        {/*</div>*/}
                    </div>

                    {/* COL 2 */}
                    <div className={styles.col2}>
                        <h3>Về chúng tôi</h3>
                        <ul>
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Liên hệ</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                            <li><a href="#">Chính sách bảo hành</a></li>
                            <li><a href="#">Phương thức thanh toán</a></li>
                            <li><a href="#">Phương thức vận chuyển</a></li>
                        </ul>
                    </div>

                    {/* COL 3 */}
                    <div className={styles.col3}>
                        <h3>Liên hệ</h3>
                        <p>Hotline 1: 09 6688 9393</p>
                        <p>Hotline 2: 0838 369 639</p>
                        <p>Hotline 3: 097 753 7494</p>
                        <p>Email: hotro@plantaplant.com</p>
                        <p>Địa chỉ: Thủ đức, TP.HCM</p>
                    </div>

                    {/* COL 4 */}
                    <div className={styles.col4}>
                        <h3>Mạng xã hội</h3>
                        <div className={styles.socials}>
                            <a href="#">f</a>
                            <a href="#">t</a>
                            <a href="#">in</a>
                        </div>
                    </div>
                </div>

                <div className={styles.copyright}>
                    © 2025 Plant a Plant. All rights reserved.
                </div>
            </footer>
        );
    };

    export default Footer;