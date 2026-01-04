import { useState } from "react";
import type { Category } from "../../../../types/category.type";
import styles from "./FilterSidebar.module.css";
import * as Slider from "@radix-ui/react-slider";


interface Props {
    categories: Category[];
    selectedCategoryId?: number;
    selectedAttributes: Record<number, number>;
    onCategoryChange: (id: number) => void;
    onAttributeChange: (groupId: number, attrId: number) => void;
    //lọc theo giá
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
}
const MAX_PRICE = 1_000_000;

// SLIDE1: DANH MỤC
const FilterSidebar = ({
                           categories,
                           selectedCategoryId,
                           selectedAttributes,
                           onCategoryChange,
                           onAttributeChange,
                           priceRange,
                           onPriceChange,
                       }: Props) => {
    const [openCategoryIds, setOpenCategoryIds] = useState<number[]>([]);

    const toggleCategory = (id: number) => {
        setOpenCategoryIds(prev =>
            prev.includes(id)
                ? prev.filter(cid => cid !== id)
                : [...prev, id]
        );
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.filterbox}>
                {/*TITLE*/}
                <h3 className={styles.title}>DANH MỤC SẢN PHẨM</h3>
                {/*DANH MỤC*/}
                {categories.map(category => (
                    <div key={category.id} className={styles.category}>
                        <div
                            className={`${styles.categoryHeader} ${
                                selectedCategoryId === category.id ? styles.active : ""
                            }`}
                            onClick={() => {
                                toggleCategory(category.id);
                                onCategoryChange(category.id);
                            }}
                        >
                            <span>{category.name}</span>
                            <span className={styles.arrow}>
              {openCategoryIds.includes(category.id) ? "⌄" : "›"}
            </span>
                        </div>

                        {openCategoryIds.includes(category.id) &&
                            category.attribute_groups.map(group => (
                                <div key={group.group.id} className={styles.group}>
                                    <p className={styles.groupTitle}>{group.group.name}</p>

                                    {group.attributes.map(attr => {
                                        const checked =
                                            selectedAttributes[group.group.id] === attr.id;

                                        return (
                                            <label key={attr.id}
                                                   className={`${styles.attribute} ${checked ? styles.checked : ""}`}>
                                                <input
                                                    type="radio"
                                                    name={`group-${group.group.id}`}
                                                    checked={checked}
                                                    onClick={() => {
                                                        if (checked) {
                                                            onAttributeChange(group.group.id, 0); // 0=bỏ chonj
                                                        } else {
                                                            onAttributeChange(group.group.id, attr.id)
                                                        }
                                                    }}
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

                {/*    PRICE*/}
                <div className={styles.filterbox}>
                    <div className={styles.priceBox}>
                        <div className={styles.priceHeader}>
                            <span>Giá</span>
                        </div>

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
                            onValueChange={(value) =>
                                onPriceChange([value[0], value[1]])
                            }
                        >
                            <Slider.Track className={styles.sliderTrack}>
                                <Slider.Range className={styles.sliderRange} />
                            </Slider.Track>

                            <Slider.Thumb className={styles.sliderThumb} />
                            <Slider.Thumb className={styles.sliderThumb} />
                        </Slider.Root>
                    </div>
                </div>

        </aside>
    );
};

export default FilterSidebar;
