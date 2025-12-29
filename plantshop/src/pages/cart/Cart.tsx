import { useEffect, useState } from "react";
import styles from "./Cart.module.css";
import Button from "../../components/common/Button";
import type { CartViewItem } from "../../types/cart.type";
import { cartService } from "../../services/cart.service";

const Cart = () => {
    const [items, setItems] = useState<CartViewItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cartService
            .getAll()
            .then(setItems)
            .finally(() => setLoading(false));
    }, []);

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (loading) {
        return <p style={{ textAlign: "center" }}>Đang tải giỏ hàng...</p>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.breadcrumb}>
                <b>GIỎ HÀNG</b> <span>›</span> THANH TOÁN <span>›</span> HOÀN THÀNH
            </h1>

            {items.length === 0 ? (
                <p>Giỏ hàng trống</p>
            ) : (
                <>
                    <div className={styles.tableWrapper}>
                        <div className={styles.table}>
                            <div className={`${styles.row} ${styles.header}`}>
                                <div></div>
                                <div>TÊN SẢN PHẨM</div>
                                <div>GIÁ TIỀN</div>
                                <div>SỐ LƯỢNG</div>
                                <div>TỔNG</div>
                            </div>

                            {items.map(item => (
                                <div key={item.id} className={styles.row}>
                                    <button className={styles.removeBtn}>✕</button>

                                    <div className={styles.product}>
                                        <img src={item.image} alt={item.name} />
                                        <span>{item.name}</span>
                                    </div>

                                    <div className={styles.price}>
                                        {item.price.toLocaleString()}₫
                                    </div>

                                    <div className={styles.quantity}>
                                        <Button variant="outline">-</Button>
                                        <span>{item.quantity}</span>
                                        <Button variant="outline">+</Button>
                                    </div>

                                    <div className={styles.total}>
                                        {(item.price * item.quantity).toLocaleString()}₫
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.summary}>
                        <div>
                            <h3>Tạm tính</h3>
                            <p className={styles.subtotal}>
                                {subtotal.toLocaleString()}₫
                            </p>
                        </div>
                        <Button>Thanh toán</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
