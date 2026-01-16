import styles from "./ShippingPolicy.module.css";

const ShippingPolicy = () => {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Top info */}
                <div className={styles.top}>
                    <span>08:30 - 22:00</span>
                    <span>0838 369 639 - 09 6688 9393</span>
                </div>

                <h1 className={styles.title}>CHÍNH SÁCH VẬN CHUYỂN</h1>

                {/* 1. Phạm vi giao hàng */}
                <section className={styles.section}>
                    <h2>1. Phạm vi giao hàng</h2>

                    <p>
                        Plant a Plant phục vụ giao hàng cho khách hàng trong phạm vi
                        các khu vực dưới đây:
                    </p>

                    <h3>1.1 – Khu vực TP. Hồ Chí Minh</h3>
                    <p>
                        Đơn hàng sẽ được giao đến địa điểm theo yêu cầu của khách hàng.
                        Đối với các sản phẩm cần lắp đặt, bộ phận giao nhận sẽ hỗ trợ
                        lắp ráp hoàn thiện tại nơi giao hàng.
                    </p>
                    <p>
                        Ngoại trừ các trường hợp có quy định hạn chế như: văn phòng,
                        chung cư cao tầng hạn chế ra vào, khu vực không có chỗ gửi xe.
                        Trong các trường hợp này, quý khách vui lòng liên hệ hotline
                        để được hỗ trợ trước khi giao hàng.
                    </p>
                    <p>
                        Trường hợp khách hàng không sử dụng dịch vụ lắp đặt đã bao gồm
                        trong phí vận chuyển, Plant a Plant sẽ không chịu trách nhiệm
                        hỗ trợ lắp đặt về sau.
                    </p>
                    <p>
                        Quý khách vui lòng thanh toán các chi phí phát sinh theo quy định
                        của Ban Quản lý nơi sinh sống (phí thang máy, phí gửi xe,
                        phí thi công… nếu có).
                    </p>

                    <h3>1.2 – Các tỉnh thành khác trong nước</h3>
                    <ul>
                        <li>
                            Một số sản phẩm có tính chất dễ vỡ (chậu gốm, chậu xi măng…)
                            sẽ được giới hạn khu vực giao hàng để đảm bảo an toàn.
                        </li>
                        <li>
                            <b>Hình thức 1:</b> Giao hàng tận nơi bằng dịch vụ Viettel Post
                            theo địa chỉ khách hàng cung cấp.
                        </li>
                        <li>
                            <b>Hình thức 2:</b> Giao hàng đến kho/bến xe/đơn vị vận chuyển
                            trung gian theo chỉ định của khách hàng tại TP. Hồ Chí Minh.
                            Plant a Plant không chịu trách nhiệm vận chuyển đến tận nơi
                            trong trường hợp này.
                        </li>
                    </ul>
                </section>

                {/* 2. Thời gian giao hàng */}
                <section className={styles.section}>
                    <h2>2. Thời gian giao hàng</h2>
                    <ul>
                        <li>
                            Thời gian xử lý và giao hàng trong khung giờ:
                            <b> 9h – 12h</b> và <b>14h – 17h</b>, từ Thứ 2 đến Thứ 7
                            (trừ ngày lễ, Tết).
                        </li>
                        <li>
                            Giao hàng ngoài giờ hành chính sẽ phát sinh phụ phí theo
                            quy định.
                        </li>
                        <li>
                            Đơn hàng có sẵn: giao trong vòng <b>3 ngày</b> kể từ khi xác
                            nhận đơn.
                        </li>
                        <li>
                            Đơn hàng đặt trước: thời gian giao hàng từ <b>7 – 14 ngày</b>.
                        </li>
                        <li>
                            Quý khách vui lòng sắp xếp thời gian hoặc người nhận hàng
                            theo lịch đã thống nhất.
                        </li>
                        <li>
                            Trường hợp thay đổi thời gian giao hàng hoặc hủy đơn,
                            quý khách vui lòng thông báo trước <b>24h</b> (TP.HCM)
                            hoặc <b>48h</b> (tỉnh thành khác).
                        </li>
                    </ul>
                </section>

                {/* 3. Phí giao hàng */}
                <section className={styles.section}>
                    <h2>3. Phí giao hàng</h2>

                    <p>
                        Phí giao hàng được tính tự động trong quá trình thanh toán,
                        dựa trên địa chỉ nhận hàng, loại sản phẩm và các dịch vụ đi kèm
                        (đóng gói, bảo vệ cây, giá thể, phụ kiện…).
                    </p>

                    <h3>3.1 – Cách tính phí giao hàng</h3>
                    <ul>
                        <li>
                            Phí giao hàng sẽ được hiển thị rõ tại trang Thanh toán
                            trước khi khách hàng xác nhận đặt hàng.
                        </li>
                        <li>
                            Trường hợp đơn hàng áp dụng mã giảm giá vận chuyển,
                            mức phí sau giảm sẽ được cập nhật ngay lập tức trên hệ thống.
                        </li>
                        <li>
                            Phí giao hàng có thể thay đổi tùy theo khu vực giao hàng
                            và khối lượng thực tế của đơn hàng.
                        </li>
                    </ul>

                    <h3>3.2 – Phí giao hàng sau ưu đãi</h3>
                    <ul>
                        <li>
                            Trong trường hợp áp dụng mã giảm phí vận chuyển,
                            hệ thống sẽ tự động tính toán và hiển thị
                            <b> Phí vận chuyển sau giảm</b> tại trang Thanh toán.
                        </li>
                        <li>
                            Phí vận chuyển sau giảm không nhỏ hơn 0₫
                            và được cộng trực tiếp vào tổng giá trị đơn hàng.
                        </li>
                    </ul>

                    <h3>3.3 – Lưu ý</h3>
                    <ul>
                        <li>
                            Plant a Plant không thu thêm bất kỳ khoản phí giao hàng nào
                            ngoài mức phí đã hiển thị tại bước Thanh toán.
                        </li>
                        <li>
                            Trong trường hợp phát sinh chi phí đặc biệt
                            (giao ngoài giờ, địa điểm khó tiếp cận…),
                            nhân viên sẽ liên hệ xác nhận trước với khách hàng.
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default ShippingPolicy;
