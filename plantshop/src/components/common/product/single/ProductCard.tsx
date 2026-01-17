import type {ProductBase} from "../../../../types/product.type.ts";
import {formatPrice} from "../../../../utils/formatPrice.ts";
import styles from "./ProductCard.module.css";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useState, useMemo} from "react";
import type {RootState} from "../../../../store";
import type {CartViewItem} from "../../../../types/cart.type";
import {addToWishlist, removeFromWishlist,} from "../../../../store/wishlistSlice";
import {getFinalPrice} from "../../../../utils/getFinalPrice";
import type {ProductApi} from "../../../../types/product-api.type";
import {addToCart} from "../../../../store/cartSlice";

type Props = {
    product: ProductBase;
    isNew?: boolean;     //Đánh dấu sp new
    isSale?: boolean;
    isTrending?: boolean;
}; // Đánh dấu sp sale

const ProductCard = ({product, isNew, isSale, isTrending}: Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // popup mua ngay
    const [showBuyNow, setShowBuyNow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const basePrice = product.salePrice ?? product.price;
    const salePrice = product.salePrice ?? null;
    const hasSale =
        typeof salePrice === "number" && salePrice > 0 && salePrice < product.price;

    // sp yêu thích
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isFavorite = wishlistItems.some(
        item => item.product_id === product.id && item.variant_id == null
    );

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Nếu là pot, bắt chọn variant
        if (product.type === "pot") {
            navigate(`/products/${product.slug}`);
            return;
        }

        if (isFavorite) {
            dispatch(
                removeFromWishlist({
                    productId: product.id,
                    variantId: undefined,
                })
            );
        } else {
            dispatch(
                addToWishlist({
                    id: Date.now(),
                    user_id: 0,
                    product_id: product.id,
                    variant_id: undefined,
                    name: product.name,
                    image: product.image,
                    price: product.salePrice ?? product.price,
                    created_at: new Date().toISOString(),
                })
            );
        }
    };

    /* ===== GIÁ THEO SỐ LƯỢNG ===== */
    const priceInfo = useMemo(() => {
        return getFinalPrice(product as ProductApi, quantity);
    }, [product, quantity]);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.type === "pot") {
            navigate(`/products/${product.slug}`);
            return;
        }

        dispatch(addToCart({productId: product.id, quantity: 1}));
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
            price: priceInfo.price,
            original_price: basePrice,
            quantity,
            isWholesale: priceInfo.isWholesale,
            wholesaleMin: priceInfo.wholesaleMin,
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
                    {priceInfo.isWholesale ? (
                        <>
      <span className={styles.originalPrice}>
        {formatPrice(product.price)}
      </span>
                            <span className={styles.salePrice}>
        {formatPrice(priceInfo.price)}
      </span>
                            <span className={styles.wholesaleBadge}>Giá sỉ</span>
                        </>
                    ) : (
                        <span className={styles.onlyPrice}>
      {formatPrice(priceInfo.price)}
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

                        {/* ===== GIÁ ĐỘNG THEO SỐ LƯỢNG ===== */}
                        <p className={styles.modalPrice}>
                            {priceInfo.isWholesale ? (
                                <>
                        <span className={styles.oldPrice}>
                            {formatPrice(basePrice)}
                        </span>
                                    <span className={styles.newPrice}>
                            {formatPrice(priceInfo.price)}
                        </span>
                                    <span className={styles.wholesaleBadge}>Giá sỉ</span>
                                </>
                            ) : (
                                <>
                    <span className={styles.newPrice}>
                        {formatPrice(priceInfo.price)}
                    </span>
                                    {priceInfo.wholesaleMin && (
                                        <span className={styles.wholesaleHint}>
                            Mua ≥ {priceInfo.wholesaleMin} để được giá sỉ
                        </span>)}
                                </>
                            )}
                        </p>

                        {/* ===== SỐ LƯỢNG ===== */}
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