import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Platform } from "react-native";

interface SidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const isWeb = Platform.OS === "web";
const BATCH_SIZE = 16;

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [fontSize, setFontSize] = useState(9);
  const [itemWidth, setItemWidth] = useState(90);
  const [gapSize, setGapSize] = useState(4);

  /* ===============================
     Responsive Logic
  =============================== */
  useEffect(() => {
    const updateResponsive = () => {
      const width = window.innerWidth;

      if (width >= 1200) {
        setFontSize(11);
        setItemWidth(110);
        setGapSize(10);
      } else if (width >= 900) {
        setFontSize(10);
        setItemWidth(100);
        setGapSize(8);
      } else if (width >= 650) {
        setFontSize(10);
        setItemWidth(95);
        setGapSize(6);
      } else {
        setFontSize(9);
        setItemWidth(90);
        setGapSize(4);
      }
    };

    updateResponsive();
    window.addEventListener("resize", updateResponsive);
    return () => window.removeEventListener("resize", updateResponsive);
  }, []);

  /* Reset batch */
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [categories]);

  /* Auto center active */
  useEffect(() => {
    if (!selectedCategory?._id || !scrollRef.current) return;

    setTimeout(() => {
      const idx = categories.findIndex(
        (c) => c._id === selectedCategory._id
      );
      if (idx !== -1 && scrollRef.current?.children[idx]) {
        (scrollRef.current.children[idx] as HTMLElement).scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }
    }, 80);
  }, [selectedCategory, categories]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -itemWidth * 3,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: itemWidth * 3,
      behavior: "smooth",
    });

    if (visibleCount < categories.length) {
      setVisibleCount((prev) => prev + BATCH_SIZE);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "rgba(193,208,200,0.5)",
        borderBottom: "1px solid #eee",
        padding: "4px 0",
        position: "sticky",
        top: 70,
        zIndex: 50,
      }}
    >
      {categories.length > 0 && (
        <button
          onClick={scrollLeft}
          style={{ border: "none", background: "none" }}
        >
          <ChevronLeft size={14} />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (
            el.scrollLeft + el.clientWidth >= el.scrollWidth - 50 &&
            visibleCount < categories.length
          ) {
            setVisibleCount((prev) => prev + BATCH_SIZE);
          }
        }}
        style={{
          display: "flex",
          overflowX: "auto",
          flex: 1,
          gap: gapSize, // 👈 dynamic gap
        }}
      >
        {categories.slice(0, visibleCount).map((category) => {
          const isActive = selectedCategory?._id === category._id;
          const url = `/productcategory/${category._id}`;

          const Wrapper: React.FC<{ children: React.ReactNode }> = ({
            children,
          }) =>
            isWeb ? (
              <a
                href={url}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={(e) => {
                  e.preventDefault();
                  onCategoryPress(category);
                }}
              >
                {children}
              </a>
            ) : (
              <div onClick={() => onCategoryPress(category)}>
                {children}
              </div>
            );

          return (
            <Wrapper key={category._id}>
              <div
                style={{
                  width: itemWidth,
                  flexShrink: 0,
                  textAlign: "center",
                  cursor: "pointer",
                  padding: gapSize,
                  transition: "transform 0.2s ease",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                <div
                  style={{
                    width: 45,
                    height: 30,
                    margin: "0 auto",
                    borderRadius: 8,
                    background: isActive ? "#d9f0e6" : "#f4f4f4",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: isActive
                      ? "1.5px solid #6b8e23"
                      : "1px solid transparent",
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    style={{
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <p
                  style={{
                    width: "100%",
                    margin: "6px auto 0",
                    fontSize: fontSize,
                    fontWeight: 400,
                    color: "#111",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {category.name}
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>

      {categories.length > 0 && (
        <button
          onClick={scrollRight}
          style={{ border: "none", background: "none" }}
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;