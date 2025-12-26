import { useEffect, useState } from "react";
import styles from "./Cart.module.css";
import Button from "../../components/common/Button";

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

const Cart = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/plant/products")
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch products");
                }
                return res.json();
            })
            .then(data => {
                setItems(data); // data = products array từ MSW
            })
            .catch(err => {
                console.error("Fetch error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
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
            <h1 className={styles.title}>🛒 Giỏ hàng</h1>

            {items.length === 0 ? (
                <p>Giỏ hàng trống</p>
            ) : (
                <>
                    <div className={styles.list}>
                        {items.map(item => (
                            <div key={item.id} className={styles.item}>
                                <img src={item.image} alt={item.name} />

                                <div className={styles.info}>
                                    <h3>{item.name}</h3>
                                    <p>{item.price.toLocaleString()}₫</p>

                                    <div className={styles.quantity}>
                                        <Button variant="outline">-</Button>
                                        <span>{item.quantity}</span>
                                        <Button variant="outline">+</Button>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <p className={styles.total}>
                                        {(item.price * item.quantity).toLocaleString()}₫
                                    </p>
                                    <Button variant="outline">Xóa</Button>
                                </div>
                            </div>
                        ))}
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
