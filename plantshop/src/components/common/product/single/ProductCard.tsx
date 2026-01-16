import type {ProductBase} from "../../../../types/product.type.ts";
import {formatPrice} from "../../../../utils/formatPrice.ts";
import styles from "./ProductCard.module.css";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import type {CartViewItem} from "../../../../types/cart.type";

type Props = {
    product: ProductBase;
    isNew?: boolean;     //Đánh dấu sp new
    isSale?: boolean;
    isTrending?: boolean;
    onAddToCart?: () => void;
}; // Đánh dấu sp sale

const ProductCard = ({product, isNew, isSale, isTrending, onAddToCart}: Props) => {
    const navigate = useNavigate();
    // popup mua ngay
    const [showBuyNow, setShowBuyNow] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const salePrice = product.salePrice ?? null;
    const hasSale =
        typeof salePrice === "number" && salePrice > 0 && salePrice < product.price;

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

    // Mua ngay, sang trang thanh toán
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
            <div className={styles.card}>
                {isNew && <span className={styles.newBadge}>NEW</span>}
                {isSale && hasSale && <span className={styles.saleBadge}>SALE</span>}
                {isTrending && <span className={styles.trendingBadge}>TRENDING</span>}
                {/* ❤️ FAVORITE */}
                <button className={`${styles.favoriteBtn} 
            ${isFavorite ? styles.active : ""}`} onClick={toggleFavorite}>
                    <i className="fa-solid fa-heart"></i>
                </button>

                {/* ADD TO CART */}
                <button className={styles.cartBtn} onClick={handleAddToCart}>
                    <i className="fa-solid fa-cart-plus"></i>
                </button>
                <Link to={`/products/${product.slug}`} className={styles.productLink}>
                    <img src={product.image}
                         alt={product.name}
                         className={styles.image}/>
                    <h3 className={styles.name}>{product.name}</h3>
                </Link>
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
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowBuyNow(false)}
                            >
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
export default ProductCard;