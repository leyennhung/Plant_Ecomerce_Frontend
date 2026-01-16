import {useState, useEffect, useMemo} from "react";
import styles from "./Checkout.module.css";
import {useNavigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import type {RootState} from "../../store";
import provincesData from "../../mocks/data/provinces.json";
import wardsData from "../../mocks/data/wards.json";
import {mapToCheckoutCart} from "../../utils/mapCheckoutCart";
import {useShippingFee} from "../../hooks/useShippingFee";
import CheckoutPaymentFlow from "../../pages/payment/CheckoutPaymentFlow";
import substrateImg from "../../assets/images/substrate.png";
import type {CartViewItem, CartItemEntity} from "../../types/cart.type";
import type {Order, OrderCreatePayload} from "../../types/order.type";

/* ================== COUPON ================== */
type CouponRule = {
    code: string;
    min: number;
    discount: number;
};

const COUPONS: CouponRule[] = [
    {code: "FREESHIP", min: 2_000_000, discount: 999_999},
    {code: "FREESHIP50", min: 1_000_000, discount: 50_000},
    {code: "FREESHIP20", min: 500_000, discount: 20_000},
    {code: "FREESHIP10", min: 300_000, discount: 10_000},
];

/* ================== SAVE ORDER (GLOBAL) ================== */
const saveOrderLocal = (
    order: OrderCreatePayload,
    items: CartViewItem[]
): string => {
    const key = order.user_id ? `orders` : "orders";
    const orders: Order[] = JSON.parse(localStorage.getItem(key) || "[]");

    const orderItems: CartItemEntity[] = JSON.parse(
        localStorage.getItem("order_items") || "[]"
    );

    const orderId = "ORD-" + Date.now();

    const newOrder: Order = {
        id: orderId,
        status: "pending",
        created_at: new Date().toISOString(),
        ...order,
    };

    const newOrderItems: CartItemEntity[] = items.map((item, index) => ({
        id: orderItems.length + index + 1,
        order_id: orderId,
        product_id: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        original_price: item.original_price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));
    localStorage.setItem(key, JSON.stringify([...orders, newOrder]));
    localStorage.setItem(
        "order_items",
        JSON.stringify([...orderItems, ...newOrderItems])
    );

    return orderId;
};

/* ================== COMPONENT ================== */
const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    /* ---------- LOGIN GUARD (BLOCK HARD) ---------- */
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = storedUser?.user?.id || null;

    useEffect(() => {
        if (!userId) {
            navigate("/login", {state: {redirect: "/checkout"}});
        }
    }, [userId, navigate]);

    /* ---------- SELECTED ITEMS ---------- */
    const selectedKeys: string[] = location.state?.selectedKeys || [];
    const buyNowItems: CartViewItem[] = JSON.parse(
        localStorage.getItem("buy_now_order") || "[]"
    );

    const selectedItems: CartViewItem[] =
        selectedKeys.length > 0
            ? cartItems.filter(item =>
                selectedKeys.includes(`${item.productId}-${item.variantId ?? "base"}`)
            )
            : buyNowItems;



    /* ---------- FORM STATE ---------- */
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
    const [addressLine, setAddressLine] = useState("");
    const provinces = provincesData.provinces;
    const wards = wardsData.wards.filter(w => w.province_id === provinceId);

    const [note, setNote] = useState("");

    /* ---------- COUPON ---------- */
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<CouponRule | null>(null);
    const [couponError, setCouponError] = useState("");

    /* ---------- SHIPPING ---------- */
    const checkoutCart = useMemo(
        () => mapToCheckoutCart(selectedItems),
        [selectedItems]
    );

    const {shippingFee, totalWeight, zone, isTruck} = useShippingFee(
        provinceId,
        checkoutCart
    );

    useEffect(() => {
        localStorage.setItem(
            "checkout_shipping",
            JSON.stringify({shippingFee, totalWeight, provinceId})
        );
    }, [shippingFee, totalWeight, provinceId]);

    /* ---------- PRICE ---------- */
    const superPackFee = superPack ? 30_000 : 0;
    const substrateFee = substrate ? 25_000 : 0;

    const productTotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const shippingDiscount = appliedCoupon
        ? Math.min(appliedCoupon.discount, shippingFee)
        : 0;

    const finalShipping = Math.max(0, shippingFee - shippingDiscount);

    const total = productTotal + finalShipping + superPackFee + substrateFee;

    /* ---------- GUARDS ---------- */
    useEffect(() => {
        if (selectedItems.length === 0) navigate("/carts");
    }, [selectedItems, navigate]);

    /* ---------- COUPON HANDLER ---------- */
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

    /* ---------- ORDER ---------- */
    const handleOrder = () => {
        if (!userId) {
            navigate("/login", {state: {redirect: "/checkout"}});
            return;
        }

        if (!fullName || !phone || !email) {
            setFormError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (!/^\d{9,11}$/.test(phone)) {
            setFormError("Số điện thoại không hợp lệ");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setFormError("Email không hợp lệ");
            return;
        }

        if (!provinceId || !wardId) {
            setFormError("Vui lòng chọn tỉnh/thành và xã/phường");
            return;
        }

        const province = provinces.find(p => p.id === provinceId)?.name;
        const ward = wardsData.wards.find(w => w.id === wardId)?.name;

        const payload: OrderCreatePayload = {
            user_id: userId,
            recipient_name: fullName,
            recipient_phone: phone,
            full_address: [addressLine, ward, province].filter(Boolean).join(", "),
            payment_method_id: payment === "cod" ? 2 : payment === "wallet" ? 3 : 1,
            payment_status: "unpaid",
            subtotal: productTotal,
            shipping_fee: finalShipping,
            discount_amount: shippingDiscount,
            total_amount: total,
        };

        const orderId = saveOrderLocal(payload, selectedItems);

        localStorage.setItem(
            "order_meta",
            JSON.stringify({
                orderId,
                email,
                note,
            })
        );

        navigate("/order_success", {
            state: {
                orderId,
                total,
                paymentMethod:
                    payment === "cod"
                        ? "Thanh toán khi nhận hàng (COD)"
                        : payment === "bank"
                            ? "Thanh toán Online"
                            : "Ví điện tử",
                address: [addressLine, ward, province].filter(Boolean).join(", "),
                recipientName: fullName,
                recipientPhone: phone,
                email,
                note,
                currentStep: 0,
            },
        });
    };

    if (!userId) return null;
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
                            onChange={e => setCouponInput(e.target.value)}
                            placeholder="Mã giảm giá"
                        />
                        <button onClick={applyCoupon}>Áp dụng</button>
                    </div>
                    {couponError && (
                        <p style={{color: "red", fontSize: 13}}>{couponError}</p>
                    )}

                    {/* Cart preview */}
                    <div className={styles.cartPreview}>
                        <h3 className={styles.sectionTitle}>SẢN PHẨM ĐÃ CHỌN</h3>
                        {checkoutCart.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.cartInfo}>
                                    <b>{item.name}</b>
                                    <p>
                                        {item.quantity} × {(item.price ?? 0).toLocaleString()}₫
                                    </p>
                                </div>
                                <div className={styles.cartPrice}>
                                    {((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}₫
                                </div>
                            </div>
                        ))}

                        <div className={styles.cartTotalRow}>
                            <span>Tổng tiền hàng</span>
                            <span>{productTotal.toLocaleString()}₫</span>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>THANH TOÁN & VẬN CHUYỂN</h2>

                    <div className={styles.formGrid}>
                        <input
                            placeholder="Họ và tên *"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />
                        <input
                            placeholder="Số điện thoại *"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                        <input
                            placeholder="Email *"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <select
                            value={provinceId}
                            onChange={e => {
                                const value = e.target.value;
                                setProvinceId(value ? Number(value) : "");
                                setWardId("");
                            }}
                        >
                            <option value="">Chọn tỉnh / thành phố</option>
                            {provinces.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={wardId}
                            onChange={e => {
                                const value = e.target.value;
                                setWardId(value ? Number(value) : "");
                            }}
                            disabled={!provinceId}
                        >
                            <option value="">Chọn xã / phường</option>
                            {wards.map(w => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>

                        <input
                            className={styles.full}
                            placeholder="Địa chỉ (Ví dụ: Số 20, ngõ 90)"
                            value={addressLine}
                            onChange={e => setAddressLine(e.target.value)}
                        />
                    </div>

                    {formError && (
                        <p style={{color: "red", fontSize: 13}}>{formError}</p>
                    )}

                    {/* Add-on options */}
                    <h3 className={styles.subTitle}>Gói đóng gói & mua thêm</h3>
                    <img
                        src={substrateImg}
                        alt="Gói đóng gói & mua thêm"
                        className={styles.addonImage}
                    />
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
                        value={note}
                        onChange={e => setNote(e.target.value)}
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
                        {zone && (
                            <div className={styles.row}>
                <span>
                  Giao hàng ({zone})
                    {zone === "Z4" && (
                        <small style={{color: "#d97706", marginLeft: 6}}>
                            (khu vực xa – phí cao)
                        </small>
                    )}
                </span>
                                <span>{shippingFee.toLocaleString()}₫</span>
                            </div>
                        )}

                        {isTruck && (
                            <div
                                style={{fontSize: 14, color: "#3c7d3e", marginBottom: 5}}
                            >
                                Đơn hàng lớn, vận chuyển bằng xe tải
                            </div>
                        )}

                        {appliedCoupon && (
                            <div>
                                <div className={styles.rowDiscount}>
                  <span>
                    Mã giảm giá: {appliedCoupon.code}
                      <button
                          onClick={removeCoupon}
                          style={{marginLeft: 8, fontSize: 12}}
                      >
                      [Bỏ mã giảm giá]
                    </button>
                  </span>
                                    <span>-{shippingDiscount.toLocaleString()}₫</span>
                                </div>
                                <div className={styles.row} style={{marginTop: 8}}>
                                    <span>Phí vận chuyển sau giảm</span>
                                    <span>{finalShipping.toLocaleString()}₫</span>
                                </div>
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
                                name="payment"
                                checked={payment === "bank"}
                                onChange={() => setPayment("bank")}
                            />
                            Thanh toán Online
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="payment"
                                checked={payment === "cod"}
                                onChange={() => setPayment("cod")}
                            />
                            Thanh toán khi nhận hàng (COD)
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="payment"
                                checked={payment === "wallet"}
                                onChange={() => setPayment("wallet")}
                            />
                            Ví điện tử
                        </label>

                        {(payment === "bank" || payment === "wallet") && (
                            <CheckoutPaymentFlow payment={payment}/>
                        )}

                        {payment === "cod" && (
                            <p style={{fontSize: 13, color: "#555"}}>
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
                                <b>FREESHIP</b> – Miễn phí phí vận chuyển
                                <br/>
                                Áp dụng cho đơn hàng từ <b>2.000.000₫</b>
                            </li>
                            <li>
                                <b>FREESHIP50</b> – Giảm <b>50.000₫</b> phí vận chuyển
                                <br/>
                                Áp dụng cho đơn hàng từ <b>1.000.000₫</b>
                            </li>
                            <li>
                                <b>FREESHIP20</b> – Giảm <b>20.000₫</b> phí vận chuyển
                                <br/>
                                Áp dụng cho đơn hàng từ <b>500.000₫</b>
                            </li>
                            <li>
                                <b>FREESHIP10</b> – Giảm <b>10.000₫</b> phí vận chuyển
                                <br/>
                                Áp dụng cho đơn hàng từ <b>300.000₫</b>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.couponNote}>
                        <p>
                            <b>Điều kiện áp dụng:</b>
                        </p>
                        <ul>
                            <li>Mã giảm giá chỉ áp dụng cho <b>phí vận chuyển</b></li>
                            <li>Mỗi đơn hàng chỉ sử dụng được <b>01 mã</b></li>
                            <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác</li>
                            <li>Không có giá trị quy đổi thành tiền mặt</li>
                            <li>Áp dụng cho tất cả phương thức thanh toán</li>
                        </ul>
                        <p>
                            Nhập mã và bấm <b>Áp dụng</b> để kiểm tra điều kiện giảm phí vận
                            chuyển.
                        </p>
                        <p>
                            <b>Lưu ý:</b> Mã giảm giá chỉ áp dụng cho phí vận chuyển. Các khu
                            vực giao hàng được chia thành các zone:
                        </p>
                        <ul>
                            <li>
                                <b>Z1:</b> Trung tâm, phí vận chuyển thấp
                            </li>
                            <li>
                                <b>Z2:</b> Ngoại thành gần, phí vận chuyển trung bình
                            </li>
                            <li>
                                <b>Z3:</b> Ngoại thành xa, phí vận chuyển cao
                            </li>
                            <li>
                                <b>Z4:</b> Khu vực đặc biệt, phí vận chuyển cao hơn
                            </li>
                            <li style={{fontSize: 16, listStyle: "none"}}>
                                Mời bạn xem thêm về{" "}
                                <a href="/shipping-policy">phương thức vận chuyển</a>
                            </li>
                        </ul>
                    </div>
                    <li style={{fontSize: 16, listStyle: "none"}}>
                        Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình
                        giao dịch. Xem <a href="/privacy-policy">chính sách bảo mật</a>
                    </li>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
