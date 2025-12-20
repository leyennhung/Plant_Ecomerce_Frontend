import { useEffect, useState } from "react";
import { productService } from "../../services/product.service";
import type { Product } from "../../types/product.type";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/common/Button";
import styles from "./Home.module.css";

//Function component Home (khai báo, tạo)
const Home = () => {
    //Khai báo state
    // một biến để lưu danh sách sản phẩm, và khi nó thay đổi thì hàm setProducts sẽ làm giao diện phải cập nhật lại
    // products: danh sách sản phẩm
    // setProducts: hàm cập nhật danh sách
    // Product[]: mảng các sản phẩm
    // Giá trị ban đầu: [] (mảng rỗng)
    const [products, setProducts] = useState<Product[]>([]);
    // loading: trạng thái đang tải dữ liệu
    // Ban đầu là true → đang load
    const [loading, setLoading] = useState(true);

    //useEffect – gọi API khi component được render lần đầu
    useEffect(() => {
        productService.getAll()  // gọi hàm trong service để gọi api
            .then(data => setProducts(data)) // API trả về json sẽ lưu ds spham vào state products đã khai báo trước đó
            .finally(() => setLoading(false));  // dù api thành công hay thất bại thì quá trình load phải = false
    }, []);  // kết thúc quá trình loading

    if (loading) return <p>Loading products...</p>;  //Xử lý khi đang loading

    //Trả về JSX - giao diện
    return (
        <div className={styles.container}>    {/*styles.container là class CSS module*/}
            <h1 className={styles.title}>🌱 Sản phẩm nổi bật</h1>
            <div className={styles.productList}>

                {/*Duyệt qua từng sản phẩm trong products
                    map → render nhiều card*/}
                {products.map(product => (
                    // Mỗi sp là 1 card
                    <div key={product.id} className={styles.card}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className={styles.image}
                        />
                        <h3 className={styles.name}>{product.name}</h3>
                        <p className={styles.price}>
                            {formatPrice(product.price)}
                        </p>
                    </div>
                ))}
            </div>
            <Button onClick={() => alert("Clicked!")}>
                Thêm vào giỏ hàng
            </Button>

            <Button variant="outline">
                Xem chi tiết
            </Button>
        </div>
    );
};

// Export component
export default Home;
