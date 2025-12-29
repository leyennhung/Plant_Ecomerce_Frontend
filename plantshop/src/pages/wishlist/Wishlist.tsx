import { useEffect, useState } from "react";
import styles from "./Wishlist.module.css";
import type { Product } from "../../types/product.type";
import type { WishlistItem } from "../../types/wishlist.type";

const Wishlist = () => {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/plant/wishlist").then(res => res.json()),
            fetch("/plant/products").then(res => res.json())
        ])
            .then(([wishlistData, productData]) => {
                setItems(wishlistData.wishlist);
                setProducts(productData);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (productId: number) => {
        await fetch(`/plant/wishlist/${productId}`, { method: "DELETE" });
        setItems(prev => prev.filter(i => i.product_id !== productId));
    };

    if (loading) {
        return <div className={styles.container}>Đang tải...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My wishlist</h1>

            {items.length === 0 ? (
                <p className={styles.empty}>Danh sách yêu thích trống</p>
            ) : (
                <div className={styles.tableWrapper}>
                    <div className={styles.table}>

                        {/* HEADER */}
                        <div className={`${styles.row} ${styles.header}`}>
                            <div className={styles.headerRemove}></div>
                            <div>TÊN SẢN PHẨM</div>
                            <div>GIÁ TIỀN</div>
                            <div>TÌNH TRẠNG HÀNG</div>
                            <div></div>
                        </div>

                        {/* ITEMS */}
                        {items.map(item => {
                            const product = products.find(
                                p => p.id === item.product_id
                            );
                            if (!product) return null;

                            return (
                                <div key={item.id} className={styles.row}>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => handleRemove(item.product_id)}
                                    >
                                        ✕
                                    </button>

                                    <div className={styles.product}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />
                                        <span>{product.name}</span>
                                    </div>

                                    <div className={styles.price}>
                                        {product.price.toLocaleString()}đ
                                    </div>

                                    <div
                                        className={
                                            product.stock > 0
                                                ? styles.inStock
                                                : styles.outOfStock
                                        }
                                    >
                                        {product.stock > 0
                                            ? "Còn hàng"
                                            : "Hết hàng"}
                                    </div>

                                    <button
                                        className={styles.addCart}
                                        disabled={product.stock === 0}
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
