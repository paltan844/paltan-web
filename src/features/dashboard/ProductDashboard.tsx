/*
import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { ArrowUp } from "lucide-react";
import Visuals from "./Visuals";
import AnimatedHeader from "./AnimatedHeader";
import SearchBarIcons from "./SearchBarIcons";
import NoticeBanner from "@components/common/NoticeBanner";
import BannerSkeleton from "./BannerSkelton";
import { useBannerStore } from "@state/bannerStore";
import { withNetworkHandler } from "@components/common/withNetworkHandler";
import NoConnectionScreen from "@components/common/NetworkHandler";
import Content, { ContentRef } from "@components/dashboard/Content";

const ProductDashboard: React.FC = () => {
  const { banners, loading, fetchBanners, reloadBanners } = useBannerStore();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<ContentRef>(null);


  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);


  useEffect(() => {
    const scrollContainer = contentRef.current?.scrollRef?.current;
    if (!scrollContainer) return;

    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;

      if (scrollTop < lastScrollTop && scrollTop > 200) {
        setShowBackToTop(true);

        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          setShowBackToTop(false);
        }, 2000);
      } else if (scrollTop > lastScrollTop || scrollTop < 200) {
        setShowBackToTop(false);
      }

      lastScrollTop = scrollTop;
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [contentRef.current]);

  const backToTop = () => {
    const scrollContainer = contentRef.current?.scrollRef?.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setShowBackToTop(false);
  };

  const reloadAll = () => reloadBanners();

  const ContentWithNetwork = withNetworkHandler(
    ({ onRetry }: { onRetry: () => void }) => (
      <div style={styles.contentContainer}>
        {loading ? (
          <BannerSkeleton />
        ) : banners.length === 0 ? (
          <NoConnectionScreen onRetry={onRetry} />
        ) : (
          <>
            <NoticeBanner items={banners} />
            <Content ref={contentRef} />
            <footer style={styles.footer}>
              <p style={styles.footerMain}>Sab Milta Hai Online 💙</p>
              <p style={styles.footerCredit}>Developed By Paltan Team</p>
            </footer>
          </>
        )}
      </div>
    )
  );

  return (
    <div style={styles.wrapper}>
      <Visuals />
      <AnimatedHeader />
      <SearchBarIcons />
      <ContentWithNetwork onRetry={reloadAll} />

      <button
        onClick={backToTop}
        style={{
          ...styles.backToTop,
          opacity: showBackToTop ? 1 : 0,
          pointerEvents: showBackToTop ? "auto" : "none",
          transform: showBackToTop
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(-10px)",
        }}
      >
        <ArrowUp size={13} />
        <span style={styles.backToTopText}>Back to Top</span>
      </button>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
    overflowX: "hidden",
    fontFamily: "Inter, sans-serif",
  },
  contentContainer: {
    width: "100%",
    maxWidth: 1200,
    marginTop: 0.5,
  },
  backToTop: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 25,
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    fontSize: 11,
    cursor: "pointer",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 999,
  },
  backToTopText: {
    fontWeight: 400,
  },
  footer: {
    backgroundColor: "#f8f8f8",
    textAlign: "center",
    padding: "20px 16px 40px",
    width: "100%",
    marginTop: 0,
  },
  footerMain: {
    fontWeight: 700,
    fontSize: 18,
    opacity: 0.5,
    marginBottom: 10,
  },
  footerCredit: {
    fontSize: 14,
    opacity: 0.4,
  },
};

export default ProductDashboard;
*/



import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { Helmet } from "react-helmet-async";

import Visuals from "./Visuals";
import AnimatedHeader from "./AnimatedHeader";
import SearchBarIcons from "./SearchBarIcons";
import NoticeBanner from "@components/common/NoticeBanner";
import BannerSkeleton from "./BannerSkelton";
import { useBannerStore } from "@state/bannerStore";
import { withNetworkHandler } from "@components/common/withNetworkHandler";
import NoConnectionScreen from "@components/common/NetworkHandler";
import Content, { ContentRef } from "@components/dashboard/Content";

/* ------------------------------------------------------------------ */
/* ✅ SEPARATE CONTENT COMPONENT (IMPORTANT FIX) */
/* ------------------------------------------------------------------ */

