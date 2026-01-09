import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { productService } from "../../../services/product.service";
import type { ProductDetail, ProductImage } from "../../../types/product.type";
import styles from "./ProductDetail.module.css";
import { formatPrice } from "../../../utils/formatPrice";
import ReactMarkdown from "react-markdown";
import ProductCard from "../../../components/common/product/single/ProductCard.tsx";
import { reviewService } from "../../../services/review.service";
import type { Review } from "../../../types/review.type";

const Productdetail = () => {
    // const { id } = useParams<{ id: string }>();
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [mainImage, setMainImage] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<ProductDetail[]>([]);
    const [suggestSupplies, setSuggestSupplies] = useState<ProductDetail[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    //const [loadingReview, setLoadingReview] = useState(false);

    useEffect(() => {
            if (!slug) return;
                productService.getProductDetailSlug(slug).then(p => {
                    setProduct(p);
                    setMainImage(p.images?.[0].url ?? "");

                    // load favorite from localStorage
                    const fav = localStorage.getItem(`favorite-${slug}`);
                    setIsFavorite(!!fav);
                });
                productService.getRelatedProducts(slug).then(setRelatedProducts);
                productService.getSuggestSupplies(slug).then(setSuggestSupplies);
        }, [slug]);
    // Phần review ( chỉ load khi ở tab)
    useEffect(() => {
        if (activeAccordion !== 3 || !product?.id) return;
        // setLoadingReview(true);

        reviewService
            .getReviewByProduct(product.id)
            .then(setReviews)
            .catch(() => setReviews([]));
            // .finally(() => setLoadingReview(false))
        ;
    }, [activeAccordion, product?.id]);


    const changeMainImage = (img: ProductImage) => {
        setMainImage(img.url);
    };

    const toggleAccordion = (index: number) => {
        setActiveAccordion(prev => (prev === index ? null : index));
    };
    // Lưu sp yêu thích vào local storage
    const toggleFavorite = () => {
        setIsFavorite(prev => {
            const next = !prev;

            if (next) {
                localStorage.setItem(`favorite-${slug}`, "1");
            } else {
                localStorage.removeItem(`favorite-${slug}`);
            }

            return next;
        });
    };
    if (!product) return <div>Loading...</div>;

    const salePrice = product.salePrice ?? null;
    const hasSale = typeof salePrice === "number" && salePrice > 0 && salePrice < product.price;

    const categoryTags = [
        product.category?.name,
        ...(product.attributes?.map(attr => attr.name) ?? [])
    ].filter(Boolean);

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                {/* Gallery */}
                <div className={styles.gallery}>
                    <img className={styles.mainImage} src={mainImage} alt={product.name}/>
                    <div className={styles.thumbnailList}>
                        {product.images?.map(img => (
                            <img
                                key={img.id}
                                src={img.url}
                                className={img.url === mainImage ? "active" : ""}
                                onClick={() => changeMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="product-tabs">
                    <div className={styles.info}>
                        <h1 className={styles.title}>{product.name}</h1>
                        <div className={styles.titleLine}></div>
                        <div className={styles.price}>
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
                        </div>

                        <div className={styles.description}>
                        <p className={styles.desc}>{product.description}</p>
                        </div>
                        {/*<div className={styles.category}>*/}
                        {/*    <p><strong>Danh mục: </strong>{product.category.name}</p>*/}
                        {/*</div>*/}
                            <p>
                                <strong>Danh mục: </strong>
                                {categoryTags.join(", ")}
                            </p>
                        <div className={styles.buyRow}>
                            <div className={styles.quantityBox}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <input type="text" readOnly value={quantity}/>
                                <button onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                            <button className={styles.btnCart}>THÊM GIỎ HÀNG</button>
                            <i
                                onClick={toggleFavorite}
                                className={`fa-solid fa-heart ${styles.heartIcon} ${
                                    isFavorite ? styles.active : ""
                                }`}
                            />

                        </div>
                    </div>
                </div>
            </div>
            {/* TAB GIỚI THIỆU */}
            <div className={styles.productTabs}>
                <div className={styles.tabContent}>
                    <div className={styles.titleTab}>
                        <h3 className={styles.productTitle}>Giới thiệu</h3>
                    </div>

                    <div className={styles.productSpecs}>
                        {/* BẢNG 1 – THÔNG TIN CÂY */}
                        <div className={styles.specTable}>
                            <div className={styles.specRow}>
                                <span><strong>Tên thường gọi</strong></span>
                                <span>{product.plantDetail?.commonName}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Tên Khoa học</strong></span>
                                <span>{product.plantDetail?.scientificName}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Độ khó chăm sóc</strong></span>
                                <span>{product.plantDetail?.difficulty}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Nhu cầu ánh sáng</strong></span>
                                <span>{product.plantDetail?.light}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Nhu cầu nước</strong></span>
                                <span>{product.plantDetail?.water}</span>
                            </div>
                        </div>

                        {/* BẢNG 2 – QUY CÁCH */}
                        <div className={styles.specTable}>
                            <div className={styles.specRow}>
                                <span><strong>Trọng lượng</strong></span>
                                <span>{product.dimensions?.weight}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span><strong>Chiều cao</strong></span>
                                <span>{product.dimensions?.totalHeight}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Độ rộng tán cây</strong></span>
                                <span>{product.dimensions?.canopyWidth}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span><strong>Đường kính chậu</strong></span>
                                <span>{product.dimensions?.potWidth}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Chiều cao chậu</strong></span>
                                <span>{product.dimensions?.potHeight}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* TAB BẢNG GIAS SĨ */}
            <div className={styles.priceTabs}>
                {product.wholesalePrices && product.wholesalePrices.length > 0 && (
                    <div className={styles.priceTabs}>
                        <div className={styles.tabContentPrice}>
                            <div className={styles.titleTab}>
                                <h3 className={styles.productTitle}>Ưu đãi giá sỉ</h3>
                            </div>

                            <div className={styles.productSpecs}>
                                <div className={styles.specTablePrice}>
                                    {product.wholesalePrices.map((item, index) => (
                                        <div className={styles.specRow} key={index}>
                            <span>
                                {item.max
                                    ? `Từ ${item.min} – ${item.max} sản phẩm`
                                    : `Từ hơn ${item.min} sản phẩm`}
                            </span>
                                            <span>{formatPrice(item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/*TAB*/}
            <div className={styles.productAccordion}>
            {/*    MÔ TẢ*/}
            <div className={`${styles.accordionItem} ${
                    activeAccordion === 0 ? styles.active : ""}`}>
                <button className={styles.accordionHeader}
                    onClick={() => toggleAccordion(0)}>
                    <span className={styles.accordionTitle}>Mô tả</span>
                    <span className={styles.accordionIcon}></span>
                </button>

                <div className={styles.accordionContent}>
                    <div className={styles.accordionInner}>
                        <div className={styles.markdown}>
                            <ReactMarkdown
                                components={{
                                    img: ({ ...props }) => (
                                        <img{...props}
                                            className={styles.markdownImage}/>),
                                    p: ({ children }) => (
                                        <p className={styles.markdownParagraph}>{children}</p>),}}>
                                {product.infor?.content ?? ""}
                            </ReactMarkdown>
                </div>
                    </div>
                </div>
            </div>

            {/* ĐẶC ĐIỂM */}
            <div className={`${styles.accordionItem} ${
                    activeAccordion === 1 ? styles.active : ""}`}>
                <button className={styles.accordionHeader}
                    onClick={() => toggleAccordion(1)}>
                    <span className={styles.accordionTitle}>Đặc điểm</span>
                    <span className={styles.accordionIcon}></span>
                </button>

                <div className={styles.accordionContent}>
                    <div className={styles.accordionInner}>
                        <div className={styles.markdown}>
                            <ReactMarkdown
                                components={{
                                    img: ({ ...props }) => (
                                        <img{...props}
                                            className={styles.markdownImage}/>),
                                    p: ({ children }) => (
                                        <p className={styles.markdownParagraph}>{children}</p>),}}>
                                {product.infor?.features ?? ""}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHĂM SÓC */}
            <div className={`${styles.accordionItem} ${
                    activeAccordion === 2 ? styles.active : ""}`}>
                <button className={styles.accordionHeader}
                    onClick={() => toggleAccordion(2)}>
                <span className={styles.accordionTitle}>Chăm sóc / Trồng cây</span>
                    <span className={styles.accordionIcon}></span>
                </button>
                <div className={styles.accordionContent}>
                    <div className={styles.accordionInner}>
                        <div className={styles.markdown}>
                            <ReactMarkdown
                                components={{
                                    img: ({ ...props }) => (
                                        <img{...props}
                                            className={styles.markdownImage}/>),
                                    p: ({ children }) => (
                                        <p className={styles.markdownParagraph}>{children}</p>),}}>
                                {product.infor?.careGuide ?? ""}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
                {/* BÌNH LUẬN ĐÁNH GIÁ */}
                <div className={`${styles.accordionItem} ${
                        activeAccordion === 3 ? styles.active : ""
                    }`}>
                    <button className={styles.accordionHeader}
                        onClick={() => toggleAccordion(3)}>
                        <span className={styles.accordionTitle}>Bình luận & đánh giá</span>
                        <span className={styles.accordionIcon}></span>
                    </button>

                    <div className={styles.accordionContent}>
                        <div className={styles.accordionInner}>
                            <div className={styles.commentList}>
                                {/*{loadingReview && <p>Đang tải các đánh giá về sản phẩm...</p>}*/}
                                {/*{!loadingReview && reviews.length === 0 && (*/}
                                {/*    <p>Chưa có đánh giá nào cho sản phẩm này</p>*/}
                                {/*)}*/}
                                    {/*ITEM*/}
                            {reviews.length === 0 && (
                                <p>Chưa có đánh giá nào cho sản phẩm này</p>)}
                                    {reviews.map(review => (
                                <div className={styles.commentItem} key={review.id}>
                                    <img
                                        className={styles.avatar}
                                        src={review.user?.avatar || "https://heucollege.edu.vn/upload/2025/02/avatar-trang-nu-001.webp"}
                                        alt={review.user?.name}
                                    />

                                    <div className={styles.commentBody}>
                                        <div className={styles.commentHeader}>
                                            <strong>{review.user?.name}</strong>
                                            <span className={styles.rating}>
                                                {"★".repeat(review.rating)}
                                                {"☆".repeat(5 - review.rating)}
                                            </span>
                                        </div>
                                        <p>{review.content}</p>
                                    </div>
                                </div>
                                ))}
                        </div>
                    </div>
                </div>
                </div>
            </div>
        {/*    DANH SÁCH SẢN PHẨM*/}
            <div className={styles.relatedproduct}>
                {relatedProducts.length > 0 && (
                <div className={styles.relatedSection}>
                    <h3 className={styles.title}>🌳 Gợi ý cho không gian của bạn</h3>
                    <div className={styles.divider}></div>
                    <div className={styles.productList}>
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
                    )}
            </div>
        {/*    GỢI Ý VẬT TƯ ĐI KÈM*/}
            <div className={styles.relatedproduct}>
                {suggestSupplies.length > 0 && (
                    <div className={styles.relatedSection}>
                        <h3 className={styles.title}>Gợi ý vật tư thêm cho sản phẩm </h3>
                        <div className={styles.divider}></div>
                        <div className={styles.productList}>
                            {suggestSupplies.map(s => (
                                <ProductCard  key={s.id} product={s} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* CHÍNH SÁCH ĐỔI TRẢ */}
            <div className={styles.policySection}>
                <div className={styles.policyHeader}>
                    <span className={styles.line}></span>
                    <h2>CHÍNH SÁCH ĐỔI TRẢ</h2>
                    <span className={styles.line}></span>
                </div>

                <p className={styles.policyIntro}>
                    <strong>Plant A Plant </strong> Garden muốn mang đến trải nghiệm mua sắm tuyệt vời nhất tới khách hàng của mình.
                    Chính vì vậy mà tất cả các sản phẩm được mua  tại <strong>Plant A Plant </strong> đều sẽ được đảm bảo chất lượng trước khi tới tay khách hàng. Hy vọng rằng bạn sẽ không chỉ hài lòng về sản phẩm mà về chất lượng phục vụ.
                    Nếu có bất kì vấn đề nào gặp phải, bạn hãy liên hệ ngay với <strong>Plant A Plant </strong> để được giải quyết nhé.
                </p>

                <div className={styles.policyGrid}>
                    <div className={styles.policyItem}>
                        <h4>Sản phẩm không phải là cây</h4>
                        <p>
                            Đối với các mặt hàng <strong>không phải là cây xanh </strong>,
                            quý khách hoàn toàn có thể đổi trả <strong>trong vòng 30 ngày</strong> kể từ ngày nhận được hàng,
                            nếu như sản phẩm gặp phải vấn đề lỗi từ nhà sản xuất.
                        </p>
                    </div>

                    <div className={styles.policyItem}>
                        <h4>Đối với cây có kích thước nhỏ</h4>
                        <p>
                            Tất cả những loại cây xanh có kích thước nhỏ (dưới 100cm) sẽ được <strong>Plant A Plant </strong> bảo hành <strong>trong vòng 30 ngày</strong>.
                            Nếu như cây mà bạn nhận được gặp phải vấn đề suy yếu không thể hồi phục thì hay liên hệ ngay để được đổi cây mới.
                        </p>
                    </div>

                    <div className={styles.policyItem}>
                        <h4>Đối với cây lớn trên 100cm</h4>
                        <p>
                            Đối với những loại cây xanh có kích thước lớn <strong>trên 100cm</strong>,
                            khi được giao tới mà bị các vấn đề <strong>hư hại, héo rủ</strong> hoặc <strong>suy yếu</strong>,
                            quý khách vui lòng liên hệ ngay với <strong>Plant A Plant </strong> để được đổi cây mới <strong>trong vòng 7 ngày</strong>.
                        </p>
                    </div>
                </div>

                <div className={styles.policyFooter}>
                    <p className={styles.policyIntro}>
                        Để thực hiện đổi trả, quý khách có thể liên hệ với <strong>Plant A Plant </strong>
                        thông qua số hotline hoặc email để được tư vấn hỗ trợ đổi trả:
                    </p>
                    <p>
                        📞 Hotline: <strong>0838 369 639</strong> – <strong>09 6688 9393</strong> <br />
                        ✉️ Email: <strong>hotro@plantaplant.com</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Productdetail;
