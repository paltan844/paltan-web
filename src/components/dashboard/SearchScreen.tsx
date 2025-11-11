import React, { useState, useEffect, useCallback } from "react";
import { IoArrowBackOutline, IoClose, IoMicOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllProducts } from "@service/productService";
import { Colors } from "@utils/Constants";
import SearchResults from "./SearchResult";
import WithCart from "@features/cart/WithCart";
import { useCartStore } from "@state/cartStore";

const SearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const LIMIT = 20;
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = useCartStore(
    (state) => state.cart.reduce((acc, item) => acc + item.count, 0)
  );

  // ✅ Fetch all products
  const fetchProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const data = await getAllProducts(pageNum, LIMIT);
      const enriched = data.map((item: any) => ({
        ...item,
        categoryId: item?.categoryId?._id || "",
        navigateTo: item?.categoryId?.navigateTo || "",
      }));
      setProducts((prev) => (pageNum === 1 ? enriched : [...prev, ...enriched]));
      if (enriched.length < LIMIT) setHasMore(false);
    } catch (err) {
      console.warn("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  // ✅ Filter products based on search
  const filterResults = useCallback(() => {
    if (!searchTerm.trim()) {
      setResults(products);
      return;
    }
    const filtered = products
      .filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(
        (a, b) =>
          a.name.toLowerCase().indexOf(searchTerm.toLowerCase()) -
          b.name.toLowerCase().indexOf(searchTerm.toLowerCase())
      );
    setResults(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    const timer = setTimeout(filterResults, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterResults]);

  useEffect(() => {
    setResults(products);
  }, [products]);

  // ✅ Scroll Pagination
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20 && hasMore && !loadingMore) {
      setLoadingMore(true);
      fetchProducts(page + 1).then(() => {
        setPage((prev) => prev + 1);
        setLoadingMore(false);
      });
    }
  };

  // ✅ Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setResults(products);
  };

  return (
    <div style={styles.wrapper}>
      {/* ✅ Search Bar */}
      <div style={styles.searchHeader}>
        <button onClick={() => navigate(-1)} style={styles.iconButton}>
          <IoArrowBackOutline size={20} color={Colors.text} />
        </button>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
            autoFocus
          />
        </div>

        {searchTerm.length > 0 ? (
          <button onClick={handleClearSearch} style={styles.iconButton}>
            <IoClose size={20} color="rgba(255,0,0,0.7)" />
          </button>
        ) : (
          <button style={styles.iconButton}>
            <IoMicOutline size={20} color={Colors.text} />
          </button>
        )}
      </div>

      {/* ✅ Results Section */}
      <div
        style={{
          ...styles.resultsContainer,
          marginBottom: cartCount > 0 ? 60 : 0,
        }}
        onScroll={handleScroll}
      >
        {!loading && searchTerm.trim() && (
          <p style={styles.resultCount}>{results.length} results found</p>
        )}

        <SearchResults results={results} loading={loading} numColumns={2} />

        {loadingMore && (
          <p style={{ textAlign: "center", padding: 10 }}>Loading more...</p>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    width: "100%",
    height: "100vh",
   // backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  searchHeader: {
    display: "flex",
    alignItems: "center",
    padding: "8px 10px",
    backgroundColor: "#fff",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
  },
  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F3F4F7",
    borderRadius: 8,
    border: "1px solid #ddd",
    padding: "4px 10px",
    marginRight: 6,
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    backgroundColor: "transparent",
  },
  resultsContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  },
  resultCount: {
    color: "gray",
    fontSize: 13,
    marginBottom: 10,
    paddingLeft: 4,
  },
};

export default WithCart(SearchScreen);
