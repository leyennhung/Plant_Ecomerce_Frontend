import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../../types/category.type";
import type { ProductType } from "../../../../types/product.type";
import styles from "./FilterSidebar.module.css";
import * as Slider from "@radix-ui/react-slider";

interface Props {
    categories: Category[];
    selectedAttributes: Record<number, number>;
    onAttributeChange: (groupId: number, attrId: number) => void;

    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;

    selectedType?: ProductType | "bulk";
    onTypeChange: (type?: ProductType | "bulk") => void;
}

const MAX_PRICE = 1_000_000;

// const PRODUCT_TYPES: { value: ProductType | "bulk"; label: string }[] = [
//     { value: "plant", label: "Cây trồng" },
//     { value: "pot", label: "Chậu" },
//     { value: "seed", label: "Hạt giống" },
//     { value: "supplies", label: "Vật tư" },
//     { value: "combo", label: "Combo" },
//     { value: "bulk", label: "Giá sỉ" }
// ];

const FilterSidebar = ({
                           categories,
                           selectedAttributes,
                           onAttributeChange,
                           priceRange,
                           onPriceChange,
                           // selectedType,
                           // onTypeChange
                       }: Props) => {
    const [openCategoryIds, setOpenCategoryIds] = useState<number[]>([]);
    const navigate = useNavigate();

    const toggleCategory = (id: number) => {
        setOpenCategoryIds(prev =>
            prev.includes(id)
                ? prev.filter(cid => cid !== id)
                : [...prev, id]
        );
    };

    return (
        <aside className={styles.sidebar}>
            {/* CATEGORY (DANH MỤC) */}
            <div className={styles.filterbox}>
                <h3 className={styles.title}>DANH MỤC SẢN PHẨM</h3>

                {categories.map(category => (
                    <div key={category.id} className={styles.category}>
                        <div
                            className={styles.categoryHeader}
                            onClick={() => {
                                toggleCategory(category.id);
                                navigate(`/products/category/${category.slug}`);
                            }}>
                            <span>{category.name}</span>
                            <span className={styles.arrow}>
                                {openCategoryIds.includes(category.id) ? "⌄" : "›"}
                            </span>
                        </div>

                        {openCategoryIds.includes(category.id) &&
                            category.attribute_groups.map(group => (
                                <div key={group.group.id} className={styles.group}>
                                    <p className={styles.groupTitle}>
                                        {group.group.name}
                                    </p>

                                    {group.attributes.map(attr => {
                                        const checked =
                                            selectedAttributes[group.group.id] === attr.id;

                                        return (
                                            <label
                                                key={attr.id}
                                                className={`${styles.attribute} ${
                                                    checked ? styles.checked : ""
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name={`group-${group.group.id}`}
                                                    checked={checked}
                                                    onClick={() =>
                                                        onAttributeChange(
                                                            group.group.id,
                                                            checked ? 0 : attr.id
                                                        )
                                                    }
                                                    readOnly
                                                />
                                                <span>{attr.name}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            {/* PRICE */}
            <div className={styles.filterbox}>
                <h3 className={styles.title}>GIÁ</h3>

                <div className={styles.priceValues}>
                    <span>{priceRange[0].toLocaleString()} đ</span>
                    <span>{priceRange[1].toLocaleString()} đ</span>
                </div>

                <Slider.Root
                    className={styles.sliderRoot}
                    min={0}
                    max={MAX_PRICE}
                    step={1_000}
                    value={priceRange}
                    onValueChange={value =>
                        onPriceChange([value[0], value[1]])
                    }>
                    <Slider.Track className={styles.sliderTrack}>
                        <Slider.Range className={styles.sliderRange} />
                    </Slider.Track>
                    <Slider.Thumb className={styles.sliderThumb} />
                    <Slider.Thumb className={styles.sliderThumb} />
                </Slider.Root>
            </div>

            {/* TYPE */}
            {/*<div className={styles.filterbox}>*/}
            {/*    <h3 className={styles.title}>LOẠI SẢN PHẨM</h3>*/}
            {/*    <div className={styles.typeList}>*/}
            {/*    {PRODUCT_TYPES.map(item => {*/}
            {/*        const checked = selectedType === item.value;*/}

            {/*        return (*/}
            {/*            <label*/}
            {/*                key={item.value}*/}
            {/*                className={`${styles.typeItem} ${*/}
            {/*                    checked ? styles.checked : ""*/}
            {/*                }`}>*/}
            {/*                <input*/}
            {/*                    type="radio"*/}
            {/*                    checked={checked}*/}
            {/*                    onClick={() =>*/}
            {/*                        onTypeChange(*/}
            {/*                            checked ? undefined : item.value*/}
            {/*                        )*/}
            {/*                    }*/}
            {/*                    readOnly*/}
            {/*                />*/}
            {/*                <span>{item.label}</span>*/}
            {/*            </label>*/}
            {/*        );*/}
            {/*    })}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </aside>
    );
};

export default FilterSidebar;
