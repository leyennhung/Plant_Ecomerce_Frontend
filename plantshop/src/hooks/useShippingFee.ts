import {useMemo} from "react";
import type {CheckoutCartItem} from "../types/checkout.type";

// Các zone giao hàng
type Zone = "Z1" | "Z2" | "Z3" | "Z4";

// Bảng giá vận chuyển theo zone và trọng lượng
const SHIPPING_TABLE: Record<Zone, {
    under2: number;
    under5: number;
    over5: number;
}> = {
    Z1: {under2: 25_000, under5: 40_000, over5: 6_000},
    Z2: {under2: 30_000, under5: 50_000, over5: 7_000},
    Z3: {under2: 40_000, under5: 65_000, over5: 9_000},
    Z4: {under2: 80_000, under5: 120_000, over5: 15_000},
};

// Map tỉnh -> zone theo nghiệp vụ vận chuyển
const ZONE_MAP = {
    Z1: [23, 24, 25],
    // Hà Nội, Hải Phòng, TP.HCM (trung tâm)

    Z2: [26, 21, 22, 33],
    // Đà Nẵng, Cần Thơ, Huế, Đồng Nai (ngoại thành gần)

    Z3: [1, 2, 5, 7, 8, 11, 13, 20, 29, 30, 34],
    // tỉnh xa hơn

    Z4: [3, 9, 19, 31],
    // Cao Bằng, Lai Châu, Sơn La, Điện Biên (đặc biệt)
};

// Xác định zone theo provinceId
function getZoneByProvinceId(provinceId: number): Zone {
    if (ZONE_MAP.Z1.includes(provinceId)) return "Z1";
    if (ZONE_MAP.Z2.includes(provinceId)) return "Z2";
    if (ZONE_MAP.Z3.includes(provinceId)) return "Z3";
    return "Z4";
}


// Hook tính phí vận chuyển
export function useShippingFee(
    provinceId: number | "",
    cartItems: CheckoutCartItem[]
) {
    return useMemo(() => {
        // Chưa chọn tỉnh hoặc giỏ hàng rỗng
        if (provinceId === "" || cartItems.length === 0) {
            return {
                shippingFee: 0,
                totalWeight: 0,
                zone: null as Zone | null,
                needContact: false,
                isTruck: false,
            };
        }

        // Tổng trọng lượng (kg)
        const totalWeight = cartItems.reduce(
            (sum, item) => sum + item.weightKg * item.quantity,
            0
        );

        // Zone luôn có
        const zone = getZoneByProvinceId(provinceId);
        const price = SHIPPING_TABLE[zone];

        let shippingFee = 0;

        if (totalWeight <= 2) {
            shippingFee = price.under2;
        } else if (totalWeight <= 5) {
            shippingFee = price.under5;
        } else {
            const extraKg = Math.ceil(totalWeight - 5);
            shippingFee = price.under5 + extraKg * price.over5;
        }

        return {
            shippingFee,
            totalWeight,
            zone,
            needContact: false,
            isTruck: totalWeight > 4,
        };
    }, [provinceId, cartItems]);
}
