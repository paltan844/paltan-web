/*
import React, { useEffect, useRef } from "react";

interface FooterSidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const FooterSidebar: React.FC<FooterSidebarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedCategory?._id || !listRef.current) return;

    const container = listRef.current;
    const activeItem = container.querySelector(
      `[data-id="${selectedCategory._id}"]`
    ) as HTMLElement;

    if (activeItem) {
      const itemTop = activeItem.offsetTop;
      const itemBottom = itemTop + activeItem.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (itemTop < containerTop || itemBottom > containerBottom) {
        container.scrollTo({
          top: itemTop - container.clientHeight / 2 + activeItem.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [selectedCategory]);

  return (
    <div
      ref={listRef}
      style={{
        width: "85px",
        position: "fixed",
        top: "60px",
        left: 0,
        bottom: 0,
        background: "rgba(193, 208, 200, 0.45)",
        borderRight: "1px solid #e5e5e5",
        overflowY: "auto",
        padding: "4px 0 40px 0",
        scrollBehavior: "smooth",
        zIndex: 100,
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      {categories.map((category) => {
        const isActive =
          selectedCategory?._id === category?._id ||
          selectedCategory?.id === category?._id;

        return (
          <div
            key={category._id || category.id}
            data-id={category._id}
            onClick={() => onCategoryPress(category)}
            style={{
              cursor: "pointer",
              padding: "8px 6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "#EAFBEF" : "transparent",
              borderLeft: isActive
                ? "4px solid #6b8e23"
                : "4px solid transparent",
              transition: "all 0.25s ease",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: isActive ? "#d9f0e6" : "#f7f7f7",
                border: isActive ? "1.5px solid #6b8e23" : "1px solid #ddd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                marginBottom: 5,
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: "65%",
                  height: "65%",
                  objectFit: "contain",
                  userSelect: "none",
                }}
              />
            </div>

            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#222",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "13px",
                height: "26px",
                width: "100%",
                margin: 0,
                padding: "0 2px",
                textAlign: "center",
              }}
            >
              {category.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FooterSidebar;
*/

//slug se phle wala code 
/*
import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";

interface FooterSidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const isWeb = Platform.OS === "web";

const FooterSidebar: React.FC<FooterSidebarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedCategory?._id || !listRef.current) return;

    const container = listRef.current;
    const activeItem = container.querySelector(
      `[data-id="${selectedCategory._id}"]`
    ) as HTMLElement | null;

    if (activeItem) {
      const itemTop = activeItem.offsetTop;
      const itemBottom = itemTop + activeItem.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (itemTop < containerTop || itemBottom > containerBottom) {
        container.scrollTo({
          top:
            itemTop -
            container.clientHeight / 2 +
            activeItem.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [selectedCategory]);

  return (
    <div
      ref={listRef}
      style={{
        width: "85px",
        position: "fixed",
        top: "60px",
        left: 0,
        bottom: 0,
        background: "rgba(193, 208, 200, 0.45)",
        borderRight: "1px solid #e5e5e5",
        overflowY: "auto",
        padding: "4px 0 40px 0",
        zIndex: 100,
      }}
    >
      {categories.map((category) => {
        const isActive =
          selectedCategory?._id === category?._id ||
          selectedCategory?.id === category?._id;

        const categoryUrl = `/productcategory/${category._id || category.id}`;

        const Wrapper: React.FC<{ children: React.ReactNode }> = ({
          children,
        }) =>
          isWeb ? (
            <a
              href={categoryUrl}
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={(e) => {
                e.preventDefault();
                onCategoryPress(category);
              }}
            >
              {children}
            </a>
          ) : (
            <div onClick={() => onCategoryPress(category)}>{children}</div>
          );

        return (
          <Wrapper key={category._id || category.id}>
            <div
              data-id={category._id}
              style={{
                cursor: "pointer",
                padding: "8px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: isActive ? "#EAFBEF" : "transparent",
                borderLeft: isActive
                  ? "4px solid #6b8e23"
                  : "4px solid transparent",
                transition: "all 0.25s ease",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: isActive ? "#d9f0e6" : "#f7f7f7",
                  border: isActive
                    ? "1.5px solid #6b8e23"
                    : "1px solid #ddd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  marginBottom: 5,
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  style={{
                    width: "65%",
                    height: "65%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#222",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "13px",
                  height: "26px",
                  width: "100%",
                  margin: 0,
                  padding: "0 2px",
                  textAlign: "center",
                }}
              >
                {category.name}
              </p>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
};

export default FooterSidebar;
*/

