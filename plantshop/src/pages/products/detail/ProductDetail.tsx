import {useEffect, useState, useRef} from "react";
import {Link, useParams} from "react-router-dom";
import {productService} from "../../../services/product.service";
import type {PotVariant, ProductDetail, ProductImage} from "../../../types/product.type";
import styles from "./ProductDetail.module.css";
import {formatPrice} from "../../../utils/formatPrice";
import ReactMarkdown from "react-markdown";
import ProductCard from "../../../components/common/product/single/ProductCard.tsx";
import {reviewService} from "../../../services/review.service";
import type {Review} from "../../../types/review.type";
import PlantSpecs from "./components/PlantSpecs.tsx";
import SeedSpecs from "./components/SeedSpecs.tsx";
import PotSpecs from "./components/PotSpecs.tsx";
import SuppliesSpecs from "./components/SuppliesSpecs.tsx";
import {useSelector, useDispatch} from "react-redux";
import type {RootState} from "../../../store";
import {addToWishlist, removeFromWishlist} from "../../../store/wishlistSlice";
import {addToCart} from "../../../store/cartSlice";


const Productdetail = () => {
    const dispatch = useDispatch();

    // const { id } = useParams<{ id: string }>();
    const {slug} = useParams<{ slug: string }>();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [mainImage, setMainImage] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
    const [relatedProducts, setRelatedProducts] = useState<ProductDetail[]>([]);
    const [suggestSupplies, setSuggestSupplies] = useState<ProductDetail[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    //const [loadingReview, setLoadingReview] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    // select kích thước, màu
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedVariant, setSelectedVariant] = useState<PotVariant | null>(null);
    // về đầu page
    const topRef = useRef<HTMLDivElement>(null);

    /* WISHLIST REDUX */
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

    const isFavorite = (() => {
        if (!product) return false;

        if (product.type === "pot") {
            if (!selectedVariant) return false;
            return wishlistItems.some(
                i =>
                    i.product_id === product.id &&
                    i.variant_id === selectedVariant.id
            );
        }

        return wishlistItems.some(i => i.product_id === product.id);
    })();

    const toggleFavorite = () => {
        if (!product) return;

        if (product.type === "pot") {
            if (!selectedVariant) {
                alert("Vui lòng chọn màu và kích thước trước khi thêm vào yêu thích");
                return;
            }

            if (isFavorite) {
                dispatch(
                    removeFromWishlist({
                        productId: product.id,
                        variantId: selectedVariant.id,
                    })
                );
            } else {
                dispatch(
                    addToWishlist({
                        id: Date.now(),
                        user_id: 0,
                        product_id: product.id,
                        variant_id: selectedVariant.id,
                        name: product.name,
                        image: selectedVariant.image || product.images?.[0]?.url || "",
                        price: selectedVariant.price,
                        created_at: new Date().toISOString(),
                    })
                );
            }
        } else {
            if (isFavorite) {
                dispatch(removeFromWishlist({productId: product.id}));
            } else {
                dispatch(
                    addToWishlist({
                        id: Date.now(),
                        user_id: 0,
                        product_id: product.id,
                        name: product.name,
                        image: product.images?.[0]?.url || "",
                        price: product.salePrice ?? product.price,
                        created_at: new Date().toISOString(),
                    })
                );
            }
        }
    };

    const user = {id: 999, name: "Khách hàng", avatar: "https://i.pravatar.cc/60?img=50"}; // demo user
    useEffect(() => {
        if (!slug) return;
        productService.getProductDetailSlug(slug).then(p => {
            setProduct(p);
            setMainImage(p.images?.[0].url ?? "");

            if (p.type === "pot" && p.variants && p.variants.length > 0) {
                const colors = Array.from(new Set(p.variants.map(v => v.color)));
                // chỉ có 1 màu → auto chọn
                if (colors.length === 1 && !selectedColor) {
                    setSelectedColor(colors[0]);
                }
                // const first = p.variants[0];
                // setSelectedColor(first.color);
                // setSelectedSize(first.size);
                // setSelectedVariant(first);
                // setMainImage(first.image || p.images?.[0].url);
            }
        });
        productService.getRelatedProducts(slug).then(setRelatedProducts);
        productService.getSuggestSupplies(slug).then(setSuggestSupplies);
    }, [slug]);

    // load favorite from localStorage
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

    // Về đầu page
    useEffect(() => {
        topRef.current?.scrollIntoView({
            behavior: "instant",
            block: "start",
        });
    }, [slug]);

    const handleAddToCart = () => {
        if (!product) return;

        if (product.type === "pot") {
            if (!selectedVariant) {
                alert("Vui lòng chọn màu và kích thước chậu");
                return;
            }

            dispatch(
                addToCart({
                    productId: product.id,
                    quantity,
                    variant: {
                        id: selectedVariant.id,
                        name: `${selectedVariant.color} - ${selectedVariant.size}`,
                        price: selectedVariant.price,
                        image: selectedVariant.image,
                    },
                })
            );
        } else {
            dispatch(addToCart({productId: product.id, quantity}));
        }
    };

    const changeMainImage = (img: ProductImage) => {
        setMainImage(img.url);
    };

    const toggleAccordion = (index: number) => {
        setActiveAccordion(prev => (prev === index ? null : index));
    };
    if (!product) return <div>Loading...</div>;

    const salePrice = product.salePrice ?? null;
    const hasSale = typeof salePrice === "number" && salePrice > 0 && salePrice < product.price;

    const categoryTags = [
        product.category?.name,
        ...(product.attributes?.map(attr => attr.name) ?? [])
    ].filter(Boolean);

    // Trung bình dánh giá
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    const formattedAverage = averageRating.toFixed(1);
    // thêm bình luaanj
    const handleAddComment = async () => {
        if (!newComment.trim()) return alert("Vui lòng nhập nội dung bình luận");

        if (!product?.id || !product.slug) return;

        try {
            const review = await reviewService.addReview({
                productId: product.id,
                slug: product.slug,
                user,
                rating: newRating,
                content: newComment,
            });

            setReviews(prev => [review, ...prev]); // thêm vào đầu danh sách
            setNewComment("");
            setNewRating(5);
        } catch (error) {
            console.error(error);
            alert("Không thể gửi bình luận, thử lại sau");
        }
    };
    // tạo danh sách kích thước, màu ( lọc trungf)
    const potColors = product?.variants
        ? Array.from(new Set(product.variants.map(v => v.color)))
        : [];

    const potSizes = product?.variants
        ? product.variants
            .filter(v => v.color === selectedColor)
            .map(v => v.size)
        : [];
    // handler chọn màu và kích thước
    const handleSelectColor = (color: string) => {
        setSelectedColor(color);
        setSelectedSize("");
        setSelectedVariant(null);
    };

    const handleSelectSize = (size: string) => {
        setSelectedSize(size);
        const variant = product?.variants?.find(
            v => v.color === selectedColor && v.size === size
        );

        if (variant) {
            setSelectedVariant(variant);
            setMainImage(variant.image || mainImage);
        }
    };
    // Hiển thị giá theo sp (pot)
    const displayPrice = selectedVariant?.price ?? product.price;

// Hiển thị theo productType
    const renderSpecs = () => {
        switch (product.type) {
            case "plant":
                return <PlantSpecs detail={product.plantDetail}/>;

            case "seed":
                return <SeedSpecs detail={product.seedDetail}/>;

            case "pot":
                return (<PotSpecs
                    detail={product.potDetail}
                    variants={product.variants}
                />);
            case "supplies":
                return (<SuppliesSpecs
                    detail={product.suppliesDetail}
                />);
            default:
                return null;
        }
    };

    return (
        <div ref={topRef} className={styles.container}>
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
                                {/*{formatPrice(product.price)}*/}
                                    {formatPrice(displayPrice)}
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
                        {/* CHỌN BIẾN THỂ CHẬU */}
                        {product.type === "pot" && product.variants && (
                            <div className={styles.variantBox}>
                                {/* MÀU */}
                                <div className={styles.variantRow}>
                                    <label>Màu sắc</label>
                                    <select
                                        value={selectedColor}
                                        onChange={e => handleSelectColor(e.target.value)}
                                    >
                                        <option value="">Chọn màu</option>
                                        {potColors.map(color => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* KÍCH THƯỚC */}
                                <div className={styles.variantRow}>
                                    <label>Kích thước</label>
                                    <select
                                        value={selectedSize}
                                        onChange={e => handleSelectSize(e.target.value)}
                                        disabled={!selectedColor}
                                    >
                                        <option value="">Chọn kích thước</option>
                                        {potSizes.map(size => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className={styles.buyRow}>
                            <div className={styles.quantityBox}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <input type="text" readOnly value={quantity}/>
                                <button onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                            <button className={styles.btnCart} onClick={handleAddToCart}>
                                THÊM GIỎ HÀNG
                            </button>
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
                        <h3 className={styles.productTitle}>
                            {product.type === "combo" ? "Sản phẩm trong combo" : "Giới thiệu"}
                        </h3>
                    </div>

                    {/* COMBO*/}
                    {product.type === "combo" ? (
                        <div className={styles.comboList}>
                            {product.comboItems?.map(item => (
                                <Link key={item.id} to={`/products/${item.slug}`} className={styles.comboItem}>
                                <img src={item.image} alt={item.name} className={styles.comboImage}/>
                                    <div className={styles.comboInfo}>
                                        <p className={styles.comboName}>{item.name}</p>
                                        <p className={styles.comboQty}>Số lượng: x{item.quantity}</p>
                                    </div>
                                </Link>

                            ))}
                        </div>
                    ) : (
                        /* PRODUCT THƯỜNG */
                        <div className={styles.productSpecs}>
                            {/* BẢNG 1 – THÔNG TIN THEO LOẠI */}
                            {renderSpecs()}

                            {/* BẢNG 2 – QUY CÁCH */}
                            <div className={styles.specTable}>
                                <div className={styles.specRow}>
                                    <span><strong>Trọng lượng</strong></span>
                                    <span>{product.dimensions?.weight}</span>
                                </div>

                                <div className={styles.specRow}>
                                    <span><strong>Chiều cao:</strong></span>
                                    <span>{product.dimensions?.totalHeight}</span>
                                </div>

                                <div className={styles.specRow}>
                                    <span><strong>Chiều rộng:</strong></span>
                                    <span>{product.dimensions?.canopyWidth}</span>
                                </div>

                                <div className={styles.specRow}>
                                    <span><strong>Đường kính chậu:</strong></span>
                                    <span>{product.dimensions?.potWidth}</span>
                                </div>

                                <div className={styles.specRow}>
                                    <span><strong>Chiều cao chậu:</strong></span>
                                    <span>{product.dimensions?.potHeight}</span>
                                </div>
                            </div>
                        </div>
                    )}
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
                                        img: ({...props}) => (
                                            <img{...props}
                                                className={styles.markdownImage}/>),
                                        p: ({children}) => (
                                            <p className={styles.markdownParagraph}>{children}</p>),
                                    }}>
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
                                        img: ({...props}) => (
                                            <img{...props}
                                                className={styles.markdownImage}/>),
                                        p: ({children}) => (
                                            <p className={styles.markdownParagraph}>{children}</p>),
                                    }}>
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
                        <span className={styles.accordionTitle}>Chăm sóc / Bảo quản </span>
                        <span className={styles.accordionIcon}></span>
                    </button>
                    <div className={styles.accordionContent}>
                        <div className={styles.accordionInner}>
                            <div className={styles.markdown}>
                                <ReactMarkdown
                                    components={{
                                        img: ({...props}) => (
                                            <img{...props}
                                                className={styles.markdownImage}/>),
                                        p: ({children}) => (
                                            <p className={styles.markdownParagraph}>{children}</p>),
                                    }}>
                                    {product.infor?.careGuide ?? ""}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BÌNH LUẬN ĐÁNH GIÁ */}
                <div className={`${styles.accordionItem} ${activeAccordion === 3 ? styles.active : ""}`}>
                    <button className={styles.accordionHeader}
                            onClick={() => toggleAccordion(3)}>
                        <span className={styles.accordionTitle}>Bình luận & đánh giá -
                            {reviews.length > 0 && ` (${formattedAverage}★)`}</span>
                        <span className={styles.accordionIcon}></span>
                    </button>

                    <div className={styles.accordionContent}>
                        <div className={styles.accordionInner}>
                            {/* FORM THÊM BÌNH LUẬN */}
                            <div className={styles.addComment}>
                                <h4>Thêm đánh giá của bạn</h4>
                                {/* Rating 5 sao */}
                                <div className={styles.starRating}>
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <span key={n}
                                            // className={`${styles.star} ${n <= newRating ? styles.filled : ""}`}
                                              onClick={() => setNewRating(n)}
                                              style={{
                                                  cursor: "pointer",
                                                  fontSize: "24px",
                                                  color: n <= newRating ? "#FFD700" : "#CCC"
                                              }}
                                        >★</span>
                                    ))}
                                </div>
                                <textarea
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="Viết bình luận..."
                                    rows={4}
                                    className={styles.commentTextarea}
                                />
                                <button className={styles.btnSendComment} onClick={handleAddComment}>Gửi đánh giá
                                </button>
                            </div>
                            {/*DANH SÁCH ĐÁNH GIÁ*/}
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
                        <h3 className={styles.title}> Gợi ý cho không gian của bạn</h3>
                        <div className={styles.divider}></div>
                        <div className={styles.productList}>
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p}/>
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
                                <ProductCard key={s.id} product={s}/>
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
                    <strong>Plant A Plant </strong> Garden muốn mang đến trải nghiệm mua sắm tuyệt vời nhất tới khách
                    hàng của mình.
                    Chính vì vậy mà tất cả các sản phẩm được mua tại <strong>Plant A Plant </strong> đều sẽ được đảm bảo
                    chất lượng trước khi tới tay khách hàng. Hy vọng rằng bạn sẽ không chỉ hài lòng về sản phẩm mà về
                    chất lượng phục vụ.
                    Nếu có bất kì vấn đề nào gặp phải, bạn hãy liên hệ ngay với <strong>Plant A Plant </strong> để được
                    giải quyết nhé.
                </p>

                <div className={styles.policyGrid}>
                    <div className={styles.policyItem}>
                        <h4>Sản phẩm không phải là cây</h4>
                        <p>
                            Đối với các mặt hàng <strong>không phải là cây xanh </strong>,
                            quý khách hoàn toàn có thể đổi trả <strong>trong vòng 30 ngày</strong> kể từ ngày nhận được
                            hàng,
                            nếu như sản phẩm gặp phải vấn đề lỗi từ nhà sản xuất.
                        </p>
                    </div>

                    <div className={styles.policyItem}>
                        <h4>Đối với cây có kích thước nhỏ</h4>
                        <p>
                            Tất cả những loại cây xanh có kích thước nhỏ (dưới 100cm) sẽ được <strong>Plant A
                            Plant </strong> bảo hành <strong>trong vòng 30 ngày</strong>.
                            Nếu như cây mà bạn nhận được gặp phải vấn đề suy yếu không thể hồi phục thì hay liên hệ ngay
                            để được đổi cây mới.
                        </p>
                    </div>

                    <div className={styles.policyItem}>
                        <h4>Đối với cây lớn trên 100cm</h4>
                        <p>
                            Đối với những loại cây xanh có kích thước lớn <strong>trên 100cm</strong>,
                            khi được giao tới mà bị các vấn đề <strong>hư hại, héo rủ</strong> hoặc <strong>suy
                            yếu</strong>,
                            quý khách vui lòng liên hệ ngay với <strong>Plant A Plant </strong> để được đổi cây
                            mới <strong>trong vòng 7 ngày</strong>.
                        </p>
                    </div>
                </div>

                <div className={styles.policyFooter}>
                    <p className={styles.policyIntro}>
                        Để thực hiện đổi trả, quý khách có thể liên hệ với <strong>Plant A Plant </strong>
                        thông qua số hotline hoặc email để được tư vấn hỗ trợ đổi trả:
                    </p>
                    <p>
                        📞 Hotline: <strong>0838 369 639</strong> – <strong>09 6688 9393</strong> <br/>
                        ✉️ Email: <strong>hotro@plantaplant.com</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Productdetail;
