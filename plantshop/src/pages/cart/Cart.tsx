import styles from "./Cart.module.css";
import Button from "../../components/common/Button";
import {useSelector, useDispatch} from "react-redux";
import {useState} from "react";
import type {RootState} from "../../store";
import {updateQuantity, removeFromCart,} from "../../store/cartSlice";
import {useNavigate} from "react-router-dom";

const Cart = () => {
    const items = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Xử lý thay đổi số lượng sản phẩm
    const handleChangeQty = (productId: number, qty: number) => {
        if (qty < 1) return;
        dispatch(updateQuantity({productId, quantity: qty}));
    };

    // Tính tổng tiền tạm tính
    const subtotal = items
        .filter(item => selectedIds.includes(item.productId))
        .reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );


    return (
        <div className={styles.container}>
            <h1 className={styles.breadcrumb}>
                <b>GIỎ HÀNG</b>
            </h1>

            {/* giỏ hàng trống */}
            {items.filter(i => i?.productId).length === 0 ? (
                <div className={styles.emptyCart}>
                    <div className={styles.emptyIcon}><i className="fa-solid fa-cart-shopping"/></div>
                    <h3 className={styles.emptyTitle}>
                        Giỏ hàng của bạn đang trống
                    </h3>

                    <p className={styles.emptyDesc}>
                        Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm
                    </p>

                    <Button onClick={() => navigate("/")}>
                        Tiếp tục mua sắm
                    </Button>
                </div>
            ) : (
                <>
                    <div className={styles.tableWrapper}>
                        <div className={styles.table}>
                            <div className={`${styles.row} ${styles.header}`}>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={
                                            items.length > 0 &&
                                            selectedIds.length === items.length
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedIds(items.map(i => i.productId));
                                            } else {
                                                setSelectedIds([]);
                                            }
                                            setShowError(false);
                                        }}
                                    />
                                </div>
                                <div>TÊN SẢN PHẨM</div>
                                <div>GIÁ TIỀN</div>
                                <div>SỐ LƯỢNG</div>
                                <div>TỔNG</div>
                                <div>XÓA</div>
                            </div>

                            {items.map(item => (
                                <div key={item.productId} className={styles.row}>
                                    {/* Checkbox */}
                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.productId)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(prev => [...prev, item.productId]);
                                                } else {
                                                    setSelectedIds(prev =>
                                                        prev.filter(id => id !== item.productId)
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                    {/* Tên sản phẩm */}
                                    <div className={styles.product}>
                                        <img src={item.image} alt={item.name}/>
                                        <span>{item.name}</span>
                                    </div>

                                    {/* Giá sản phẩm */}
                                    <div className={styles.price}>
                                        {item.price.toLocaleString()}₫
                                    </div>

                                    {/* Điều chỉnh số lượng */}
                                    <div className={styles.quantity}>
                                        <Button
                                            onClick={() => handleChangeQty(item.productId, item.quantity - 1)}>-</Button>

                                        {/* HIỂN THỊ SỐ LƯỢNG */}
                                        <span className={styles.qtyValue}>{item.quantity}</span>
                                        <Button
                                            onClick={() => handleChangeQty(item.productId, item.quantity + 1)}>+</Button>
                                    </div>


                                    {/* Tổng tiền của sản phẩm */}
                                    <div className={styles.total}>
                                        {(item.price * item.quantity).toLocaleString()}₫
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => dispatch(removeFromCart(item.productId))}
                                    >
                                        ✕
                                    </button>

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
                        <div className={styles.checkoutWrapper}>
                            <Button
                                onClick={() => {
                                    if (selectedIds.length === 0) {
                                        setShowError(true);
                                        return;
                                    }
                                    setShowError(false);
                                    navigate("/checkout", {state: {selectedIds}});
                                }}
                            >
                                Thanh toán
                            </Button>

                            {/* Thông báo lỗi */}
                            {showError && (
                                <p className={styles.errorMessage}>
                                    Vui lòng chọn ít nhất 1 sản phẩm để thanh toán
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
