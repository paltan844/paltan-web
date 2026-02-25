/*
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



  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);


  useEffect(() => {
    const style = document.createElement("style");
    style.id = "hide-scrollbar-styles";
    style.innerHTML = `
      .hide-scrollbar-container {
        -ms-overflow-style: none; 
        scrollbar-width: none; 
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
*/


/*
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
    scrollRef,
  }));


  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const isLoading =
    (sectionsLoading || productsLoading) && sections.length === 0;

  return (
    <div ref={scrollRef} style={styles.scroll}>
      <div style={styles.innerContent}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} />)
        ) : (
          <>
            {sections.map((section, index) => {

              if (!section.categories?.length) {
                console.warn(
                  "⚠️ No categories found for section:",
                  section.mainCategory
                );
                return null;
              }

              return (
                <section
                  key={section.mainCategory.id}
                  style={styles.sectionBlock}
                >
                  <h2 style={styles.sectionTitle}>
                    {section.mainCategory.name}
                  </h2>

                  <CategoryContainer
                    data={section.categories}
                    mainCategory={section.mainCategory}
                  />
                </section>
              );
            })}

            <h2 style={styles.recommendedTitle}>Recommended Products</h2>

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
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "Inter, Poppins, Roboto, sans-serif",
  },
  recommendedTitle: {
    margin: "12px 0",
    paddingLeft: 4,
    color: "#111",
    fontSize: 14,
    fontWeight: 600,
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
*/



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
    scrollRef,
  }));


  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const isLoading =
    (sectionsLoading || productsLoading) && sections.length === 0;

  return (
    <div ref={scrollRef} style={styles.scroll}>
      <div style={styles.innerContent}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} />)
        ) : (
          <>
            {sections.map((section, index) => {

              if (!section.categories?.length) {
                console.warn(
                  "⚠️ No categories found for section:",
                  section.mainCategory
                );
                return null;
              }

              return (
                <section
                  key={section.mainCategory.id}
                  style={styles.sectionBlock}
                >
                  <h2 style={styles.sectionTitle}>
                    {section.mainCategory.name}
                  </h2>

                  <CategoryContainer
                    data={section.categories}
                    mainCategory={section.mainCategory}
                  />
                </section>
              );
            })}

            <h2 style={styles.recommendedTitle}>Recommended Products</h2>

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
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "Inter, Poppins, Roboto, sans-serif",
  },
  recommendedTitle: {
    margin: "12px 0",
    paddingLeft: 4,
    color: "#111",
    fontSize: 14,
    fontWeight: 600,
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


