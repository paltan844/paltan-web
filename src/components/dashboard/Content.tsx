import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  memo,
} from "react";
import { Fonts } from "@utils/Constants";
import CategoryContainer from "./CategoryContainer";
import SearchResults from "./SearchResult";
import Skeleton from "./Skeleton";
import { useDashboardStore } from "@state/dashboardStore";

export type ContentRef = {
  reload: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
};


const ContentComponent = forwardRef<ContentRef>((_props, ref) => {
  const {
    sections,
    products,
    sectionsLoading,
    productsLoading,
    fetchDashboard,
    reloadDashboard,
  } = useDashboardStore();

  const scrollRef = useRef<HTMLDivElement>(null);

 useImperativeHandle(ref, () => ({
  reload: () => reloadDashboard(),
  scrollRef, // ✅ expose scrollRef to parent
}));


  /* ✅ Fetch dashboard data on mount */
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* ✅ Inject cross-browser scrollbar hiding CSS */
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "hide-scrollbar-styles";
    style.innerHTML = `
      .hide-scrollbar-container {
        -ms-overflow-style: none; /* IE & Edge */
        scrollbar-width: none; /* Firefox */
      }
      .hide-scrollbar-container::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
        background: transparent;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existing = document.getElementById("hide-scrollbar-styles");
      if (existing) existing.remove();
    };
  }, []);

  const isLoading =
    (sectionsLoading || productsLoading) && sections.length === 0;

  /* ------------------ UI ------------------ */
  return (
    <div
      ref={scrollRef}
      className="hide-scrollbar-container"
      style={styles.scroll}
    >
      <div style={styles.innerContent}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} />)
        ) : (
          <>
            {/* ✅ Render Sections */}
            {sections.map((section) => {
              if (!section.categories || section.categories.length === 0)
                return null;
              return (
                <div key={section.mainCategory.id} style={styles.sectionBlock}>
                  <h5 style={styles.sectionTitle}>
                    {section.mainCategory.name}
                  </h5>

                  <CategoryContainer
                    data={section.categories} 
                    mainCategory={section.mainCategory}
                  />

                </div>
              );
            })}

            <h5 style={styles.recommendedTitle}>Recommended Products</h5>

            <div style={styles.recommendedContainer}>
              <SearchResults
                results={products}
                loading={productsLoading}
                numColumns={2}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
});
const styles: Record<string, React.CSSProperties> = {
  scroll: {
    width: "100%",
    backgroundColor: "rgba(203, 203, 216, 0.3)",
    overflowY: "auto",
    overflowX: "hidden",
    paddingBottom: 10,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  innerContent: {
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    boxSizing: "border-box",
  },
  sectionBlock: {
    marginBottom: 15,
  },
  sectionTitle: {
    margin: 0,
    marginBottom: 8,
    paddingLeft: 4,
    color: "#111",
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "Inter, Poppins, Roboto, sans-serif",
    letterSpacing: "0.2px",
  },
  recommendedTitle: {
    margin: 0,
    marginBottom: 10,
    paddingLeft: 4,
    color: "#111",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: Fonts.SemiBold,
  },
  recommendedContainer: {
    width: "90%",
    margin: "0 auto",
    padding: "0 10px",
  },
};

ContentComponent.displayName = "Content";

export default memo(ContentComponent);
