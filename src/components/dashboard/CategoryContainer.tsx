import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Category {
  id?: string;
  _id?: string;
  name: string;
  image: string;
  slug?: string;
}

interface Props {
  data: Category[];
  mainCategory: any;
}

const CategoryContainer: React.FC<Props> = ({ data, mainCategory }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buildUrl = (item: Category) =>
    `/productcategories/${item.slug}`;

  const itemsPerRow = isDesktop ? 6 : 4;

  const renderItems = (items: Category[]) =>
    items.map((item) => (
      <Link
        key={item._id || item.id}
        to={buildUrl(item)}
        state={{ category: item, mainCategory }}
        style={{
          ...styles.item,
          width: isDesktop ? "15.5%" : "22%",
        }}
      >
        <div
          style={{
            ...styles.imageContainer,
            ...(isDesktop && styles.desktopImageContainer),
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            style={styles.image}
          />
        </div>

        <div style={styles.textWrapper}>
          <p
            style={{
              ...styles.text,
              ...(isDesktop && styles.desktopText),
            }}
          >
            {item.name}
          </p>
        </div>
      </Link>
    ));

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        {renderItems(data.slice(0, itemsPerRow))}
      </div>

      <div style={styles.row}>
        {renderItems(data.slice(itemsPerRow, itemsPerRow * 2))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: "5px 0",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  item: {
    textAlign: "center",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none",
    color: "inherit",
  },

  imageContainer: {
    width: "100%",
    height: 70, // 📱 Mobile height
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    padding: 3,
  },

  desktopImageContainer: {
    height: 100, // 💻 Laptop height bigger
  },

  image: {
    width: "95%",
    height: "95%",
    objectFit: "contain",
    borderRadius: 4,
  },

  textWrapper: {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  text: {
    fontSize: 9.5, // 📱 Mobile size
    fontWeight: 400,
    margin: 0,
    lineHeight: "1.3em",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    color: "#222",
    textAlign: "left",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    minHeight: "2.6em",
  },

  desktopText: {
    fontSize: 13, // 💻 Laptop bigger text
    fontWeight: 500,
  },
};

export default CategoryContainer;