import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  memo,
  useState,
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

  const [isDesktop, setIsDesktop] = useState(false);
  const [columns, setColumns] = useState(2);

  /* ================= IMPERATIVE HANDLE ================= */

  useImperativeHandle(ref, () => ({
    reload: () => reloadDashboard(),
    scrollRef,
  }));

  /* ================= FETCH DASHBOARD ================= */

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* ================= RESPONSIVE LOGIC ================= */

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setIsDesktop(width >= 1024);

      // 🔥 Dynamic column logic (150px increase till 1600px)
      const baseWidth = 150;
      const maxWidth = 1600;

      const effectiveWidth = Math.min(width, maxWidth);

      let calculatedColumns = Math.floor(effectiveWidth / baseWidth);

      if (calculatedColumns < 2) calculatedColumns = 2;

      setColumns(calculatedColumns);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLoading =
    (sectionsLoading || productsLoading) && sections.length === 0;

  return (
    <div ref={scrollRef} style={styles.scroll}>
      <div style={styles.innerContent}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} />
          ))
        ) : (
          <>
            {sections.map((section) => {
              if (!section.categories?.length) return null;

              return (
                <section
                  key={section.mainCategory.id}
                  style={styles.sectionBlock}
                >
                  <h2
                    style={{
                      ...styles.sectionTitle,
                      ...(isDesktop && styles.desktopSectionTitle),
                    }}
                  >
                    {section.mainCategory.name}
                  </h2>

                  <CategoryContainer
                    data={section.categories}
                    mainCategory={section.mainCategory}
                  />
                </section>
              );
            })}

            {/* ================= RECOMMENDED PRODUCTS ================= */}
            <h2
              style={{
                ...styles.recommendedTitle,
                ...(isDesktop && styles.desktopRecommendedTitle),
              }}
            >
              Recommended Products
            </h2>

            <div style={styles.recommendedContainer}>
              <SearchResults
                results={products}
                loading={productsLoading}
                numColumns={columns}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
});

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  scroll: {
    width: "100%",
    backgroundColor: "rgba(203, 203, 216, 0.3)",
    overflowY: "auto",
    overflowX: "hidden",
    paddingBottom: 10,
  },

  innerContent: {
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    boxSizing: "border-box",
  },

  sectionBlock: {
    marginBottom: 20,
  },

  sectionTitle: {
    margin: 0,
    marginBottom: 10,
    paddingLeft: 4,
    color: "#111",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "Inter, Poppins, Roboto, sans-serif",
  },

  desktopSectionTitle: {
    fontSize: 18,
    fontWeight: 600,
  },

  recommendedTitle: {
    margin: "18px 0",
    paddingLeft: 4,
    color: "#111",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: Fonts.SemiBold,
  },

  desktopRecommendedTitle: {
    fontSize: 20,
  },

  recommendedContainer: {
    width: "95%",
    margin: "0 auto",
  },
};

ContentComponent.displayName = "Content";
export default memo(ContentComponent);