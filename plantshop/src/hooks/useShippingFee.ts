import {useMemo} from "react";
import type {CheckoutCartItem} from "../types/checkout.type";

// Các zone giao hàng
type Zone = "Z1" | "Z2" | "Z3" | "Z4";

// Bảng giá vận chuyển theo zone và trọng lượng
// under2  : ≤ 2kg
// under5  : >2kg và ≤5kg
// over5   : giá mỗi kg vượt quá 5kg
const SHIPPING_TABLE = {
    Z1: {under2: 25000, under5: 40000, over5: 6000},
    Z2: {under2: 30000, under5: 50000, over5: 7000},
    Z3: {under2: 40000, under5: 65000, over5: 9000},
};

// Map provinceId -> zone giao hàng
// Z4 là khu vực đặc biệt, cần liên hệ báo phí
const PROVINCE_ZONE_MAP: Record<number, Zone> = {
    1: "Z1",
    2: "Z2",
    3: "Z3",
    4: "Z4",
};

// Hook tính phí vận chuyển dựa trên tỉnh/thành và giỏ hàng
export function useShippingFee(
    provinceId: number | "",
    cartItems: CheckoutCartItem[]
) {
    return useMemo(() => {
        // Chưa chọn tỉnh hoặc giỏ hàng rỗng -> không tính phí
        if (!provinceId || cartItems.length === 0) {
            return {
                shippingFee: 0,
                totalWeight: 0,
                zone: null as Zone | null,
                needContact: false,
                isTruck: false,
            };
        }

        // Tính tổng trọng lượng đơn hàng (kg)
        const totalWeight = cartItems.reduce(
            (sum, item) => sum + item.weightKg * item.quantity,
            0
        );

        // Xác định zone theo provinceId
        const zone = PROVINCE_ZONE_MAP[provinceId];

        // provinceId không map được zone
        if (!zone) {
            return {
                shippingFee: 0,
                totalWeight,
                zone: null,
                needContact: true,
                isTruck: totalWeight > 4,
            };
        }

        // Khu vực Z4: cần liên hệ để báo phí vận chuyển
        if (zone === "Z4") {
            return {
                shippingFee: 0,
                totalWeight,
                zone,
                needContact: true,
                // Đơn nặng → vận chuyển bằng xe tải
                isTruck: totalWeight > 4,
            };
        }

        // Lấy bảng giá theo zone
        const price = SHIPPING_TABLE[zone];
        let shippingFee = 0;

        // Tính phí theo mốc trọng lượng
        if (totalWeight <= 2) {
            shippingFee = price.under2;
        } else if (totalWeight <= 5) {
            shippingFee = price.under5;
        } else {
            // Trên 5kg: cộng thêm phí cho mỗi kg vượt
            const extraKg = Math.ceil(totalWeight - 5);
            shippingFee = price.under5 + extraKg * price.over5;
        }

        return {
            shippingFee,
            totalWeight,
            zone,
            needContact: false,
            // Đơn nặng -> xe tải
            isTruck: totalWeight > 4,
        };
    }, [provinceId, cartItems]);
}
