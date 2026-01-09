import React, { useState, useEffect } from 'react';
import styles from './Orders.module.css';
import { initLocalStorageData } from '../../utils/seedData';
import type {Order, OrderItem, OrderStatus} from '../../types/order.type';
import type {Product} from '../../types/product.type';

const ITEMS_PER_PAGE = 3;

type TabStatus = 'processing' | 'shipping' | 'completed' | 'cancelled';

interface OrderDisplay extends Order {
    itemsDetail: Array<OrderItem & { productInfo?: Product }>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const mapBackendStatusToTab = (status: string): TabStatus => {
    switch (status) {
        case 'pending': case 'confirmed': case 'packing': case 'unpaid': return 'processing';
        case 'shipping': return 'shipping';
        case 'done': case 'paid': case 'success': return 'completed';
        case 'cancelled': case 'failed': case 'refunded': return 'cancelled';
        default: return 'processing';
    }
};

const OrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabStatus>('processing');
    const [orders, setOrders] = useState<OrderDisplay[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // --- STATE MỚI CHO POPUP HỦY ĐƠN ---
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null); // Lưu ID gốc để xử lý

    const handleTabChange = (tab: TabStatus) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // Hàm load dữ liệu (dùng chung để gọi lại khi cần reload)
    const fetchOrders = () => {
        const rawOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
        const rawItems: OrderItem[] = JSON.parse(localStorage.getItem('order_items') || '[]');
        const rawProducts: Product[] = JSON.parse(localStorage.getItem('products') || '[]');

        if (rawOrders.length > 0) {
            const processedOrders: OrderDisplay[] = rawOrders.map((order) => {
                const currentItems = rawItems.filter((item) => String(item.order_id) === String(order.id));
                const itemsWithProduct = currentItems.map((item) => {
                    const product = rawProducts.find((p) => p.id === item.product_id);
                    return { ...item, productInfo: product };
                });
                return { ...order, itemsDetail: itemsWithProduct };
            });

            processedOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setOrders(processedOrders);
        }
    };

    useEffect(() => {
        initLocalStorageData();
        const timer = setTimeout(() => {
            fetchOrders();
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    // --- LOGIC HỦY ĐƠN ---

    // 1. Mở popup
    const onOpenCancelModal = (orderRawId: string) => {
        setOrderToCancel(orderRawId);
        setShowCancelModal(true);
    };

    // 2. Xác nhận hủy
    const handleConfirmCancel = () => {
        if (!orderToCancel) return;

        const rawOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

        const updatedRawOrders = rawOrders.map(order => {
            if (String(order.id) === String(orderToCancel)) {
                // SỬA Ở ĐÂY: Thay 'as any' bằng 'as OrderStatus'
                return { ...order, status: 'cancelled' as OrderStatus };
            }
            return order;
        });

        localStorage.setItem('orders', JSON.stringify(updatedRawOrders));

        fetchOrders();
        setShowCancelModal(false);
        setOrderToCancel(null);
    };

    // --- END LOGIC ---

    const filteredOrders = orders.filter((order) => mapBackendStatusToTab(order.status) === activeTab);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                <p style={{ color: '#666' }}>Đang tải dữ liệu đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Đơn Hàng Của Tôi</h1>

            <div className={styles.tabsContainer}>
                {(['processing', 'shipping', 'completed', 'cancelled'] as TabStatus[]).map((tab) => (
                    <div
                        key={tab}
                        className={`${styles.tabItem} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab === 'processing' && 'Đang xử lý'}
                        {tab === 'shipping' && 'Đang giao'}
                        {tab === 'completed' && 'Đã hoàn thành'}
                        {tab === 'cancelled' && 'Đã hủy'}
                    </div>
                ))}
            </div>

            <div className={styles.ordersList}>
                {currentOrders.length > 0 ? (
                    currentOrders.map((order) => {
                        const visibleItems = order.itemsDetail.slice(0, 3);
                        const remainingItemsCount = order.itemsDetail.length - 3;

                        // Lấy trạng thái tab để check điều kiện hiển thị nút
                        const currentTab = mapBackendStatusToTab(order.status);

                        return (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.orderIdDate}>
                                        <span className={styles.orderCode}>Đơn hàng #{order.id}</span>
                                        <span className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </span>
                                    </div>

                                    {/* BUTTON GROUP */}
                                    <div className={styles.btnGroup}>
                                        {/* Chỉ hiện nút Hủy ở tab Đang Xử Lý */}
                                        {currentTab === 'processing' && (
                                            <button
                                                className={styles.btnCancel}
                                                onClick={() => onOpenCancelModal(order.id)} // Truyền ID thực tế (Order.id)
                                            >
                                                Hủy đơn
                                            </button>
                                        )}
                                        <button className={styles.btnDetail}>Xem Chi Tiết</button>
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    {visibleItems.map((item, index) => (
                                        <div key={`${order.id}-${index}`} className={styles.productItem}>
                                            <img
                                                src={item.productInfo?.imageUrl || 'https://via.placeholder.com/80'}
                                                alt={item.productInfo?.name}
                                                className={styles.productImg}
                                            />
                                            <div className={styles.productInfo}>
                                                <div className={styles.prodName}>
                                                    {item.productInfo?.name || `Sản phẩm #${item.product_id}`}
                                                </div>
                                                <div className={styles.prodQty}>x{item.quantity}</div>
                                            </div>
                                            <div style={{ marginLeft: 'auto', alignSelf: 'center', fontWeight: 500, color: '#333' }}>
                                                {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.cardFooter}>
                                    {remainingItemsCount > 0 ? (
                                        <div className={styles.moreItemsTag}>
                                            + {remainingItemsCount} sản phẩm khác
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}

                                    <div className={styles.totalPriceWrapper}>
                                        Tổng cộng: <span className={styles.totalPriceValue}>{formatCurrency(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                        Chưa có đơn hàng nào trong mục này.
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabled : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <svg className={styles.iconSvg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                            key={page}
                            className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <svg className={styles.iconSvg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            )}

            {/* --- POPUP MODAL --- */}
            {showCancelModal && (
                <div className={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
                    {/* stopPropagation để click vào nội dung modal không bị đóng */}
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Xác nhận hủy đơn</h3>
                        <p className={styles.modalDesc}>
                            Bạn có chắc chắn muốn hủy đơn hàng này không? <br/>
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnCloseModal} onClick={() => setShowCancelModal(false)}>
                                Đóng
                            </button>
                            <button className={styles.btnConfirm} onClick={handleConfirmCancel}>
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default OrdersPage;