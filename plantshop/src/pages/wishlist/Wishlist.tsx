import { useEffect, useState } from "react";
import styles from "./Wishlist.module.css";
import type { Product } from "../../types/product.type";
import type { WishlistItem } from "../../types/wishlist.type";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";


const Wishlist = () => {
    // Danh sách wishlist
    const [items, setItems] = useState<WishlistItem[]>([]);
    // Danh sách toàn bộ sản phẩm
    const [products, setProducts] = useState<Product[]>([]);
    // Trạng thái loading
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    // Load wishlist và product khi vào trang
    useEffect(() => {
        Promise.all([
            // Lấy wishlist
            fetch("/plant/wishlist").then(res => res.json()),
            // Lấy danh sách sản phẩm
            fetch("/plant/products").then(res => res.json())
        ])
            .then(([wishlistData, productData]) => {
                setItems(wishlistData.wishlist);
                setProducts(productData);
            })
            .finally(() => setLoading(false));
    }, []);

    // Xóa sản phẩm khỏi wishlist
    const handleRemove = async (productId: number) => {
        await fetch(`/plant/wishlist/${productId}`, { method: "DELETE" });
        setItems(prev => prev.filter(i => i.product_id !== productId));
    };

    // Hiển thị khi đang loading
    if (loading) {
        return <div className={styles.container}>Đang tải...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sản phẩm yêu thích</h1>

            {/* Wishlist trống */}
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

                                    {/* Tên sản phẩm */}
                                    <div className={styles.product}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />
                                        <span>{product.name}</span>
                                    </div>

                                    {/* Giá sản phẩm */}
                                    <div className={styles.price}>
                                        {product.price.toLocaleString()}đ
                                    </div>

                                    {/* Trạng thái tồn kho */}
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

                                    {/* Thêm sản phẩm vào giỏ hàng */}
                                    <button
                                        className={styles.addCart}
                                        disabled={product.stock === 0}
                                        onClick={async () => {
                                            try {
                                                dispatch(addToCart({
                                                    id: Date.now(),
                                                    productId: product.id,
                                                    name: product.name,
                                                    image: product.image,
                                                    price: product.price,
                                                    quantity: 1,
                                                }));

                                                alert("Đã thêm vào giỏ hàng");

                                            } catch {
                                                alert("Sản phẩm đã hết hàng");
                                            }
                                        }}
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
