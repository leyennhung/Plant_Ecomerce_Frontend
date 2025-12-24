import type {Product} from "../../../types/product.type.ts";
import {formatPrice} from "../../../utils/formatPrice.ts";
import styles from "./ProductCard.module.css";

type Props = { product: Product; };

const ProductCard = ({ product }: Props) => {
    return (
        <div className={styles.card}>
            <img src={product.image}
                alt={product.name}
                className={styles.image}/>

            <h3 className={styles.name}>{product.name}</h3>

            <p className={styles.price}>
                {formatPrice(product.price)}
            </p>

            <button className={styles.buyBtn}>Mua ngay</button>
        </div>
    );
};
export default ProductCard;