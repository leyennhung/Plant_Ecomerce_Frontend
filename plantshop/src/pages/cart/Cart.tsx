import { useEffect, useState } from "react";
import styles from "./Cart.module.css";
import { cartService } from "../../services/cart.service";
import type { CartItem } from "../../types/cart.type";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/common/Button";

const Cart = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cartService.getAll()
            .then(data => setItems(data))
            .finally(() => setLoading(false));
    }, []);

    const increaseQty = (id: number) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQty = (id: number) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (loading) return <p>Đang tải giỏ hàng...</p>;

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
                                    <p>{formatPrice(item.price)}</p>

                                    <div className={styles.quantity}>
                                        <Button variant="outline" onClick={() => decreaseQty(item.id)}>-</Button>
                                        <span>{item.quantity}</span>
                                        <Button variant="outline" onClick={() => increaseQty(item.id)}>+</Button>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <p className={styles.total}>
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                    <Button variant="outline" onClick={() => removeItem(item.id)}>
                                        Xóa
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summary}>
                        <div>
                            <h3>Tạm tính</h3>
                            <p className={styles.subtotal}>{formatPrice(subtotal)}</p>
                        </div>
                        <Button>Thanh toán</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
