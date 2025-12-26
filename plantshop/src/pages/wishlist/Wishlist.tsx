import { useEffect, useState } from "react";
import styles from "./Wishlist.module.css";
import ProductCard from "../../components/common/product/ProductCard";
import type { Product } from "../../types/product.type";

type WishlistItem = {
    id: number;
    user_id: number;
    product_id: number;
    created_at: string;
};

const Wishlist = () => {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetch("/plant/wishlist").then(res => res.json()),
            fetch("/plant/products").then(res => res.json())
        ])
            .then(([wishlistData, productData]) => {
                setItems(wishlistData);
                setProducts(productData);
            })
            .catch(() => setError("Không thể tải danh sách yêu thích"))
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (productId: number) => {
        await fetch(`/plant/wishlist/${productId}`, { method: "DELETE" });
        setItems(prev => prev.filter(item => item.product_id !== productId));
    };

    if (loading) {
        return <div className={styles.container}>Đang tải danh sách yêu thích...</div>;
    }

    if (error) {
        return <div className={styles.container}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>🌱 Sản phẩm yêu thích</h1>

            {items.length === 0 ? (
                <p className={styles.emptyMessage}>
                    Danh sách yêu thích của bạn đang trống.
                </p>
            ) : (
                <div className={styles.list}>
                    {items.map(item => {
                        const product = products.find(
                            p => p.id === item.product_id
                        );

                        if (!product) return null;

                        return (
                            <div key={item.id} className={styles.itemWrapper}>
                                <ProductCard product={product} />

                                <button
                                    className={styles.removeButton}
                                    onClick={() => handleRemove(item.product_id)}
                                >
                                    Xóa khỏi danh sách
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
