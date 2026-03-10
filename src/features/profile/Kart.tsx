import React, { FC, useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Platform,
  ScrollView,
  Alert,
  Dimensions, // ✅ ADDED
} from "react-native";
import { Helmet } from "react-helmet-async";

import CustomHeader from "@components/ui/CustomHeader";
import WithCart from "@features/cart/WithCart";
import withLiveStatus from "@features/map/withLiveStatus";
import { withNetworkHandlerWithHeader } from "@components/common/withNetworkHandler";
import EmptyProductList from "@features/category/EmptyProductList";
import OrderItem from "@features/profile/OrderItem";
import OrderListSkeleton from "@features/profile/OrderListSkeleton";
import NoConnectionScreen from "@components/common/NetworkHandler";
import { useAuthStore } from "@state/authStore";
import { fetchCustomerOrdersNeeds } from "@service/orderService";
import { navigate } from "@utils/NavigationUtils";

interface Props {
  isConnected?: boolean;
  onRetry?: () => void;
}

const PAGE_LIMIT = 10;

const Kart: FC<Props> = ({ isConnected, onRetry }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [numColumns, setNumColumns] = useState(1); // ✅ ADDED

  const { user } = useAuthStore();
  const hasFocusedOnce = useRef(false);

  const CITY = "Prayagraj";
  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://paltanshoppingmall.in/kart";

  /* =========================
     ✅ RESPONSIVE COLUMNS
  ========================== */
  useEffect(() => {
    const updateLayout = () => {
      const width = Dimensions.get("window").width;
      setNumColumns(width >= 1024 ? 2 : 1); // 💻 desktop = 2
    };

    updateLayout();
    const sub = Dimensions.addEventListener("change", updateLayout);
    return () => sub?.remove();
  }, []);

  /* =========================
     FETCH ORDERS
  ========================== */

  const fetchOrders = async (
    pageNumber = 1,
    isLoadMore = false
  ) => {
    try {
      if (!user || !user._id) {
        setOrders([]);
        Alert.alert(
          "Login Required",
          "Please login to view your orders.",
          [{ text: "OK", onPress: () => navigate("/login") }]
        );
        return;
      }

      isLoadMore ? setLoadingMore(true) : setOrdersLoading(true);

      const res = await fetchCustomerOrdersNeeds(
        pageNumber,
        PAGE_LIMIT
      );

      const newOrders = res?.data || [];

      setOrders((prev) =>
        isLoadMore ? [...prev, ...newOrders] : newOrders
      );

      setHasMore(res?.hasMore);
      setPage(pageNumber);
    } catch (error: any) {
      Alert.alert("Error", "Unable to load orders.");
    } finally {
      isLoadMore ? setLoadingMore(false) : setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      fetchOrders(1, false);
    }
  }, [user?._id]);

  /* =========================
     RENDER ORDER
  ========================== */

  const renderOrders = ({ item, index }: any) => {
    const handlePress = () => {
      if (item.status === "delivered") {
        useAuthStore.getState().setCurrentOrder(item);
        navigate("/deliveredorderdetails");
      }
    };

    return (
      <View style={numColumns > 1 ? styles.desktopWrapper : undefined}>
        <OrderItem
          item={item}
          index={index}
          onPress={item.status === "delivered" ? handlePress : undefined}
        />
      </View>
    );
  };

  return (
    <>
      <Helmet>
        <title>Your Orders & Cart | Paltan Shopping Mall</title>
      </Helmet>

      <View style={styles.mainContainer}>
        <CustomHeader title="Kart" search />

        {!isConnected ? (
          <NoConnectionScreen onRetry={onRetry} />
        ) : ordersLoading ? (
          <OrderListSkeleton />
        ) : orders.length > 0 ? (
          <FlatList
            data={orders}
            renderItem={renderOrders}
            keyExtractor={(item: any) => item.orderId}
            numColumns={numColumns}      
            key={numColumns}               
            columnWrapperStyle={
              numColumns > 1
                ? { justifyContent: "space-between" }
                : undefined
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            onEndReached={() => {
              if (hasMore && !loadingMore) {
                fetchOrders(page + 1, true);
              }
            }}
            onEndReachedThreshold={0.4}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.emptyContainer}>
            <Text style={styles.text}>Book your first order</Text>
            <EmptyProductList />
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "white" },
  scrollViewContent: { padding: 8, paddingBottom: 40 },

  // ✅ ADDED — for 2 column spacing
  desktopWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },

  text: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(17,17,18,0.3)",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default withNetworkHandlerWithHeader(
  withLiveStatus(WithCart(Kart))
);