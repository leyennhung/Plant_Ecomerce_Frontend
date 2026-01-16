import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import {productService} from "../../../services/product.service";
import {categoryService} from "../../../services/category.service";
import type {Product, ProductType} from "../../../types/product.type";
import type {Category} from "../../../types/category.type";
import FilterSidebar from "./components/FilterSidebar";
import ProductCard from "../../../components/common/product/single/ProductCard";
import ProductCardCombo from "../../../components/common/product/combo/ProductCardCombo";
import styles from "./ProductList.module.css";
import banner from "../../../assets/images/banner_shop.png";
import {useDispatch} from "react-redux";
import {addToCart} from "../../../store/cartSlice";


const MAX_PRICE = 3_000_000;
const PAGE_SIZE = 12;

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const dispatch = useDispatch();

    // Attribute filter (1 group chỉ chọn 1 attribute)
    const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number>>({});
    // Filter theo mức price
    const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
    // const [selectedType, setSelectedType] = useState<ProductType | "bulk">();

    // page
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const contentRef = useRef<HTMLDivElement>(null);

    // navigate
    const navigate = useNavigate();

    // URL params
    const {slug: categorySlug} = useParams<{ slug?: string }>();
    const [searchParams] = useSearchParams();

    // search keyword (?search=abc)
    const keyword = searchParams.get("search") || "";

    // attribute id từ URL (?attrId=3)
    const attrIdParam = searchParams.get("attrId");
    const attrId = attrIdParam ? Number(attrIdParam) : null;

    // type từ Home  (?type=single | combo | bulk)
    const type = searchParams.get("type");

    // selectedType là derived state
    const selectedType = type as ProductType | "bulk" | undefined;

    // load data theo URL
    useEffect(() => {
        if (categorySlug) {  //catelogy
            productService.getByCategorySlug(categorySlug).then(setProducts);
        } else if (keyword) { //search
            productService
                .getSearchProducts(keyword)
                .then(setProducts);
        } else {
            productService.getAll().then(setProducts); // all
        }

        categoryService.getAll().then(setCategories);
    }, [categorySlug, keyword]);

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart({productId: product.id, quantity: 1}));
    };

    // Lấy all sp
    const handleViewAll = () => {
        setSelectedAttributes({});
        setPriceRange([0, MAX_PRICE]);
        setCurrentPage(1);

        navigate({
            pathname: "/products",
            search: ""
        });
        scrollToTop();

    };

    // Về đầu trang
    const scrollToTop = () => {
        contentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };
    useEffect(() => {
        scrollToTop();
    }, [currentPage]);
    // về đầu trang cho button



    // chọn attribute (1 group = 1 value)
    const handleAttributeChange = (groupId: number, attrId: number) => {
       setCurrentPage(1);
        setSelectedAttributes(prev => {
            const next = {...prev};
            if (attrId === 0) {
                delete next[groupId];
            } else {
                next[groupId] = attrId;
            }
            return next;
        });
    };

    // filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            //attributeId từ url
            if (attrId) {
                const attrIds =
                    product.attributes?.map((a) => a.id) ?? [];
                if (!attrIds.includes(attrId)) {
                    return false;
                }
            }
            // price
            const price = product.salePrice ?? product.price;
            if (price < priceRange[0] || price > priceRange[1]) {
                return false;
            }

            // type
            if (selectedType) {
                if (selectedType === "bulk") {
                    if (!product.hasBulkPrice) return false;
                } else {
                    if (product.type !== selectedType) return false;
                }
            }

            // attribute
            const selectedAttrIds = Object.values(selectedAttributes);
            if (selectedAttrIds.length > 0) {
                const productAttrIds =
                    product.attributes?.map((a) => a.id) ?? [];
                if (!selectedAttrIds.every(id => productAttrIds.includes(id))) {
                    return false;
                }
            }

            return true;
        });
    }, [products, attrId, selectedAttributes, priceRange, selectedType]);

    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredProducts.slice(start, start + PAGE_SIZE);
    }, [filteredProducts, currentPage]);

    return (
        <div
            key={location.pathname + location.search}
            className={styles.container}>
            {/*Banner*/}
            <div className={styles.banner} ref={contentRef}>
                <img src={banner} className={styles.imgbanner} />
            </div>
            {/*sidebar*/}
            <div className={styles.wrapper}>
                <FilterSidebar
                    categories={categories}
                    selectedAttributes={selectedAttributes}
                    onAttributeChange={handleAttributeChange}
                    priceRange={priceRange}
                    onPriceChange={setPriceRange}
                    selectedType={selectedType}
                    onTypeChange={() => {
                    }}
                />
                {/*Danh sách sản phẩm*/}
                <div className={styles.content} >
                    <div className={styles.titleRow}>
                        <h2 className={styles.productListTitle}>
                            {keyword ? (
                                <>
                                    Kết quả tìm kiếm: <b>{keyword}</b>
                                </>
                            ) : (
                                "Danh sách sản phẩm"
                            )}
                        </h2>
                        {/*{(keyword || Object.keys(selectedAttributes).length > 0) && (*/}
                        <span className={styles.viewAll} onClick={handleViewAll}>Tất cả</span>
                            {/*)}*/}
                        </div>
                    <div className={styles.grid}>
                        {paginatedProducts.map(p =>
                            p.type === "combo" ? (
                                <ProductCardCombo key={p.id} product={p}onAddToCart={() => handleAddToCart(p)}/>
                            ) : (
                                <ProductCard key={p.id} product={p}onAddToCart={() => handleAddToCart(p)}/>
                            )
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            {Array.from({length: totalPages}).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={
                                        currentPage === i + 1
                                            ? styles.active
                                            : ""
                                    }
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
