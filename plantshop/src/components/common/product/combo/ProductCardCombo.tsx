import type {Product} from "../../../../types/product.type.ts";
import {formatPrice} from "../../../../utils/formatPrice.ts";
import styles from "./ProductCardCombo.module.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../store";
import type {CartViewItem} from "../../../../types/cart.type";
import {addToWishlist, removeFromWishlist,} from "../../../../store/wishlistSlice";
import {getFinalPrice} from "../../../../utils/getFinalPrice";
import {useMemo} from "react";

type Props = {
    product: Product;
    onAddToCart?: () => void;
};

const ProductCardCombo = ({product, onAddToCart}: Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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

    // lấy sp yêu thích từ redux store
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    // kiểm tra sp hiện tại có trong wishlist chưa
    const isFavorite = wishlistItems.some(
        item => item.product_id === product.id && item.variant_id == null
    );

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();//không cho click này kích hoạt navigate của card

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
                    product_id: product.id,//id product combo
                    variant_id: undefined,// combo không có variant(khong có chọn màu, kích thước)
                    name: product.name,
                    image: product.image,
                    price: product.salePrice ?? product.price,
                    created_at: new Date().toISOString(),
                })
            );
        }
    };

    /* PRICE */
    const priceInfo = useMemo(() => {
        return getFinalPrice(
            {
                id: product.id,
                slug: product.slug ?? "",
                name: product.name,
                type: "combo",
                price: product.price,
                salePrice: product.salePrice,
                stock: 0,
                status: "active",
                image: product.image,
                images: undefined,
                wholesalePrices: undefined,// combo không dùng wholesale
            },
            quantity
        );
    }, [product, quantity]);
//thêm vào giỏ hàng
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart?.();
    };
    //  Mua ngay, sang trang thanh toán
    const openBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();//không navigate card
        setQuantity(1);
        setShowBuyNow(true);
    };
//buy now, lưu vào localstorage chuyển sang checkout không thêm vào cart
    const confirmBuyNow = () => {
        const buyNowItem: CartViewItem = {
            id: Date.now(),
            productId: product.id,//id combo
            name: product.name,
            image: product.image,
            price: priceInfo.price,//giá combo đã tính
            original_price: product.price,
            quantity,
            isWholesale: priceInfo.isWholesale,
            wholesaleMin: priceInfo.wholesaleMin,
        };

        localStorage.setItem("buy_now_order", JSON.stringify([buyNowItem]));
        navigate("/checkout");
    };

    return (
        <>
            <div className={styles.comboCard} onClick={() => navigate(`/products/${product.slug}`)}>
                <div className={styles.imageWrapper}>
                    {/*FAVORITE */}
                    <button className={`${styles.favoriteBtn} 
            ${isFavorite ? styles.active : ""}`} onClick={toggleFavorite}>
                        <i className="fa-solid fa-heart"></i>
                    </button>

                    {/* ADD TO CART */}
                    <button className={styles.cartBtn} onClick={handleAddToCart}>
                        <i className="fa-solid fa-cart-plus"/>
                    </button>
                    {hasMainImage ? (
                        // Có image -> dùng image
                        <img
                            src={product.image}
                            alt={product.name}
                            className={styles.singleImage}
                        />
                    ) : fallbackImages.length >= 2 ? (
                        // Không có image -> dùng 2 ảnh con
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

            {/* MODAL MUA NGAY */}
            {showBuyNow && (
                <div className={styles.overlay} onClick={() => setShowBuyNow(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3>{product.name}</h3>
                        <p className={styles.modalPrice}>
                            {formatPrice(priceInfo.price)}
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