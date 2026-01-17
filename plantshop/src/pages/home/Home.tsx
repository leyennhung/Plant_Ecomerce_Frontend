import {useEffect, useState} from "react";
import {productService} from "../../services/product.service";
import type {Product} from "../../types/product.type";
// import Button from "../../components/common/Button";
import styles from "./Home.module.css";
import banner from "../../assets/images/banner.png"
import ProductCard from "../../components/common/product/single/ProductCard";
// import ProductCardCombo from "../../components/common/product/combo/ProductCardCombo";
import CayTrongImg from "../../assets/images/CayTrauBaDeVuong.jpg";
import ChauCayImg from "../../assets/images/ChauCayDatNung.jpg";
import ComboImg from "../../assets/images/CayPhuQuy.jpg";
import HatGiongImg from "../../assets/images/HatGiong.jpg";
import GiaSiImg from "../../assets/images/CayGiongGiaSi.png";
import vuonImg from "../../assets/images/vuon.jpg";
import {Link} from "react-router-dom";

//Function component Home (khai báo, tạo)
const Home = () => {
    //Khai báo state
    // một biến để lưu danh sách sản phẩm, và khi nó thay đổi thì hàm setProducts sẽ làm giao diện phải cập nhật lại
    // products: danh sách sản phẩm
    // setProducts: hàm cập nhật danh sách
    // Product[]: mảng các sản phẩm
    // Giá trị ban đầu: [] (mảng rỗng)
    // const [products, setProducts] = useState<Product[]>([]);
    const [newProducts, setNewProducts] = useState<Product[]>([]);
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
    const [saleProducts, setSaleProducts] = useState<Product[]>([]);
    const [wholesaleProducts, setWholesaleProducts] = useState<Product[]>([]);
    const [suppliesProducts, setSuppliesProducts] = useState<Product[]>([]);
    const [comboProducts, setComboProducts] = useState<Product[]>([]);

    // loading: trạng thái đang tải dữ liệu
    // Ban đầu là true → đang load
    const [loading, setLoading] = useState(true);

    //useEffect – gọi API khi component được render lần đầu
    useEffect(() => {
        Promise.all([
            productService.getNewProduct(),
            productService.getTrendingProducts(),
            productService.getSaleProducts(),
            productService.getWholesaleProducts(),
            productService.getSuppliesProducts(),
            productService.getComboProducts(),
        ])
            // API trả về json sẽ lưu ds spham vào state products đã khai báo trước đó
            .then(([newProds, trendingProds, salePros, wholesaleProds, suppliesProds, comboProds]) => {
                setNewProducts(newProds);
                setTrendingProducts(trendingProds);
                setSaleProducts(salePros);
                setWholesaleProducts(wholesaleProds);
                setSuppliesProducts(suppliesProds);
                // Chuẩn hóa combo: lấy images từ comboItems, loại bỏ undefined
                const comboWithImages = comboProds.map((cbp) => ({
                    ...cbp,
                    images: cbp.comboItems?.map((item) => item.image).filter((img): img is string => !!img) || [],
                }));
                setComboProducts(comboWithImages);
            })
            .finally(() => setLoading(false));  // dù api thành công hay thất bại thì quá trình load phải = false
    }, []);  // kết thúc quá trình loading

    if (loading) return <p>Loading products...</p>;  //Xử lý khi đang loading

    //Trả về JSX - giao diện
    return (
        <div className={styles.container}>
            {/*1.BANNER*/}
            <div className={styles.banner}>
                <img src={banner} alt={banner} className={styles.imgbanner}/>
            </div>
            {/*2.CONTENT*/}
            <div className={styles.content}>
                {/*    2.1 CHOICE*/}
                <section className={styles.choiceSection}>
                    <div className={styles.choiceList}>

                        <Link to="/products?type=plant" className={styles.choiceItem}>
                            <img src={CayTrongImg} alt="CayTrong"/>
                            <span>Cây trồng</span>
                        </Link>

                        <Link to="/products?type=pot" className={styles.choiceItem}>
                            <img src={ChauCayImg} alt="ChauCay"/>
                            <span>Chậu cây</span>
                        </Link>

                        <Link to="/products?type=combo" className={styles.choiceItem}>
                            <img src={ComboImg} alt="Combo"/>
                            <span>Combo</span>
                        </Link>

                        <Link to="/products?type=seed" className={styles.choiceItem}>
                            <img src={HatGiongImg} alt="HatGiong"/>
                            <span>Hạt gống</span>
                        </Link>

                        <Link to="/products?type=bulk" className={styles.choiceItem}>
                            <img src={GiaSiImg} alt="UuDaiSi"/>
                            <span>Ưu đãi sĩ</span>
                        </Link>
                    </div>
                    <div className={styles.viewMoreWrapper}>
                        <Link to="/products" className={styles.viewMoreBtn}>
                            Xem thêm sản phẩm →
                        </Link>
                    </div>
                </section>
                {/*2.2 SẢN PHẨM MỚI*/}
                <section className={styles.productSection}>
                    <h2 className={styles.title}> Sản phẩm mới nhất</h2>
                    <div className={styles.divider}></div>
                    <div className={styles.productList}>
                        {newProducts.map(np => (
                            <ProductCard
                                key={np.id}
                                product={np}
                                isNew
                            />
                        ))}
                    </div>
                </section>
                {/*2.3 SẢN PHẨM TRENDING*/
                }
                <section className={styles.productSection}>
                    <h2 className={styles.title}>🌱 Sản phẩm Trending</h2>
                    <div className={styles.divider}></div>
                    <div className={styles.productList}>
                        {trendingProducts.map(tp => (
                            <ProductCard
                                key={tp.id}
                                product={tp}
                                isTrending
                            />
                        ))}
                    </div>
                </section>
                {/*2.4 SẢN PHẨM GIẢM GIÁ*/
                }
                <section className={styles.productSection}>
                    <h2 className={styles.title}> Sản phẩm khuyến mãi</h2>
                    <div className={styles.divider}></div>
                    <div className={styles.productList}>
                        {saleProducts.map(sp => (
                            <ProductCard
                                key={sp.id}
                                product={sp}
                                isSale
                            />
                        ))}
                    </div>
                </section>
                {/* 2.5 COMBO HẤP DẪN */
                }
                <section className={styles.productSection}>
                    <h2 className={styles.title}>Combo hấp dẫn</h2>
                    <div className={styles.divider}></div>
                    <div className={styles.productListCombo}>
                        {comboProducts.map(cbp => (
                            <ProductCard
                                key={cbp.id}
                                product={cbp}
                            />
                        ))}
                    </div>
                </section>
                {/*2.6 CÂY GIỐNG*/
                }
                <section className={styles.productSection}>
                    <h2 className={styles.title}>Ưu đãi giá sĩ cây giống</h2>
                    <div className={styles.divider}></div>
                    <div className={styles.productList}>
                        {wholesaleProducts.map(wsp => (
                            <ProductCard
                                key={wsp.id}
                                product={wsp}
                            />
                        ))}
                    </div>
                </section>
                {/*2.7 DỤNG CỤ */
                }
                <section className={styles.productSection}>
                    <h2 className={styles.title}>Vật tư cây trồng</h2>
                    <div className={styles.divider}></div>
                    <div className={styles.productList}>
                        {suppliesProducts.map(slp => (
                            <ProductCard
                                key={slp.id}
                                product={slp}
                            />
                        ))}
                    </div>
                </section>
            </div>
            {/* 3. GIỚI THIỆU */
            }
            <section className={styles.introSection}>
                <div className={styles.introContainer}>
                    {/* Ảnh bên trái */}
                    <div className={styles.introImage}>
                        <img src={vuonImg} alt="Garden"/>
                    </div>

                    {/* Nội dung bên phải */}
                    <div className={styles.introContent}>
                        <h2>Lý do chọn PLAN A PLAN?</h2>
                        <div className={styles.introList}>
                            <div className={styles.introItem}>
                                <span className={styles.icon}>🌱</span>
                                <div>
                                    <h3>Tuyển chọn</h3>
                                    <p>Mọi cây xanh đều phải được chọn lọc kỹ lưỡng</p>
                                </div>
                            </div>
                            <div className={styles.introItem}>
                                <span className={styles.icon}>🪴</span>
                                <div>
                                    <h3>Đa dạng</h3>
                                    <p>Dễ dàng tìm được sản phẩm mà bạn mong muốn</p>
                                </div>
                            </div>
                            <div className={styles.introItem}>
                                <span className={styles.icon}>🤝</span>
                                <div>
                                    <h3>Đồng hành</h3>
                                    <p>Luôn đồng hành và giúp đỡ bạn về mặt kỹ thuật</p>
                                </div>
                            </div>
                            <div className={styles.introItem}>
                                <span className={styles.icon}>📸</span>
                                <div>
                                    <h3>Đúng chuẩn</h3>
                                    <p>Sử dụng hình ảnh chụp thực tế giúp dễ hình dung</p>
                                </div>
                            </div>
                            <div className={styles.introItem}>
                                <span className={styles.icon}>✅</span>
                                <div>
                                    <h3>Tin cậy</h3>
                                    <p>Gửi ảnh thực tế và cụ thể trước khi giao hàng</p>
                                </div>
                            </div>
                            <div className={styles.introItem}>
                                <span className={styles.icon}>💰</span>
                                <div>
                                    <h3>Cạnh tranh</h3>
                                    <p>Tối ưu hóa ngân sách nhờ mức giá cực kì cạnh tranh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*4.  BLOG*/
            }
            <div>

            </div>
            {/*<Button onClick={() => alert("Clicked!")}>*/
            }
            {/*    Thêm vào giỏ hàng*/
            }
            {/*</Button>*/
            }

            {/*<Button variant="outline">*/
            }
            {/*    Xem chi tiết*/
            }
            {/*</Button>*/
            }
        </div>
    )
        ;
};

// Export component
export default Home;
