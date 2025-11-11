import React, { FC, useEffect, useRef } from "react";
import * as Ionicons from "react-icons/io5";
import { Colors, Fonts } from "@utils/Constants";

type NoticeItem = {
  id: string;
  title: string;
  icon?: string;
};

const NoticeBanner: FC<{ items: NoticeItem[] }> = ({ items }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const index = useRef(0);

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

  /* ✅ Helper: Render icon dynamically using backend name */
  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Ionicons.IoPricetagOutline size={13} color="#0F5132" />;

    // Convert "bicycle-outline" → "IoBicycleOutline"
    const formatted =
      "Io" +
      iconName
        .replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase())
        .replace("Outline", "Outline"); // ensures case match

    const IconComponent = (Ionicons as any)[formatted];
    if (IconComponent) return <IconComponent size={13} color="#0F5132" />;

    // fallback
    return <Ionicons.IoPricetagOutline size={13} color="#0F5132" />;
  };


  return (
    <div style={styles.wrapper}>
      <div ref={listRef} style={styles.scroller}>
        {items.map((item) => (
          <div key={item.id} style={styles.card}>
          {renderIcon(item.icon)}
            <span
              style={{
                ...styles.text,
                color: Colors.lightcolor,
                fontFamily: "Inter, Poppins, Roboto, sans-serif",
                
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
    borderRadius: 4,
    width: "100%",
    backgroundColor: "rgba(204, 202, 233, 0.78)",
  },
  scroller: {
    display: "flex",
    overflowX: "hidden",
    scrollBehavior: "smooth",
  },
  card: {
    minWidth: "100%",
    padding: "6px 1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
};
