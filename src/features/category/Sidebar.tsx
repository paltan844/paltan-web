/*
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
*/




import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Platform } from "react-native";

interface SidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const isWeb = Platform.OS === "web";

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const ITEM_WIDTH = 90;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -ITEM_WIDTH * 3,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: ITEM_WIDTH * 3,
      behavior: "smooth",
    });
  };

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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "rgba(193,208,200,0.5)",
        borderBottom: "1px solid #eee",
        padding: "1px",
        position: "sticky",
        top: 70,
        zIndex: 50,
      }}
    >
      {categories.length > 0 && (
        <button
          onClick={scrollLeft}
          style={{ padding: 0, border: "none", background: "none" }}
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
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          flex: 1,
        }}
      >
        {categories.map((category) => {
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
                  e.preventDefault(); // SPA safe
                  onCategoryPress(category);
                }}
              >
                {children}
              </a>
            ) : (
              <div onClick={() => onCategoryPress(category)}>{children}</div>
            );

          return (
            <Wrapper key={category._id}>
              <div
                style={{
                  width: ITEM_WIDTH,
                  flexShrink: 0,
                  textAlign: "center",
                  cursor: "pointer",
                  padding: 4,
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
                    width: 75,
                    margin: "6px auto 0",
                    fontSize: 9,
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
          style={{ padding: 0, border: "none", background: "none" }}
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
