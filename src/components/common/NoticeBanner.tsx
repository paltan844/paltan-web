import React, { FC, useEffect, useRef, useState } from "react";
import * as Ionicons from "react-icons/io5";
import { Colors } from "@utils/Constants";

type NoticeItem = {
  id: string;
  title: string;
  icon?: string;
};

const NoticeBanner: FC<{ items: NoticeItem[] }> = ({ items }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const index = useRef(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (!items?.length) return;

    const interval = setInterval(() => {
      if (listRef.current) {
        index.current = (index.current + 1) % items.length;
        const offset = listRef.current.clientWidth * index.current;
        listRef.current.scrollTo({ left: offset, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [items]);

  if (!items?.length) return null;

  const renderIcon = (iconName?: string) => {
    if (!iconName)
      return (
        <Ionicons.IoPricetagOutline
          size={isDesktop ? 16 : 13}
          color="#0F5132"
        />
      );

    const formatted =
      "Io" +
      iconName
        .replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase())
        .replace("Outline", "Outline");

    const IconComponent = (Ionicons as any)[formatted];

    if (IconComponent)
      return <IconComponent size={isDesktop ? 16 : 13} color="#0F5132" />;

    return (
      <Ionicons.IoPricetagOutline
        size={isDesktop ? 16 : 13}
        color="#0F5132"
      />
    );
  };

  return (
    <div
      style={{
        ...styles.wrapper,
        ...(isDesktop && styles.desktopWrapper),
      }}
    >
      <div ref={listRef} style={styles.scroller}>
        {items.map((item) => (
          <div key={item.id} style={styles.card}>
            {renderIcon(item.icon)}
            <span
              style={{
                ...styles.text,
                ...(isDesktop && styles.desktopText),
                color: Colors.lightcolor,
              }}
            >
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBanner;

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    overflow: "hidden",
    borderRadius: 6,
    width: "100%",
    backgroundColor: "rgba(204, 202, 233, 0.78)",
  },

  desktopWrapper: {
    borderRadius: 8,
    padding: "4px 0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  scroller: {
    display: "flex",
    overflowX: "hidden",
    scrollBehavior: "smooth",
  },

  card: {
    minWidth: "100%",
    padding: "8px 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: "nowrap",
  },

  desktopText: {
    fontSize: 14,
    fontWeight: 600,
  },
};