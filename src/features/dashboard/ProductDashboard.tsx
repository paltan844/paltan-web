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

const ProductDashboard: React.FC = () => {
  const { banners, loading, fetchBanners, reloadBanners } = useBannerStore();

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<ContentRef>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const reloadAll = () => reloadBanners();

  const ContentWithNetwork = withNetworkHandler(
    ({ onRetry }: { onRetry: () => void }) => (
      <div
        style={{
          ...styles.contentContainer,
          ...(isDesktop && styles.desktopContentContainer),
        }}
      >
        {loading ? (
          <BannerSkeleton />
        ) : banners.length === 0 ? (
          <NoConnectionScreen onRetry={onRetry} />
        ) : (
          <>
            <NoticeBanner items={banners} />
            <Content ref={contentRef} />

            <footer
              style={{
                ...styles.footer,
                ...(isDesktop && styles.desktopFooter),
              }}
            >
              <div
                style={{
                  ...styles.footerInner,
                  ...(isDesktop && styles.desktopFooterInner),
                }}
              >
                <p
                  style={{
                    ...styles.footerMain,
                    ...(isDesktop && styles.desktopFooterMain),
                  }}
                >
                  Sab Milta Hai Online 💙
                </p>

                <p
                  style={{
                    ...styles.footerCredit,
                    ...(isDesktop && styles.desktopFooterCredit),
                  }}
                >
                  Developed By Paltan Team
                </p>
              </div>
            </footer>
          </>
        )}
      </div>
    )
  );

  return (
    <>
      <Helmet>
        <title>
          Online Grocery Delivery in Prayagraj | Paltan Shopping Mall
        </title>
        <meta
          name="description"
          content="Order fresh grocery online in Prayagraj from Paltan Shopping Mall. Fruits, vegetables, daily essentials & fast delivery at best prices."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <h1 style={styles.hiddenSEO}>
        Online Grocery Delivery in Prayagraj – Paltan Shopping Mall
      </h1>

      <div style={styles.wrapper}>
        <Visuals />
        <AnimatedHeader />
        <SearchBarIcons />
        <ContentWithNetwork onRetry={reloadAll} />

        <button
          onClick={backToTop}
          style={{
            ...styles.backToTop,
            ...(isDesktop && styles.desktopBackToTop),
            opacity: showBackToTop ? 1 : 0,
            transform: showBackToTop
              ? "translateY(0)"
              : "translateY(10px)",
            pointerEvents: showBackToTop ? "auto" : "none",
          }}
        >
          <ArrowUp size={14} />
          <span style={styles.backToTopText}>Back to Top</span>
        </button>
      </div>
    </>
  );
};

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

  desktopContentContainer: {
    maxWidth: 1850,
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
    padding: "6px 12px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 999,
  },

  desktopBackToTop: {
    top: "auto",
    left: "auto",
    bottom: 40,
    right: 40,
    transform: "none",
  },

  backToTopText: {
    fontWeight: 500,
  },

  /* ================= FOOTER ================= */

  footer: {
    backgroundColor: "#f8f8f8",
    textAlign: "center",
    padding: "30px 16px 40px",
    marginTop: 20,
  },

  footerInner: {
    width: "100%",
  },

  footerMain: {
    fontWeight: 700,
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 10,
  },

  footerCredit: {
    fontSize: 14,
    opacity: 0.5,
  },

  /* ===== Desktop Footer Enhancement ===== */

  desktopFooter: {
    marginTop: 50,
    padding: "60px 0",
    backgroundColor: "#f3f4f6",
    borderTop: "1px solid #e5e7eb",
  },

  desktopFooterInner: {
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
  },

  desktopFooterMain: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 16,
  },

  desktopFooterCredit: {
    fontSize: 16,
    opacity: 0.75,
  },

  hiddenSEO: {
    position: "absolute",
    left: "-9999px",
  },
};

export default ProductDashboard;