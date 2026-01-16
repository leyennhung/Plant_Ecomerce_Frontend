import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Search.module.css";
// import { productService } from "../../services/product.service";
// import type {ProductDetail} from "../../types/product.type.ts";

interface Props {
    open: boolean;
    onClose: () => void;
}

const Search = ({ open, onClose }: Props) => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    //xử lý Enter → chuyển trang kèm query
    const handleSearch = async () => {
        if (!keyword.trim()) return;
        navigate(`/products?search=${encodeURIComponent(keyword)}`); // ⭐
        onClose();
    };

    if (!open) return null;

    return (
        <div className={styles.searchOverlay} onClick={onClose}>
            <div className={styles.searchBox} onClick={(e) => e.stopPropagation()}>
                <input
                    placeholder="Tìm kiếm sản phẩm..."
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
                <button className={styles.btnSearch} onClick={handleSearch}> <i className="fa-solid fa-magnifying-glass"></i></button>
                <button className={styles.closeBtn} onClick={onClose}>✖</button>
            </div>
        </div>
    );
};

export default Search;