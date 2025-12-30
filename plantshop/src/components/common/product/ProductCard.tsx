import type { Product } from "../../../types/product.type.ts";
import { formatPrice } from "../../../utils/formatPrice.ts";
import styles from "./ProductCard.module.css";

type Props = { product: Product };

const ProductCard = ({ product }: Props) => {
    const salePrice = product.salePrice ?? null;
    const hasSale =
        typeof salePrice === "number" && salePrice > 0 && salePrice < product.price;

    return (
        <div className={styles.card}>
            <img src={product.image}
                alt={product.name}
                className={styles.image}/>
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
export default ProductCard;