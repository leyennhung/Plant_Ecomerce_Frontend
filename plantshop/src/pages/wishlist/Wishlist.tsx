import styles from "./Wishlist.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { removeFromWishlist } from "../../store/wishlistSlice";
import { addToCart } from "../../store/cartSlice";

const Wishlist = () => {
    const dispatch = useDispatch();

    const wishlistItems = useSelector(
        (state: RootState) => state.wishlist.items
    );

    const products = useSelector(
        (state: RootState) => state.product.items
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sản phẩm yêu thích</h1>

            {wishlistItems.length === 0 ? (
                <p className={styles.empty}>Danh sách yêu thích trống</p>
            ) : (
                <div className={styles.tableWrapper}>
                    <div className={styles.table}>
                        {wishlistItems.map(item => {
                            const product = products.find(
                                p => p.id === item.product_id
                            );
                            if (!product) return null;

                            return (
                                <div key={item.id} className={styles.row}>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() =>
                                            dispatch(removeFromWishlist(product.id))
                                        }
                                    >
                                        ✕
                                    </button>

                                    <div className={styles.product}>
                                        <img src={product.image} />
                                        <span>{product.name}</span>
                                    </div>

                                    <div className={styles.price}>
                                        {product.price.toLocaleString()}đ
                                    </div>

                                    <button
                                        className={styles.addCart}
                                        onClick={() =>
                                            dispatch(addToCart({
                                                id: Date.now(),
                                                productId: product.id,
                                                name: product.name,
                                                image: product.image,
                                                price: product.price,
                                                quantity: 1,
                                            }))
                                        }
                                    >
                                        Thêm vào giỏ
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
