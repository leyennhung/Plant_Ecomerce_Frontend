import type {ProductBase} from "../../../../types/product.type.ts";
import { formatPrice } from "../../../../utils/formatPrice.ts";
import styles from "./ProductCard.module.css";
import {Link} from "react-router-dom";
import {useState} from "react";

type Props = { product: ProductBase;
                isNew?: boolean;     //Đánh dấu sp new
                isSale?: boolean;
                isTrending?: boolean;}; // Đánh dấu sp sale

const ProductCard = ({ product, isNew, isSale, isTrending }: Props) => {
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
    return (
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
            <button className={styles.cartBtn}>
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
            <button className={styles.buyBtn}>Mua ngay</button>
        </div>
    );
};
export default ProductCard;