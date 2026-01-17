import styles from "./Wishlist.module.css";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../store";
import {removeFromWishlist} from "../../store/wishlistSlice";
import {addToCart} from "../../store/cartSlice";
import type {PotVariant, Product} from "../../types/product.type";
import {useNavigate} from "react-router-dom";

type ProductWithVariants = Product & { variants?: PotVariant[] };

const hasVariants = (p: Product): p is ProductWithVariants =>
    "variants" in p && Array.isArray((p as ProductWithVariants).variants);

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wishlistItems = useSelector(
        (state: RootState) => state.wishlist.items
    );

    const products = useSelector(
        (state: RootState) => state.product.items
    );

    const handleAddToCart = (product: Product, variant?: PotVariant) => {
        if (hasVariants(product) && !variant) {
            navigate(`/products/${product.slug}`);
            return;
        }

        dispatch(
            addToCart({
                productId: product.id,
                quantity: 1,
                variant: variant
                    ? {
                        id: variant.id,
                        name: `${variant.color} ${variant.size}`,
                        price: variant.price,
                        image: variant.image,
                    }
                    : undefined,
            })
        );
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sản phẩm yêu thích</h1>

            {wishlistItems.length === 0 ? (
                <p className={styles.empty}>Danh sách yêu thích trống</p>
            ) : (
                <div className={styles.tableWrapper}>
                    <div className={styles.table}>
                        {wishlistItems.map(item => {
                            const product = products.find(p => p.id === item.product_id);
                            if (!product) return null;

                            const variant = hasVariants(product)
                                ? product.variants?.find(v => v.id === item.variant_id)
                                : undefined;

                            return (
                                <div
                                    key={`${item.product_id}-${item.variant_id ?? "base"}`}
                                    className={styles.row}
                                >
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() =>
                                            dispatch(
                                                removeFromWishlist({
                                                    productId: item.product_id,
                                                    variantId: item.variant_id,
                                                })
                                            )
                                        }
                                    >
                                        ✕
                                    </button>

                                    <div className={styles.product}>
                                        <img src={variant?.image ?? product.image}/>
                                        <span>{product.name} {variant && ` (${variant.color} - ${variant.size})`}</span>

                                    </div>

                                    <div className={styles.price}>
                                        {(variant?.price ?? product.price).toLocaleString()}đ
                                    </div>

                                    <button
                                        className={styles.addCart}
                                        onClick={() => handleAddToCart(product, variant)}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>

                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