const BannerContent: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { banners, loading } = useBannerStore();

  if (loading) return <BannerSkeleton />;

  if (!banners.length) {
    return <NoConnectionScreen onRetry={onRetry} />;
  }

  return (
    <>
      <NoticeBanner items={banners} />
      <Content />

      <footer style={styles.footer}>
        <p style={styles.footerMain}>Sab Milta Hai Online 💙</p>
        <p style={styles.footerCredit}>Developed By Paltan Team</p>
      </footer>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* ✅ HOC OUTSIDE COMPONENT (CRITICAL FIX) */
/* ------------------------------------------------------------------ */

const ContentWithNetwork = withNetworkHandler(
  ({ onRetry }: { onRetry: () => void }) => (
    <div style={styles.contentContainer}>
      <BannerContent onRetry={onRetry} />
    </div>
  )
);

/* ------------------------------------------------------------------ */
/* 🔥 MAIN COMPONENT */
/* ------------------------------------------------------------------ */

const ProductDashboard: React.FC = () => {
  const { fetchBanners, reloadBanners } = useBannerStore();

  const [showBackToTop, setShowBackToTop] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<ContentRef>(null);

  /* ✅ Fetch banners once */
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  /* ✅ SAFE scroll listener (NO BLANK PAGE) */
  useEffect(() => {
    const timer = setTimeout(() => {
      const scrollContainer = contentRef.current?.scrollRef?.current;
      if (!scrollContainer) return;

      let lastScrollTop = 0;

      const handleScroll = () => {
        const scrollTop = scrollContainer.scrollTop;

        if (scrollTop < lastScrollTop && scrollTop > 200) {
          setShowBackToTop(true);

          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
          }

          hideTimeoutRef.current = setTimeout(() => {
            setShowBackToTop(false);
          }, 2000);
        } else if (scrollTop > lastScrollTop || scrollTop < 200) {
          setShowBackToTop(false);
        }

        lastScrollTop = scrollTop;
      };

      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }, 0);

    return () => {
      clearTimeout(timer);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const backToTop = () => {
    const scrollContainer = contentRef.current?.scrollRef?.current;

    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setShowBackToTop(false);
  };

  return (
    <>
      {/* 🔥 SEO (SAFE & CORRECT) */}
      <Helmet>
        <title>Online Grocery Delivery in Prayagraj | Paltan Shopping Mall</title>
        <meta
          name="description"
          content="Order fresh grocery online in Prayagraj from Paltan Shopping Mall. Fruits, vegetables, daily essentials & fast delivery at best prices."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* 🔍 Hidden SEO H1 */}
      <h1 style={{ position: "absolute", left: "-9999px" }}>
        Online Grocery Delivery in Prayagraj – Paltan Shopping Mall
      </h1>

      <div style={styles.wrapper}>
        <Visuals />
        <AnimatedHeader />
        <SearchBarIcons />

        <ContentWithNetwork onRetry={reloadBanners} />

        {/* 🔼 Back To Top */}
        <button
          onClick={backToTop}
          style={{
            ...styles.backToTop,
            opacity: showBackToTop ? 1 : 0,
            pointerEvents: showBackToTop ? "auto" : "none",
            transform: showBackToTop
              ? "translateX(-50%) translateY(0)"
              : "translateX(-50%) translateY(-10px)",
          }}
        >
          <ArrowUp size={13} />
          <span style={styles.backToTopText}>Back to Top</span>
        </button>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 🎨 STYLES */
/* ------------------------------------------------------------------ */

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    overflowX: "hidden",
    fontFamily: "Inter, sans-serif",
  },
  contentContainer: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
  },
  backToTop: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 25,
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    cursor: "pointer",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 999,
  },
  backToTopText: {
    fontWeight: 400,
  },
  footer: {
    backgroundColor: "#f8f8f8",
    textAlign: "center",
    padding: "20px 16px 40px",
    width: "100%",
  },
  footerMain: {
    fontWeight: 700,
    fontSize: 18,
    opacity: 0.5,
    marginBottom: 10,
  },
  footerCredit: {
    fontSize: 14,
    opacity: 0.4,
  },
};

export default ProductDashboard;



