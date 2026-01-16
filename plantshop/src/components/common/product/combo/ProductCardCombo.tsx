import type {Product} from "../../../../types/product.type.ts";
import {formatPrice} from "../../../../utils/formatPrice.ts";
import styles from "./ProductCardCombo.module.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {CartViewItem} from "../../../../types/cart.type";

type Props = {
    product: Product;
    onAddToCart?: () => void;
};

const ProductCardCombo = ({product, onAddToCart}: Props) => {
    const navigate = useNavigate();
// popup mua ngay
    const [showBuyNow, setShowBuyNow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const salePrice = product.salePrice ?? null;
    const hasSale = typeof salePrice === "number" && salePrice > 0 && salePrice < product.price;
    // Lấy hình ảnh từ 2 item trong combo
    // Logic hình ảnh trong combo
    const hasMainImage = !!product.image;
    const fallbackImages =
        product.comboItems
            ?.map(item => item.image)
            .filter((img): img is string => !!img)
            .slice(0, 2) || [];
    // sp yêu thích
    const [isFavorite, setIsFavorite] = useState(false);
    /* load favorite từ localStorage */

    // lưu sp yêu thích vào local storage
    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault(); //chặn click link sp
        e.stopPropagation();

        setIsFavorite(prev => {
            const next = !prev;

            if (next) {
                localStorage.setItem(`favorite-${product.slug}`, "1");
            } else {
                localStorage.removeItem(`favorite-${product.slug}`);
            }
            return next;
        });
    };
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart?.();
    };
    //  Mua ngay, sang trang thanh toán
    const openBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setQuantity(1);
        setShowBuyNow(true);
    };

    const confirmBuyNow = () => {
        const buyNowItem: CartViewItem = {
            id: Date.now(),
            productId: product.id,
            name: product.name,
            image: product.image,
            price: salePrice ?? product.price,
            original_price: product.price,
            quantity,
        };

        localStorage.setItem("buy_now_order", JSON.stringify([buyNowItem]));
        navigate("/checkout");
    };

    return (
        <>
            <div className={styles.comboCard}>
                <div className={styles.imageWrapper}>
                    {/* ❤️ FAVORITE */}
                    <button className={`${styles.favoriteBtn} 
            ${isFavorite ? styles.active : ""}`} onClick={toggleFavorite}>
                        <i className="fa-solid fa-heart"></i>
                    </button>

                    {/* ADD TO CART */}
                    <button className={styles.cartBtn} onClick={handleAddToCart}>
                        <i className="fa-solid fa-cart-plus"/>
                    </button>
                    {hasMainImage ? (
                        // Có image → dùng image
                        <img
                            src={product.image}
                            alt={product.name}
                            className={styles.singleImage}
                        />
                    ) : fallbackImages.length >= 2 ? (
                        // Không có image → dùng 2 ảnh con
                        <>
                            <img
                                src={fallbackImages[0]}
                                alt={product.comboItems?.[0]?.name || product.name}
                                className={styles.imageLeft}
                            />
                            <img
                                src={fallbackImages[1]}
                                alt={product.comboItems?.[1]?.name || product.name}
                                className={styles.imageRight}
                            />
                            <div className={styles.diagonal}></div>
                        </>
                    ) : (
                        //  Không có gì → ảnh mặc định
                        <img
                            src="/images/placeholder.jpg"
                            alt={product.name}
                            className={styles.singleImage}
                        />
                    )}
                </div>

                <h3 className={styles.name}>{product.name}</h3>

                <p className={styles.price}>
                    {hasSale ? (
                        <>
            <span className={styles.originalPrice}>
              {formatPrice(product.price)}
            </span>
                            <span className={styles.salePrice}>
              {formatPrice(salePrice as number)}
            </span>
                        </>
                    ) : (
                        <span className={styles.onlyPrice}>
            {formatPrice(product.price)}
          </span>
                    )}
                </p>

                <button className={styles.buyBtn} onClick={openBuyNow}>
                    Mua ngay
                </button>
            </div>

            {/* ===== MODAL MUA NGAY ===== */}
            {showBuyNow && (
                <div className={styles.overlay} onClick={() => setShowBuyNow(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3>{product.name}</h3>
                        <p className={styles.modalPrice}>
                            {formatPrice(salePrice ?? product.price)}
                        </p>

                        <div className={styles.qtyRow}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowBuyNow(false)}>
                                Hủy
                            </button>
                            <button className={styles.confirmBtn} onClick={confirmBuyNow}>
                                Xác nhận mua
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCardCombo;