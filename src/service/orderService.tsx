import { appAxios } from './apilnterceptors';


export const createOrder = async (items: any, totalPrice: number, address: Record<string, any>  ) => {
    try{
        const response = await appAxios.post( '/order',{
items:items,
branch:'686e910cba6c97c2a5301768',
totalPrice: totalPrice,
deliveryAddress: address,
    });
    return response.data;

    }catch(err){
        console.warn('Create Order Error',err);
        return null;
    }
};


export const getOrderById = async (id:string) => {
    try{
        const response = await appAxios.get( `/order/${id}`);
        return response.data;

    }catch(err){
        console.warn('Fetch Order Error',err);
        return null;
    }
};

export const fetchCustomerOrders = async (userid:string) => {
    try{
        const response = await appAxios.get(`/order?customerId=${userid}`);
        return response.data;

    }catch(err){
        console.warn('Fetch Customer Order Error',err);
        return null;
    }
};


export const fetchCustomerOrdersNeeds = async (userid:string) => {
    try{
        const response = await appAxios.get(`/orderNeed?customerId=${userid}`);
        return response.data;

    }catch(err){
        console.warn('Fetch Customer Order Error',err);
        return null;
    }
};

export const fetchOrders = async (status:string, userid:string, branchId:string) => {
   let uri = status === 'available' ? `/order?status=${status}&branchId=${branchId}` :
   `/order?branchId=${branchId}&deliverypartnerId=${userid}&status=delivered`;
    try{
        const response = await appAxios.get(uri);
    return response.data;

    }catch(err){
        console.warn('Fetch Delivery Order Error',err);
        return null;
    }
};

export const sendLiveOrderUpdates = async (id:string, location:any,status:string) => {
    try{
        const response = await appAxios.patch(`/order/${id}/status`,{
    deliveryPersonLocation: location,
    status,
        });
        return response.data;
    }catch(err){
        console.warn('sendLiveOrderUpdates Error',err);
        return null;
    }
};

export const confirmOrder = async (id:string, location:any) => {
    try{
        const response = await appAxios.post(`/order/${id}/confirm`,{
    deliveryPersonLocation: location,
        });
        return response.data;
    }catch(err){
        console.warn('confirmOrder Error',err);
        return null;
    }
};


export const getInvoiceUrlByOrderId = async (orderId: string) => {
  const { data } = await appAxios.get(`/order/${orderId}/invoice`);
  console.log(data,"jhwgcvdsn df");
  return data; // expected { pdfUrl: "https://..." }
};
