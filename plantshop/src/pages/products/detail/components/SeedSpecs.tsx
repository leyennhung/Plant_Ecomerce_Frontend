import styles from "../ProductDetail.module.css";
import type { SeedDetail } from "../../../../types/product.type";

interface Props {
    detail?: SeedDetail;
}

const SeedSpecs = ({ detail }: Props) => {
    if (!detail) return null;

    return (
        <div className={styles.specTable}>
            <div className={styles.specRow}>
                <span><strong>Tỷ lệ nảy mầm</strong></span>
                <span>{detail.germinationRate}</span>
            </div>

            <div className={styles.specRow}>
                <span><strong>Thời gian thu hoạch</strong></span>
                <span>{detail.harvestTime}</span>
            </div>

            <div className={styles.specRow}>
                <span><strong>Mùa gieo trồng</strong></span>
                <span>{detail.sowingSeason}</span>
            </div>

            <div className={styles.specRow}>
                <span><strong>Nhu cầu nước</strong></span>
                <span>{detail.water}</span>
            </div>

            <div className={styles.specRow}>
                <span><strong>Độ khó</strong></span>
                <span>{detail.difficulty}</span>
            </div>
        </div>
    );
};

export default SeedSpecs;
