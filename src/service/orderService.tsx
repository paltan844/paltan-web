import { appAxios } from "./apilnterceptors";


type CartItem = {
  id: string;
  item: string;
  count: number;
  categoryId?: string | null;
};

type AppliedOffer = {
  couponCode: string;
} | null;


export const estimateBill = async (
  items: CartItem[],
  couponCode: string | null
) => {
  try {
    const res = await appAxios.post("/estimate", {
      items,
      couponCode,
    });

    return res.data; // FULL bill object
  } catch (err) {
    console.warn("Estimate Bill Error:", err);
    return null;
  }
};

export const createOrder = async (payload: {
  items: CartItem[];
  branch: string;
  deliveryAddress: Record<string, any>;
  couponCode: string | null;
}) => {
  try {
    const response = await appAxios.post("/order", {
      items: payload.items,
      branch: '686e910cba6c97c2a5301768',
      deliveryAddress: payload.deliveryAddress,
      couponCode: payload.couponCode,
    });

    return response.data;
  } catch (err) {
    console.warn("Create Order Error", err);
    return null;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const response = await appAxios.get(`/order/${id}`);
    return response.data;

  } catch (err) {
    console.warn("Fetch Order Error", err);
    return null;
  }
};


export const fetchCustomerOrders = async () => {
  try {
    const response = await appAxios.get("/order");
    return response.data;
  } catch (err) {
    console.warn("❌ Fetch Customer Orders Error", err);
    return null;
  }
};


export const fetchCustomerOrdersNeeds = async () => {
  try {
    const response = await appAxios.get("/orderNeed");
    return response.data;
  } catch (err) {
    console.warn("❌ Fetch Customer OrderNeed Error", err);
    return null;
  }
};


export const fetchOrders = async (
  status: string,
  userId: string,
  branchId: string
) => {
  let uri =
    status === "available"
      ? `/order?status=${status}&branchId=${branchId}`
      : `/order?branchId=${branchId}&deliverypartnerId=${userId}&status=delivered`;

  try {
    const response = await appAxios.get(uri);
    return response.data;
  } catch (err) {
    console.warn("Fetch Delivery Order Error", err);
    return null;
  }
};

export const sendLiveOrderUpdates = async (
  id: string,
  location: any,
  status: string
) => {
  try {
    const response = await appAxios.patch(`/order/${id}/status`, {
      deliveryPersonLocation: location,
      status,
    });
    return response.data;
  } catch (err) {
    console.warn("sendLiveOrderUpdates Error", err);
    return null;
  }
};

export const confirmOrder = async (id: string, location: any) => {
  try {
    const response = await appAxios.post(`/order/${id}/confirm`, {
      deliveryPersonLocation: location,
    });
    return response.data;
  } catch (err) {
    console.warn("confirmOrder Error", err);
    return null;
  }
};

export const getInvoiceUrlByOrderId = async (orderId: string) => {
  const { data } = await appAxios.get(`/order/${orderId}/invoice`);
  return data;
};
