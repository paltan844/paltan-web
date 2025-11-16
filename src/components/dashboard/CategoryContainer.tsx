import React from "react";
import { useNavigate } from "react-router-dom";

interface Category {
  id?: string;
  _id?: string;
  name: string;
  image: string;
  navigateTo?: string;
}


interface Props {
  data: Category[];
  mainCategory: any;
}

const CategoryContainer: React.FC<Props> = ({ data, mainCategory }) => {
  const navigate = useNavigate();

  const handleClick = (category: Category) => {
    navigate(`/productcategories/${category.navigateTo || category.id}`, {
      state: { category, mainCategory },
    });
  };

  const renderItems = (items: Category[]) =>
    items.map((item) => (
      <div key={item._id} style={styles.item} onClick={() => handleClick(item)}>
        <div style={styles.imageContainer}>
          <img src={item.image} alt={item.name} style={styles.image} />
        </div>
        <div style={styles.textWrapper}>
          <p style={styles.text}>{item.name}</p>
        </div>
      </div>
    ));

  return (
    <div style={styles.container}>
      <div style={styles.row}>{renderItems(data.slice(0, 4))}</div>
      <div style={styles.row}>{renderItems(data.slice(4, 8))}</div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
      `}</style>
    </div>
  );
};

/* ✅ Styles — Clean, Aligned Two-Line Text */
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
    width: "22%",
    textAlign: "center",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    padding: 3,
  },
  image: {
    width: "95%",
    height: "95%",
    objectFit: "contain",
    borderRadius: 4,
  },

  /* ✅ Added wrapper for consistent block centering */
  textWrapper: {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  text: {
    fontSize: 9.5,
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
    minHeight: "2.6em", // ensures 2 lines top aligned
  },
};

export default CategoryContainer;
