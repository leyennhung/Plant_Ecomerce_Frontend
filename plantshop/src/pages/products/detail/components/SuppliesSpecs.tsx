import styles from "../ProductDetail.module.css";
import type { SuppliesDetail, ProductDimensions } from "../../../../types/product.type";

interface Props {
    detail?: SuppliesDetail;
    dimensions?: ProductDimensions;
}

const SuppliesSpecs = ({ detail }: Props) => {
    if (!detail) return null;

    const specs = [
        { label: "Tên gọi", value: detail.commonName },
        { label: "Xuất xứ", value: detail.origin },
        { label: "Chất liệu / Thành phần", value: detail.material },
        { label: "Công dụng", value: detail.application },
        { label: "Quy cách đóng gói", value: detail.packaging },
        { label: "Thể tích", value: detail.volume },
        // { label: "Khối lượng", value: dimensions?.weight },
        // { label: "Chiều dài", value: dimensions?.totalLength },
    ];

    return (
        <div className={styles.specTable}>
            {specs
                .filter(item => item.value)
                .map((item, index) => (
                    <div key={index} className={styles.specRow}>
                        <span><strong>{item.label}</strong></span>
                        <span>{item.value}</span>
                    </div>
                ))}
        </div>
    );
};

export default SuppliesSpecs;
