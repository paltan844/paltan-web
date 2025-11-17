import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const ITEM_WIDTH = 90;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -ITEM_WIDTH * 3, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: ITEM_WIDTH * 3, behavior: "smooth" });
    }
  };

useEffect(() => {
  if (!selectedCategory?._id) return;

  const container = scrollRef.current;
  if (!container) return;

  setTimeout(() => {
    const idx = categories.findIndex((c) => c._id === selectedCategory._id);
    if (idx !== -1 && container.children[idx]) {
      const el = container.children[idx] as HTMLElement;
      el.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, 80);
}, [selectedCategory, categories]);



  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "rgba(193,208,200,0.5)",
        borderBottom: "1px solid #eee",
        padding: "1px 1px",
        position: "sticky",
        top: 70,
        zIndex: 50,
      }}
    >
      {categories.length > 0 && (
        <button
          onClick={scrollLeft}
          style={{
             padding:0,
            border: "none",
            background: "none",
            cursor: "pointer",
            marginRight: 2,
          }}
        >
          <ChevronLeft size={14} />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={(e) => setScrollX(e.currentTarget.scrollLeft)}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          flex: 1,
        }}
      >
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => onCategoryPress(category)}
            style={{
              width: ITEM_WIDTH,
              flexShrink: 0,
              textAlign: "center",
              cursor: "pointer",
              padding: 4,
              transition: "transform 0.2s ease",
              transform:
                selectedCategory?._id === category._id
                  ? "scale(1.05)"
                  : "scale(1)",
            }}
          >
            <div
              style={{
                width: 45,
                height: 30,
                margin: "0 auto",
                borderRadius: 8,
                background:
                  selectedCategory?._id === category._id
                    ? "#d9f0e6"
                    : "#f4f4f4",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                border:
                  selectedCategory?._id === category._id
                    ? "1.5px solid #6b8e23"
                    : "1px solid transparent",
                boxShadow:
                  selectedCategory?._id === category._id
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "none",
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: "80%",
                  height: "80%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* ✅ Text limited to image width with truncation */}
            <p
              style={{
                width: 75,
                margin: "6px auto 0",
                fontSize: 9,
                fontWeight: 300,
                color: "#111",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {category.name}
            </p>
          </div>
        ))}
      </div>

      {categories.length > 0 && (
        <button
          onClick={scrollRight}
          style={{
            padding:0,
            border: "none",
            background: "none",
            cursor: "pointer",
            marginLeft: 2,
          }}
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
