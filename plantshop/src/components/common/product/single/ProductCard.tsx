import type { ProductDetail } from "../../../../types/productdetail.type.ts";
import { formatPrice } from "../../../../utils/formatPrice.ts";
import styles from "./ProductCard.module.css";
import {Link} from "react-router-dom";

type Props = { product: ProductDetail;
                isNew?: boolean;     //Đánh dấu sp new
                isSale?: boolean;
                isTrending?: boolean;}; // Đánh dấu sp sale

const ProductCard = ({ product, isNew, isSale, isTrending }: Props) => {
    const salePrice = product.salePrice ?? null;
    const hasSale =
        typeof salePrice === "number" && salePrice > 0 && salePrice < product.price;

    return (
        <div className={styles.card}>
            {isNew && <span className={styles.newBadge}>NEW</span>}
            {isSale && hasSale && <span className={styles.saleBadge}>SALE</span>}
            {isTrending && <span className={styles.trendingBadge}>TRENDING</span>}
            <Link to={`/products/${product.slug}`}>
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