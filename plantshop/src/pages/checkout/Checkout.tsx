import {useState} from "react";
import styles from "./Checkout.module.css";

const Checkout = () => {
    const productTotal = 650000;

    const [payment, setPayment] = useState<"cod" | "bank" | "wallet">("cod");
    const [superPack, setSuperPack] = useState(false);
    const [humidifier, setHumidifier] = useState(false);

    const shippingFee = 40000;
    const superPackFee = superPack ? 30000 : 0;
    const humidifierFee = humidifier ? 25000 : 0;

    const total =
        productTotal +
        shippingFee +
        superPackFee +
        humidifierFee;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>🧾 Thanh toán</h1>

            {/* THÔNG TIN GIAO HÀNG */}
            <section className={styles.section}>
                <h2>📦 Thông tin giao hàng</h2>
                <input placeholder="Họ và tên"/>
                <input placeholder="Số điện thoại"/>
                <input placeholder="Địa chỉ giao hàng"/>
                <textarea placeholder="Ghi chú cho người giao hàng"/>
            </section>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <section className={styles.section}>
                <h2>💳 Phương thức thanh toán</h2>

                <label>
                    <input
                        type="radio"
                        checked={payment === "cod"}
                        onChange={() => setPayment("cod")}
                    />
                    Thanh toán khi nhận hàng (COD)
                </label>

                <label>
                    <input
                        type="radio"
                        checked={payment === "bank"}
                        onChange={() => setPayment("bank")}
                    />
                    Chuyển khoản ngân hàng
                </label>

                <label>
                    <input
                        type="radio"
                        checked={payment === "wallet"}
                        onChange={() => setPayment("wallet")}
                    />
                    Ví điện tử (Momo, ZaloPay)
                </label>
            </section>

            {/* GÓI ĐÓNG GÓI ĐẶC BIỆT */}
            <section className={styles.section}>
                <h2>📦 Gói đóng gói & bảo vệ cây</h2>

                <div className={styles.option}>
                    <input
                        type="checkbox"
                        checked={superPack}
                        onChange={() => setSuperPack(!superPack)}
                    />
                    <label>
                        <strong>Gói "Siêu bảo vệ"</strong> (+30.000₫)
                        <p>Đóng gói chống sốc, giữ ẩm, an toàn cao cho cây sống</p>
                    </label>
                </div>

                <div className={styles.option}>
                    <input
                        type="checkbox"
                        checked={humidifier}
                        onChange={() => setHumidifier(!humidifier)}
                    />
                    <label>
                        <strong>Bình giữ ẩm / Khay vận chuyển</strong> (+25.000₫)
                        <p>Giúp cây không bị khô trong quá trình vận chuyển</p>
                    </label>
                </div>
            </section>


            {/* TÓM TẮT GIAO HÀNG */}
            <section className={styles.summary}>
                <h2>🧾 Tóm tắt giao hàng</h2>

                <div className={styles.row}>
                    <span>Tạm tính sản phẩm</span>
                    <span>{productTotal.toLocaleString()}₫</span>
                </div>

                <div className={styles.row}>
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString()}₫</span>
                </div>

                {superPack && (
                    <div className={styles.row}>
                        <span>Gói Siêu bảo vệ</span>
                        <span>{superPackFee.toLocaleString()}₫</span>
                    </div>
                )}

                {humidifier && (
                    <div className={styles.row}>
                        <span>Bình giữ ẩm</span>
                        <span>{humidifierFee.toLocaleString()}₫</span>
                    </div>
                )}

                <div className={styles.total}>
                    <span>Tổng thanh toán</span>
                    <span>{total.toLocaleString()}₫</span>
                </div>

                {/* TOOLTIP NHẮC NHỞ */}
                <div className={styles.notice}>
                    🌱 <strong>Lưu ý:</strong> Sản phẩm là <b>cây sống</b>, dự kiến
                    giao <b>3–5 ngày</b>.
                    Phí vận chuyển đã bao gồm <b>đóng gói chống sốc</b>.
                </div>

                <button className={styles.orderBtn}>Đặt hàng</button>
            </section>
        </div>
    );
};

export default Checkout;
