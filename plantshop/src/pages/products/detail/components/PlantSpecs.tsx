import styles from "../ProductDetail.module.css";
import type { PlantDetail } from "../../../../types/product.type";

interface Props {
    detail?: PlantDetail;
}

const PlantSpecs = ({ detail }: Props) => {
    if (!detail) return null;

    return (
        <div className={styles.specTable}>
            <div className={styles.specRow}>
                <span><strong>Tên thường gọi</strong></span>
                <span>{detail.commonName}</span>
            </div>

            <div className={styles.specRow}>
                <span><strong>Tên khoa học</strong></span>
                <span>{detail.scientificName}</span>
            </div>

            <div className={styles.specRow}>
                <span><strong>Độ khó chăm sóc</strong></span>
                <span>{detail.difficulty}</span>
            </div>

            <div className={styles.specRow}>
                <span><strong>Nhu cầu ánh sáng</strong></span>
                <span>{detail.light}</span>
            </div>

            <div className={styles.specRow}>
                <span><strong>Nhu cầu nước</strong></span>
                <span>{detail.water}</span>
            </div>
        </div>
    );
};

export default PlantSpecs;
