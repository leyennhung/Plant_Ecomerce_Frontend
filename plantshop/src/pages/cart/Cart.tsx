import styles from "./Cart.module.css";
import Button from "../../components/common/Button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { updateQuantity, removeFromCart, } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const items = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Xử lý thay đổi số lượng sản phẩm
    const handleChangeQty = (productId: number, qty: number) => {
        if (qty < 1) return;
        dispatch(updateQuantity({ productId, quantity: qty }));
    };

    // Tính tổng tiền tạm tính
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.breadcrumb}>
                <b>GIỎ HÀNG</b>
            </h1>

            {/* giỏ hàng trống */}
            {items.length === 0 ? (<p>Giỏ hàng trống</p>) : (
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
                                    <button className={styles.removeBtn} onClick={() => dispatch(removeFromCart(item.productId))}> ✕ </button>

                                    {/* Tên sản phẩm */}
                                    <div className={styles.product}>
                                        <img src={item.image} alt={item.name} />
                                        <span>{item.name}</span>
                                    </div>

                                    {/* Giá sản phẩm */}
                                    <div className={styles.price}>
                                        {item.price.toLocaleString()}₫
                                    </div>

                                    {/* Điều chỉnh số lượng */}
                                    <div className={styles.quantity}>
                                        <Button onClick={() => handleChangeQty(item.productId, item.quantity - 1)}>-</Button>

                                        {/* HIỂN THỊ SỐ LƯỢNG */}
                                        <span className={styles.qtyValue}>{item.quantity}</span>
                                        <Button onClick={() => handleChangeQty(item.productId, item.quantity + 1)}>+</Button>
                                    </div>


                                    {/* Tổng tiền của sản phẩm */}
                                    <div className={styles.total}>
                                        {(item.price * item.quantity).toLocaleString()}₫
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tổng kết giỏ hàng */}
                    <div className={styles.summary}>
                        <div>
                            <h3>Tạm tính</h3>
                            <p className={styles.subtotal}>
                                {subtotal.toLocaleString()}₫
                            </p>
                        </div>
                        <Button onClick={() => navigate("/checkout")}>
                            Thanh toán
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
