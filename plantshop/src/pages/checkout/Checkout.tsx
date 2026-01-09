import { useState, useEffect, useMemo } from "react";
import styles from "./Checkout.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import provincesData from "../../mocks/data/provinces.json";
import wardsData from "../../mocks/data/wards.json";
import { mapToCheckoutCart } from "../../utils/mapCheckoutCart";
import { useShippingFee } from "../../hooks/useShippingFee";
import CheckoutPaymentFlow from "../../pages/payment/CheckoutPaymentFlow";

// COUPON TYPE + DATA
type CouponRule = {
    code: string;
    min: number; // giá trị đơn tối thiểu
    discount: number; // số tiền giảm
};

const COUPONS: CouponRule[] = [
    { code: "FREESHIP", min: 2_000_000, discount: 999_999 },
    { code: "FREESHIP50", min: 1_000_000, discount: 50_000 },
    { code: "FREESHIP20", min: 500_000, discount: 20_000 },
    { code: "FREESHIP10", min: 300_000, discount: 10_000 },
];

const Checkout = () => {
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    // FORM STATE
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [formError, setFormError] = useState("");

    const [payment, setPayment] = useState<"bank" | "cod" | "wallet">("bank");
    const [superPack, setSuperPack] = useState(false);
    const [substrate, setSubstrate] = useState(false);
    const [agree, setAgree] = useState(false);

    const [provinceId, setProvinceId] = useState<number | "">("");
    const [wardId, setWardId] = useState<number | "">("");

    const provinces = provincesData.provinces;
    const wards = wardsData.wards.filter((w) => w.province_id === provinceId);

    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<CouponRule | null>(null);
    const [couponError, setCouponError] = useState("");

    const checkoutCart = useMemo(() => mapToCheckoutCart(cartItems), [cartItems]);
    const { shippingFee, totalWeight, needContact, zone, isTruck } = useShippingFee(
        provinceId,
        checkoutCart
    );

    useEffect(() => {
        localStorage.setItem(
            "checkout_shipping",
            JSON.stringify({ shippingFee, totalWeight, provinceId })
        );
    }, [shippingFee, totalWeight, provinceId]);

    const superPackFee = superPack ? 30_000 : 0;
    const substrateFee = substrate ? 25_000 : 0;

    const productTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const shippingDiscount = appliedCoupon ? Math.min(appliedCoupon.discount, shippingFee) : 0;
    const finalShipping = Math.max(0, shippingFee - shippingDiscount);
    const total = productTotal + finalShipping + superPackFee + substrateFee;

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/carts");
        }
    }, [cartItems, navigate]);

    const applyCoupon = () => {
        const code = couponInput.trim().toUpperCase();
        const rule = COUPONS.find((c) => c.code === code);

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

    const handleOrder = () => {
        if (!fullName || !phone || !email) {
            setFormError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (!provinceId || !wardId) {
            setFormError("Vui lòng chọn tỉnh/thành và xã/phường");
            return;
        }

        if (needContact) {
            alert("Khu vực này cần liên hệ để báo phí vận chuyển");
            return;
        }

        const province = provinces.find((p) => p.id === provinceId)?.name;
        const ward = wardsData.wards.find((w) => w.id === wardId)?.name;

        navigate("/order_success", {
            state: {
                orderId: "ORD-" + Date.now(),
                total,
                paymentMethod:
                    payment === "cod"
                        ? "Thanh toán khi nhận hàng (COD)"
                        : payment === "bank"
                            ? "Thanh toán Online"
                            : "Ví điện tử",
                address: [ward, province].filter(Boolean).join(", "),
                recipientName: fullName,
                recipientPhone: phone,
                email,
                currentStep: 0,
            },
        });
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.breadcrumb}>
                <b>THANH TOÁN</b>
            </h1>

            <div className={styles.layout}>
                {/* LEFT */}
                <div className={styles.left}>
                    {/* Coupon */}
                    <div className={styles.coupon}>
                        <input
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Mã giảm giá"
                        />
                        <button onClick={applyCoupon}>Áp dụng</button>
                    </div>
                    {couponError && (
                        <p style={{ color: "red", fontSize: 13 }}>{couponError}</p>
                    )}

                    {/* Cart preview */}
                    <div className={styles.cartPreview}>
                        <h3 className={styles.sectionTitle}>SẢN PHẨM ĐÃ CHỌN</h3>
                        {checkoutCart.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.cartInfo}>
                                    <b>{item.name}</b>
                                    <p>
                                        {item.quantity} × {item.price.toLocaleString()}₫
                                    </p>
                                </div>
                                <div className={styles.cartPrice}>
                                    {(item.price * item.quantity).toLocaleString()}₫
                                </div>
                            </div>
                        ))}
                        <div className={styles.cartTotalRow}>
                            <span>Tạm tính</span>
                            <span>{productTotal.toLocaleString()}₫</span>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>THANH TOÁN & VẬN CHUYỂN</h2>

                    <div className={styles.formGrid}>
                        <input
                            placeholder="Họ và tên *"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <input
                            placeholder="Số điện thoại *"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <input
                            placeholder="Email *"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <select
                            value={provinceId}
                            onChange={(e) => {
                                setProvinceId(Number(e.target.value));
                                setWardId("");
                            }}
                        >
                            <option value="">Chọn tỉnh / thành phố</option>
                            {provinces.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={wardId}
                            onChange={(e) => setWardId(Number(e.target.value))}
                            disabled={!provinceId}
                        >
                            <option value="">Chọn xã / phường</option>
                            {wards.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>

                        <input
                            className={styles.full}
                            placeholder="Địa chỉ (Ví dụ: Số 20, ngõ 90)"
                        />
                    </div>

                    {formError && <p style={{ color: "red", fontSize: 13 }}>{formError}</p>}

                    {/* Add-on options */}
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
                    {/* Order summary */}
                    <div className={styles.summary}>
                        <h3 className={styles.sectionTitle}>ĐƠN HÀNG CỦA BẠN</h3>
                        <div className={styles.row}>
                            <span>Tạm tính</span>
                            <span>{productTotal.toLocaleString()}₫</span>
                        </div>
                        <div className={styles.row}>
                            <span>Giao hàng ({zone ?? "Chưa chọn"})</span>
                            <span>{shippingFee.toLocaleString()}₫</span>
                        </div>

                        {needContact && (
                            <div style={{ color: "red", fontSize: 13 }}>
                                Vui lòng liên hệ để báo phí
                            </div>
                        )}
                        {isTruck && (
                            <div
                                style={{ fontSize: 14, color: "#3c7d3e", marginBottom: 5 }}
                            >
                                Đơn hàng lớn, vận chuyển bằng xe tải
                            </div>
                        )}

                        {appliedCoupon && (
                            <div className={styles.rowDiscount}>
                                <span>
                                    Mã giảm giá: {appliedCoupon.code}
                                    <button
                                        onClick={removeCoupon}
                                        style={{ marginLeft: 8, fontSize: 12 }}
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

                    {/* PAYMENT */}
                    <div className={styles.payment}>
                        <h3 className={styles.sectionTitle}>PHƯƠNG THỨC THANH TOÁN</h3>
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

                        {(payment === "bank" || payment === "wallet") && (
                            <CheckoutPaymentFlow payment={payment} />
                        )}

                        {payment === "cod" && (
                            <p style={{ fontSize: 13, color: "#555" }}>
                                Bạn sẽ thanh toán khi nhận hàng
                            </p>
                        )}
                    </div>

                    <label className={styles.agree}>
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                        />
                        Tôi đã đọc và đồng ý điều khoản
                    </label>

                    <button
                        className={styles.orderBtn}
                        disabled={!agree}
                        onClick={handleOrder}
                    >
                        ĐẶT HÀNG
                    </button>

                    {/* Coupon info */}
                    <div className={styles.freeshipInfo}>
                        <h4>MÃ GIẢM GIÁ</h4>
                        <ul>
                            <li>
                                <b>FREESHIP</b> – Miễn phí phí vận chuyển<br />
                                Áp dụng cho đơn hàng từ <b>2.000.000₫</b>
                            </li>
                            <li>
                                <b>FREESHIP50</b> – Giảm <b>50.000₫</b> phí vận chuyển<br />
                                Áp dụng cho đơn hàng từ <b>1.000.000₫</b>
                            </li>
                            <li>
                                <b>FREESHIP20</b> – Giảm <b>20.000₫</b> phí vận chuyển<br />
                                Áp dụng cho đơn hàng từ <b>500.000₫</b>
                            </li>
                            <li>
                                <b>FREESHIP10</b> – Giảm <b>10.000₫</b> phí vận chuyển<br />
                                Áp dụng cho đơn hàng từ <b>300.000₫</b>
                            </li>
                        </ul>
                    </div>

                    {/* NOTE / Hướng dẫn mã giảm giá */}
                    <div className={styles.couponNote}>
                        <p><b>Điều kiện áp dụng:</b></p>
                        <ul>
                            <li>Mã giảm giá chỉ áp dụng cho <b>phí vận chuyển</b></li>
                            <li>Mỗi đơn hàng chỉ sử dụng được <b>01 mã</b></li>
                            <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác</li>
                            <li>Không có giá trị quy đổi thành tiền mặt</li>
                            <li>Áp dụng cho tất cả phương thức thanh toán</li>
                        </ul>
                        <p>
                            Nhập mã và bấm <b>Áp dụng</b> để kiểm tra điều kiện giảm phí vận chuyển.
                        </p>
                        <p>
                            <b>Lưu ý:</b> Mã giảm giá chỉ áp dụng cho phí vận chuyển. Các khu vực giao hàng được chia
                            thành các zone:
                        </p>
                        <ul>
                            <li><b>Z1:</b> Trung tâm, phí vận chuyển thấp</li>
                            <li><b>Z2:</b> Ngoại thành gần, phí vận chuyển trung bình</li>
                            <li><b>Z3:</b> Ngoại thành xa, phí vận chuyển cao</li>
                            <li><b>Z4:</b> Khu vực đặc biệt, vui lòng liên hệ trước khi đặt</li>
                        </ul>
                    </div>
                    <li style={{fontSize: 16, listStyle: "none"}}>
                        Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình giao dịch.
                        Xem <a href="/privacy-policy">chính sách bảo mật</a>
                    </li>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