/*
import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";

interface FooterSidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const isWeb = Platform.OS === "web";

const FooterSidebar: React.FC<FooterSidebarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  /* 🔄 Auto scroll active item /
  useEffect(() => {
    if (!selectedCategory?._id || !listRef.current) return;

    const container = listRef.current;
    const activeItem = container.querySelector(
      `[data-id="${selectedCategory._id}"]`
    ) as HTMLElement | null;

    if (activeItem) {
      const itemTop = activeItem.offsetTop;
      const itemBottom = itemTop + activeItem.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (itemTop < containerTop || itemBottom > containerBottom) {
        container.scrollTo({
          top:
            itemTop -
            container.clientHeight / 2 +
            activeItem.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [selectedCategory]);

  return (
    <div
      ref={listRef}
      style={{
        width: "85px",
        position: "fixed",
        top: "60px",
        left: 0,
        bottom: 0,
        background: "rgba(193, 208, 200, 0.45)",
        borderRight: "1px solid #e5e5e5",
        overflowY: "auto",
        padding: "4px 0 40px 0",
        zIndex: 100,
      }}
    >
      {categories.map((category) => {
        const isActive = selectedCategory?._id === category?._id;

        // ✅ SLUG BASED URL (IMPORTANT)
        const categoryUrl = `/productcategory/${category.slug}`;

        const Wrapper: React.FC<{ children: React.ReactNode }> = ({
          children,
        }) =>
          isWeb ? (
            <a
              href={categoryUrl}
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
              data-id={category._id}
              style={{
                cursor: "pointer",
                padding: "8px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: isActive ? "#EAFBEF" : "transparent",
                borderLeft: isActive
                  ? "4px solid #6b8e23"
                  : "4px solid transparent",
                transition: "all 0.25s ease",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: isActive ? "#d9f0e6" : "#f7f7f7",
                  border: isActive
                    ? "1.5px solid #6b8e23"
                    : "1px solid #ddd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  marginBottom: 5,
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  style={{
                    width: "65%",
                    height: "65%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#222",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "13px",
                  height: "26px",
                  width: "100%",
                  margin: 0,
                  padding: "0 2px",
                  textAlign: "center",
                }}
              >
                {category.name}
              </p>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
};

export default FooterSidebar;

*/


import React, { useEffect, useRef, useState } from "react";

interface FooterSidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const BATCH_SIZE = 16;

const FooterSidebar: React.FC<FooterSidebarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  /* Reset when categories change */
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [categories]);

  /* Auto scroll active item into view */
  useEffect(() => {
    if (!selectedCategory?._id || !listRef.current) return;

    const container = listRef.current;
    const activeItem = container.querySelector(
      `[data-id="${selectedCategory._id}"]`
    ) as HTMLElement;

    if (activeItem) {
      const itemTop = activeItem.offsetTop;
      const itemBottom = itemTop + activeItem.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (itemTop < containerTop || itemBottom > containerBottom) {
        container.scrollTo({
          top:
            itemTop -
            container.clientHeight / 2 +
            activeItem.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [selectedCategory]);

  return (
    <div
      ref={listRef}
      onScroll={(e) => {
        const el = e.currentTarget;

        // Load next batch when near bottom
        if (
          el.scrollTop + el.clientHeight >= el.scrollHeight - 40 &&
          visibleCount < categories.length
        ) {
          setVisibleCount((prev) => prev + BATCH_SIZE);
        }
      }}
      style={{
        width: "85px",
        position: "fixed",
        top: "60px",
        left: 0,
        bottom: 0,
        background: "rgba(193, 208, 200, 0.45)",
        borderRight: "1px solid #e5e5e5",
        overflowY: "auto",
        padding: "4px 0 40px 0",
        scrollBehavior: "smooth",
        zIndex: 100,
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      {categories.slice(0, visibleCount).map((category) => {
        const isActive =
          selectedCategory?._id === category?._id ||
          selectedCategory?.id === category?._id;

        return (
          <div
            key={category._id || category.id}
            data-id={category._id}
            onClick={() => onCategoryPress(category)}
            style={{
              cursor: "pointer",
              padding: "8px 6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "#EAFBEF" : "transparent",
              borderLeft: isActive
                ? "4px solid #6b8e23"
                : "4px solid transparent",
              transition: "all 0.25s ease",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: isActive ? "#d9f0e6" : "#f7f7f7",
                border: isActive ? "1.5px solid #6b8e23" : "1px solid #ddd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                marginBottom: 5,
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: "65%",
                  height: "65%",
                  objectFit: "contain",
                  userSelect: "none",
                }}
              />
            </div>

            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#222",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "13px",
                height: "26px",
                width: "100%",
                margin: 0,
                padding: "0 2px",
                textAlign: "center",
              }}
            >
              {category.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FooterSidebar;
