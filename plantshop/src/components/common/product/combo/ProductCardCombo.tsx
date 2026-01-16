import type { Product } from "../../../../types/product.type.ts";
import { formatPrice } from "../../../../utils/formatPrice.ts";
import styles from "./ProductCardCombo.module.css";
import {useState} from "react";

type Props = { product: Product; };

const ProductCardCombo = ({ product }: Props) => {
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
    return (
        <div className={styles.comboCard}>
            <div className={styles.imageWrapper}>
                {/* ❤️ FAVORITE */}
                <button className={`${styles.favoriteBtn} 
            ${isFavorite ? styles.active : ""}`} onClick={toggleFavorite}>
                    <i className="fa-solid fa-heart"></i>
                </button>

                {/* ADD TO CART */}
                <button className={styles.cartBtn}>
                    <i className="fa-solid fa-cart-plus"></i>
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

            <button className={styles.buyBtn}>Mua ngay</button>
        </div>
    );
};

export default ProductCardCombo;