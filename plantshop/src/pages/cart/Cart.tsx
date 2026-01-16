import styles from "./Cart.module.css";
import Button from "../../components/common/Button";
import {useSelector, useDispatch} from "react-redux";
import {useState} from "react";
import type {RootState} from "../../store";
import {updateQuantity, removeFromCart,} from "../../store/cartSlice";
import {useNavigate} from "react-router-dom";
import type {CartViewItem} from "../../types/cart.type.ts";

const Cart = () => {
    const items = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);

    const getItemKey = (item: CartViewItem) =>
        `${item.productId}-${item.variantId ?? "base"}`;
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    // Xử lý thay đổi số lượng sản phẩm
    const handleChangeQty = (productId: number, qty: number, variantId?: number) => {
        if (qty < 1) return;
        dispatch(updateQuantity({productId, quantity: qty, variantId}));
    };

    // Tính tổng tiền tạm tính
    const subtotal = items
        .filter(item => selectedKeys.includes(getItemKey(item)))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);


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
                                        checked={items.length > 0 && selectedKeys.length === items.length}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectedKeys(items.map(getItemKey));
                                            } else {
                                                setSelectedKeys([]);
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
                                            checked={selectedKeys.includes(getItemKey(item))}
                                            onChange={e => {
                                                const key = getItemKey(item);
                                                if (e.target.checked) {
                                                    setSelectedKeys(prev => [...prev, key]);
                                                } else {
                                                    setSelectedKeys(prev => prev.filter(k => k !== key));
                                                }
                                                setShowError(false);
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
                                        {item.isWholesale ? (
                                            <>
                                                {/* Giá gốc bị gạch (chỉ hiện khi đang áp dụng giá sỉ) */}
                                                <span className={styles.oldPrice}>
                                            {item.original_price?.toLocaleString()}₫
                                          </span>
                                                {/* Giá sau khi áp dụng giá sỉ */}
                                                <span className={styles.newPrice}>
                                            {item.price.toLocaleString()}₫
                                          </span>
                                                {/* Nhãn "Giá sỉ" */}
                                                <span className={styles.wholesaleBadge}>Giá sỉ</span>
                                            </>
                                        ) : (
                                            <>
                                                {/* Giá hiện tại (giá thường hoặc giá sale) */}
                                                <span className={styles.newPrice}>
                                            {item.price.toLocaleString()}₫
                                          </span>
                                                {/* Nếu chưa đủ số lượng để được giá sỉ hiện tooltip gợi ý */}
                                                {item.wholesaleMin && (
                                                    <span
                                                        className={styles.tooltip}
                                                        title={`Mua ≥ ${item.wholesaleMin} để được giá sỉ`}>ⓘ</span>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Điều chỉnh số lượng */}
                                    <div className={styles.quantity}>
                                        <Button
                                            onClick={() => handleChangeQty(item.productId, item.quantity - 1, item.variantId)}
                                        >-</Button>

                                        <span className={styles.qtyValue}>{item.quantity}</span>

                                        <Button
                                            onClick={() => handleChangeQty(item.productId, item.quantity + 1, item.variantId)}
                                        >+</Button>
                                    </div>

                                    {/* Tổng tiền của sản phẩm */}
                                    <div className={styles.total}>
                                        {(item.price * item.quantity).toLocaleString()}₫
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() =>
                                            dispatch(removeFromCart({
                                                productId: item.productId,
                                                variantId: item.variantId
                                            }))
                                        }
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
                                    const stored = localStorage.getItem("user");
                                    const isLoggedIn = !!stored;

                                    if (!isLoggedIn) {
                                        navigate("/login");
                                        return;
                                    }

                                    if (selectedKeys.length === 0) {
                                        setShowError(true);
                                        return;
                                    }

                                    setShowError(false);
                                    navigate("/checkout", {state: {selectedKeys}});
                                }}
                            >
                                Thanh toán
                            </Button>


                            {/* Thông báo lỗi */}
                            {showError && (
                                <p className={styles.errorMessage}>
                                    ⚠ Vui lòng chọn ít nhất 1 sản <br/> phẩm để thanh toán
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
