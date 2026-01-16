import styles from "../ProductDetail.module.css";
import type { PotDetail, PotVariant } from "../../../../types/product.type";

interface Props {
    detail?: PotDetail;
    variants?: PotVariant[];
}

const PotSpecs = ({ detail, variants }: Props) => {
    if (!detail && (!variants || variants.length === 0)) return null;

    // Gom dữ liệu từ variants (lọc trùng)
    const colors = Array.from(new Set(variants?.map(v => v.color)));
    const sizes = Array.from(new Set(variants?.map(v => v.size)));
    const volumes = Array.from(new Set(variants?.map(v => v.volume)));

    return (
        <div className={styles.specTable}>
            {/* CHẤT LIỆU */}
            {detail?.material && (
                <div className={styles.specRow}>
                    <span><strong>Chất liệu</strong></span>
                    <span>{detail.material}</span>
                </div>
            )}

            {/* HỌA TIẾT */}
            {detail?.pattern && (
                <div className={styles.specRow}>
                    <span><strong>Họa tiết</strong></span>
                    <span>{detail.pattern}</span>
                </div>
            )}

            {/* MÀU SẮC */}
            {colors.length > 0 && (
                <div className={styles.specRow}>
                    <span><strong>Màu sắc</strong></span>
                    <span>{colors.join(", ")}</span>
                </div>
            )}

            {/* KÍCH THƯỚC */}
            {sizes.length > 0 && (
                <div className={styles.specRow}>
                    <span><strong>Kích thước</strong></span>
                    <span>{sizes.join(", ")}</span>
                </div>
            )}

            {/* DUNG TÍCH */}
            {volumes.length > 0 && (
                <div className={styles.specRow}>
                    <span><strong>Dung tích</strong></span>
                    <span>{volumes.join(", ")}</span>
                </div>
            )}
        </div>
    );
};

export default PotSpecs;
