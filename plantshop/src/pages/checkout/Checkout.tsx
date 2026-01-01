import {useState} from "react";
import styles from "./Checkout.module.css";

const SHIPPING_FEE = 50000;

type CouponRule = {
    code: string;
    min: number;
    discount: number;
};

const COUPONS: CouponRule[] = [
    {code: "FREESHIP", min: 2000000, discount: SHIPPING_FEE},
    {code: "FREESHIP50", min: 1000000, discount: 50000},
    {code: "FREESHIP20", min: 500000, discount: 20000},
    {code: "FREESHIP10", min: 300000, discount: 10000},
];

const Checkout = () => {
    const productTotal = 750000;

    const [payment, setPayment] = useState<"bank" | "cod" | "wallet">("bank");
    const [superPack, setSuperPack] = useState(false);
    const [substrate, setSubstrate] = useState(false);
    const [agree, setAgree] = useState(false);

    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<CouponRule | null>(null);
    const [couponError, setCouponError] = useState("");

    const superPackFee = superPack ? 30000 : 0;
    const substrateFee = substrate ? 25000 : 0;

    const applyCoupon = () => {
        const code = couponInput.trim().toUpperCase();
        const rule = COUPONS.find(c => c.code === code);

        if (!rule) {
            setCouponError("Mã giảm giá không hợp lệ");
            setAppliedCoupon(null);
            return;
        }

        if (productTotal < rule.min) {
            setCouponError(`Đơn hàng chưa đạt ${rule.min.toLocaleString()}₫`);
            setAppliedCoupon(null);
            return;
        }

        setAppliedCoupon(rule);
        setCouponError("");
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput("");
    };

    const shippingDiscount = appliedCoupon
        ? Math.min(appliedCoupon.discount, SHIPPING_FEE)
        : 0;

    const finalShipping = SHIPPING_FEE - shippingDiscount;

    const total =
        productTotal +
        finalShipping +
        superPackFee +
        substrateFee;

    return (
        <div className={styles.page}>
            <h1 className={styles.breadcrumb}>
                GIỎ HÀNG <span>›</span> <b>THANH TOÁN</b> <span>›</span> HOÀN THÀNH
            </h1>

            <div className={styles.layout}>
                {/* LEFT */}
                <div className={styles.left}>
                    <div className={styles.coupon}>
                        <input
                            value={couponInput}
                            onChange={e => setCouponInput(e.target.value)}
                            placeholder="Mã giảm giá"
                        />
                        <button onClick={applyCoupon}>Áp dụng mã giảm giá</button>
                    </div>

                    {couponError && (
                        <p style={{color: "red", fontSize: 13}}>{couponError}</p>
                    )}

                    <h2 className={styles.sectionTitle}>THANH TOÁN & VẬN CHUYỂN</h2>

                    <div className={styles.formGrid}>
                        <input placeholder="Họ và tên *"/>
                        <input placeholder="Số điện thoại *"/>
                        <input placeholder="Email *"/>
                        <select>
                            <option>Hồ Chí Minh</option>
                        </select>
                        <select>
                            <option>Chọn quận / huyện</option>
                        </select>
                        <select>
                            <option>Chọn xã / phường</option>
                        </select>
                        <input
                            className={styles.full}
                            placeholder="Địa chỉ (Ví dụ: Số 20, ngõ 90)"
                        />
                    </div>

                    <h3 className={styles.subTitle}>Gói đóng gói & mua thêm</h3>

                    <label className={styles.option}>
                        <input
                            type="checkbox"
                            checked={superPack}
                            onChange={() => setSuperPack(!superPack)}
                        />
                        <div>
                            <b>Gói “Siêu bảo vệ”</b> (+30.000₫)
                            <p>Đóng gói chống sốc, giữ ẩm an toàn cho cây sống</p>
                        </div>
                    </label>

                    <label className={styles.option}>
                        <input
                            type="checkbox"
                            checked={substrate}
                            onChange={() => setSubstrate(!substrate)}
                        />
                        <div>
                            <b>Giá thể / Bình giữ ẩm</b> (+25.000₫)
                            <p>Hỗ trợ cây khỏe khi vận chuyển xa</p>
                        </div>
                    </label>

                    <textarea
                        className={styles.note}
                        placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                    />
                </div>

                {/* RIGHT */}
                <div className={styles.right}>
                    <div className={styles.summary}>
                        <div className={styles.row}>
                            <span>Tạm tính</span>
                            <span>{productTotal.toLocaleString()}₫</span>
                        </div>

                        <div className={styles.row}>
                            <span>Giao hàng</span>
                            <span>{SHIPPING_FEE.toLocaleString()}₫</span>
                        </div>

                        {appliedCoupon && (
                            <div className={styles.rowDiscount}>
                                <span>
                                    Coupon: {appliedCoupon.code}
                                    <button
                                        onClick={removeCoupon}
                                        style={{marginLeft: 8, fontSize: 12}}
                                    >
                                        [Remove]
                                    </button>
                                </span>
                                <span>-{shippingDiscount.toLocaleString()}₫</span>
                            </div>
                        )}

                        {superPack && (
                            <div className={styles.row}>
                                <span>Gói Siêu bảo vệ</span>
                                <span>{superPackFee.toLocaleString()}₫</span>
                            </div>
                        )}

                        {substrate && (
                            <div className={styles.row}>
                                <span>Giá thể / Bình giữ ẩm</span>
                                <span>{substrateFee.toLocaleString()}₫</span>
                            </div>
                        )}

                        <div className={styles.total}>
                            <span>Tổng</span>
                            <span>{total.toLocaleString()}₫</span>
                        </div>
                    </div>

                    <div className={styles.payment}>
                        <label>
                            <input
                                type="radio"
                                checked={payment === "bank"}
                                onChange={() => setPayment("bank")}
                            />
                            Thanh toán Online
                        </label>

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
                                checked={payment === "wallet"}
                                onChange={() => setPayment("wallet")}
                            />
                            Ví điện tử
                        </label>
                    </div>

                    <label className={styles.agree}>
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                        />
                        Tôi đã đọc và đồng ý điều khoản
                    </label>

                    <button className={styles.orderBtn} disabled={!agree}>
                        ĐẶT HÀNG
                    </button>

                    <div className={styles.freeshipInfo}>
                        <h4>MÃ GIẢM GIÁ</h4>
                        <ul>
                            <li><b>FREESHIP</b> – Miễn phí ship từ 2.000.000₫</li>
                            <li><b>FREESHIP50</b> – Giảm 50.000₫</li>
                            <li><b>FREESHIP20</b> – Giảm 20.000₫</li>
                            <li><b>FREESHIP10</b> – Giảm 10.000₫</li>
                            <li>Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình thực hiện giao
                                dịch, cho những thông báo sau này, hoặc để cung cấp dịch vụ. <br/>
                                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                                    chính sách bảo mật
                                </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
