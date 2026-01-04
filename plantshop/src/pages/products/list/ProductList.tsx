import { useEffect, useMemo, useState } from "react";
import { productService } from "../../../services/product.service";
import { categoryService } from "../../../services/category.service";
import type { Product } from "../../../types/product.type";
import type { Category } from "../../../types/category.type";
import FilterSidebar from "./components/FilterSidebar";
import ProductCard from "../../../components/common/product/single/ProductCard";
import styles from "./ProductList.module.css";
import banner from "../../../assets/images/banner_shop.png"

const MAX_PRICE = 1_000_000;
const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
    const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number>>({});
    const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);

    // load data
    useEffect(() => {
        productService.getAll().then(setProducts);
        categoryService.getAll().then(setCategories);
    }, []);

    // đổi category → reset attribute
    const handleCategoryChange = (id: number) => {
        setSelectedCategoryId(id);
        setSelectedAttributes({});
    };

    // attribute
    const handleAttributeChange = (groupId: number, attrId: number) => {
        setSelectedAttributes(prev => {
            const next = { ...prev };
            if (attrId === 0) {
                delete next[groupId];
            } else {
                next[groupId] = attrId;
            }
            return next;
        });
    };
    // filter sp
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // category
            if (selectedCategoryId && product.categoryId !== selectedCategoryId) {
                return false;
            }

            // attributes
            const selectedAttrIds = Object.values(selectedAttributes);
            if (selectedAttrIds.length > 0 &&
                !selectedAttrIds.every(attrId =>
                    product.attributeIds.includes(attrId))) {
                return false;
            }
            // price
            const price = product.salePrice ?? product.price;
            if (
                price < priceRange[0] ||
                price > priceRange[1]
            ) {
                return false;
            }

            return true;
        });
    }, [products, selectedCategoryId, selectedAttributes, priceRange]);

    return (
        <div className={styles.container}>
            {/*1.BANNER*/}
            <div className={styles.banner}>
                <img src={banner} alt={banner} className={styles.imgbanner}/>
            </div>
        <div className={styles.wrapper}>
            {/*2. left: slidebar*/}
            <FilterSidebar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                selectedAttributes={selectedAttributes}
                onCategoryChange={handleCategoryChange}
                onAttributeChange={handleAttributeChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
            />
            {/*3. right: ds products*/}
            <div className={styles.content}>
                {filteredProducts.length === 0 ? (
                    <p className={styles.empty}>Không tìm thấy sản phẩm phù hợp</p>
                ) : (
                <div className={styles.grid}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default ProductList;
