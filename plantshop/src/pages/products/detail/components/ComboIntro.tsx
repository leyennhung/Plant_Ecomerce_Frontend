import styles from "../ProductDetail.module.css";
import { useNavigate } from "react-router-dom";

interface ComboItem {
    name: string;
    slug: string;
    quantity: number;
    image?: string;
}
interface Props {
    items?: ComboItem[];
}

const ComboIntro = ({ items }: Props) => {
    const navigate = useNavigate();
    if (!items || items.length === 0) return null;

    return (
        <div className={styles.comboIntro}>
            <h3 className={styles.productTitle1}>
                Sản phẩm trong combo
            </h3>

            <div className={styles.comboList}>
                {items.map((item, index) => (
                    <div key={index} className={styles.comboItem}
                         onClick={() => navigate(`/products/${item.slug}`)}
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className={styles.comboImage}
                        />

                        <div className={styles.comboInfo}>
                            <p className={styles.comboName}>
                                {item.name}
                            </p>
                            <p className={styles.comboQty}>
                                Số lượng: x{item.quantity}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComboIntro;
