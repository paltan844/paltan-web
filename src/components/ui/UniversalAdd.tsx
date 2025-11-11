import React, { FC } from "react";
import { Plus, Minus } from "lucide-react";
import { Fonts, Colors } from "@utils/Constants";
import { useCartStore } from "@state/cartStore";
import CustomText from "@components/ui/CustomText";

interface UniversalAddProps {
  item: any;
}

const UniversalAdd: FC<UniversalAddProps> = ({ item }) => {
  const id = item?._id || item?.id;
  const stock = item?.stock ?? 0;

  const count = useCartStore((state) =>
    id ? state.cart.find((c) => c._id === id)?.count || 0 : 0
  );

  const { addItem, removeItem } = useCartStore();

  if (!id) return null;

  if (stock === 0) {
    return (
      <div
        style={{
          ...styles.container,
          borderColor: "gray",
          backgroundColor: "#fff",
        }}
        onClick={(e) => e.stopPropagation()} // ✅ prevent parent click
      >
        <CustomText
          variant="h9"
          fontFamily={Fonts.SemiBold}
          style={{ color: "rgba(235, 196, 172, 1)" }}
        >
          Out of Stock
        </CustomText>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: count === 0 ? "#fff" : Colors.blue,
      }}
      onClick={(e) => e.stopPropagation()} // ✅ critical
    >
      {count === 0 ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // ✅ prevent card navigation
            addItem(item);
          }}
          style={styles.add as any}
        >
          <CustomText
            variant="h9"
            fontFamily={Fonts.SemiBold}
            style={styles.addText as any}
          >
            ADD
          </CustomText>
        </button>
      ) : (
        <div style={styles.countercontainer}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // ✅ stop parent navigation
              removeItem(id);
            }}
            style={styles.iconButton as any}
          >
            <Minus color="#fff" size={13} strokeWidth={2} />
          </button>

          <CustomText
            fontFamily={Fonts.SemiBold}
            variant="h8"
            style={styles.text as any}
          >
            {count}
          </CustomText>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // ✅ stop bubbling
              if (count < stock) addItem(item);
            }}
            disabled={count >= stock}
            style={{
              ...styles.iconButton,
              opacity: count >= stock ? 0.6 : 1,
              cursor: count >= stock ? "not-allowed" : "pointer",
            } as any}
          >
            <Plus
              color={count >= stock ? "#ccc" : "#fff"}
              size={13}
              strokeWidth={2}
            />
          </button>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    transition: "background-color 0.2s ease",
  },
  add: {
    width: "100%",
    padding: "6px 4px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    outline: "none",
  },
  addText: {
    color: Colors.secondary,
    letterSpacing: 0.5,
  },
  countercontainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    padding: "5px 4px",
    flexDirection: "row",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
    outline: "none",
  },
};

export default UniversalAdd;
