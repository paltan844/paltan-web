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
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY && currentScrollY > 200) {
        setShowBackToTop(true);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          setShowBackToTop(false);
        }, 1000);
      } else if (currentScrollY > lastScrollY || currentScrollY < 200) {
        setShowBackToTop(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              <p style={styles.footerCredit}>Developed by Paltan Team</p>
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
            : "translateX(-50%) translateY(20px)",
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
    bottom: 50,
    left: "50%",
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
