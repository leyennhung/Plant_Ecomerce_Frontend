import React, { useState, useEffect } from 'react';
import styles from './Orders.module.css';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderStatus } from '../../types/order.type';

const ITEMS_PER_PAGE = 3;

// TabStatus
type TabStatus = 'processing' | 'shipping' | 'completed' | 'cancelled';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const mapBackendStatusToTab = (status: OrderStatus | string): TabStatus => {
    switch (status) {
        case 'pending': case 'confirmed': case 'packing': case 'unpaid': case 'processing': return 'processing';
        case 'shipping': case 'shipped': return 'shipping';
        case 'done': case 'paid': case 'success': case 'delivered': return 'completed';
        case 'cancelled': case 'failed': case 'refunded': return 'cancelled';
        default: return 'processing';
    }
};

const OrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabStatus>('processing');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();

    // State cho popup hủy
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

    const handleTabChange = (tab: TabStatus) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // LOAD DATA TỪ LOCALSTORAGE
    const fetchOrders = () => {
        try {
            const storedUser = localStorage.getItem("user");
            const currentUser = storedUser ? JSON.parse(storedUser).user : null;

            const storedOrders = localStorage.getItem('orders');

            if (storedOrders) {
                const parsedOrders = JSON.parse(storedOrders) as Order[];

                // Lọc theo user
                const myOrders = currentUser
                    ? parsedOrders.filter(o => String(o.user_id) === String(currentUser.id))
                    : [];

                // Map dữ liệu
                const processedOrders: Order[] = myOrders.map((order) => {
                    const originalItems = order.items || [];

                    // Map item để có field productInfo
                    const itemsMapped = originalItems.map((item) => ({
                        ...item,
                        productInfo: {
                            name: item.name || "Sản phẩm",
                            imageUrl: item.imageUrl || 'https://via.placeholder.com/80'
                        }
                    }));

                    return { ...order, itemsDetail: itemsMapped };
                });

                // Sắp xếp mới nhất
                processedOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setOrders(processedOrders);
            }
        } catch (error) {
            console.error("Lỗi đọc dữ liệu:", error);
            setOrders([]);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    // Logic Hủy đơn
    const onOpenCancelModal = (orderId: string) => {
        setOrderToCancel(orderId);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        if (!orderToCancel) return;
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            const allOrders = JSON.parse(storedOrders) as Order[];
            const updatedOrders = allOrders.map((o) => {
                if (String(o.id) === String(orderToCancel)) {
                    return { ...o, status: 'cancelled' as OrderStatus };
                }
                return o;
            });
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            fetchOrders();
        }
        setShowCancelModal(false);
        setOrderToCancel(null);
    };

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
                        // Dùng itemsDetail đã map ở trên
                        const currentItems = order.itemsDetail || [];
                        const visibleItems = currentItems.slice(0, 3);
                        const remainingItemsCount = currentItems.length - 3;
                        const currentTab = mapBackendStatusToTab(order.status);

                        return (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.orderIdDate}>
                                        <span className={styles.orderCode}>Đơn hàng #{order.id.substring(0,8).toUpperCase()}</span>
                                        <span className={styles.orderDate}>
                                            {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className={styles.btnGroup}>
                                        {currentTab === 'processing' && (
                                            <button
                                                className={styles.btnCancel}
                                                onClick={() => onOpenCancelModal(order.id)}
                                            >
                                                Hủy đơn
                                            </button>
                                        )}
                                        <button
                                            className={styles.btnDetail}
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                        >
                                            Xem Chi Tiết
                                        </button>
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
                                                    {item.productInfo?.name}
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

            {showCancelModal && (
                <div className={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Xác nhận hủy đơn</h3>
                        <p className={styles.modalDesc}>
                            Bạn có chắc chắn muốn hủy đơn hàng này không?
                            <br />
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