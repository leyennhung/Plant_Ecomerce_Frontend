import { useEffect, useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import styles from "./OrderSuccess.module.css";
import { saveOrder } from "../../utils/orderStorage";

const ORDER_STEPS = [
    "Đã đặt hàng",
    "Đã xác nhận",
    "Đang đóng gói",
    "Đang giao hàng",
    "Hoàn tất",
];

type OrderState = {
    orderId: string;
    total: number;
    paymentMethod: string;
    address: string;
    currentStep?: number;
};

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as OrderState | null;

    const hasSaved = useRef(false);
    useEffect(() => {
        if (!state || hasSaved.current) return;
        hasSaved.current = true;

        saveOrder({
            user_id: null,
            recipient_name: "Khách hàng",
            recipient_phone: "0000000000",
            full_address: state.address,
            payment_method_id:
                state.paymentMethod === "Thanh toán Online" ? 1 : 2,
            payment_status: "paid",
            subtotal: state.total,
            shipping_fee: 0,
            discount_amount: 0,
            total_amount: state.total,
            status: "pending",
            created_at: new Date().toISOString(),
        });
    }, [state]);

    if (!state) return <Navigate to="/" replace />;

    const { orderId, total, paymentMethod, address, currentStep = 0 } = state;

    return (
        <div className={styles.page}>
            <h1 className={styles.breadcrumb}>
                <b>HOÀN THÀNH</b>
            </h1>

            <div className={styles.layout}>
                <div className={styles.left}>
                    <div className={styles.summary}>
                        <div className={styles.icon}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="12" fill="#3B823E" />
                                <path d="M16 9l-5 5-3-3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p className={styles.sub}>Cảm ơn bạn đã mua sắm tại cửa hàng</p>

                        {/* Thông tin đơn hàng */}
                        <div className={styles.row}>
                            <span>Mã đơn hàng:</span><span>{orderId}</span>
                        </div>
                        <div className={styles.row}>
                            <span>Tổng tiền:</span><span>{total.toLocaleString()}₫</span>
                        </div>
                        <div className={styles.row}>
                            <span>Thanh toán:</span><span>{paymentMethod}</span>
                        </div>
                        <div className={styles.row}>
                            <span>Địa chỉ:</span><span>{address}</span>
                        </div>

                        {/* Timeline */}
                        <h3 className={styles.subTitle}>Tiến trình đơn hàng</h3>
                        <div className={styles.timeline}>
                            {ORDER_STEPS.map((step, index) => (
                                <div
                                    key={step}
                                    className={`${styles.step} ${index <= currentStep ? styles.active : ""}`}>
                                    <div className={styles.dot}></div>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className={styles.actions}>
                            <button
                                className={styles.btnOutline}
                                onClick={() => navigate("/")}>
                                Về trang chủ
                            </button>

                            <button
                                className={styles.btn}
                                onClick={() => navigate("/orders")}>
                                Xem đơn hàng
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.right} />
            </div>
        </div>
    );
};

export default OrderSuccess;
