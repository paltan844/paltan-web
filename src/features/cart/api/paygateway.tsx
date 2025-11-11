import { BASE_URL } from '@service/config';
import { navigate } from '@utils/NavigationUtils';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { mmkvStorage, tokenStorage } from '@state/storage';
import { useCartStore } from '@state/cartStore';
import { useAuthStore } from '@state/authStore';

const token = tokenStorage.getString('accessToken');

const fullName = mmkvStorage.getItem('userFullName') || 'Guest';
const phone = mmkvStorage.getItem('userPhone') || '';

export const createTransaction = async (amount: number, userId: string) => {

  try {
    if (!token) {
      return null;
    }

    const res = await axios.post(
      `${BASE_URL}/order/transaction`,
      {
        userId,
        amount: amount * 100,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error('❌ Error creating transaction:', error?.response?.data || error.message);
    return null;
  }
};

export const createOrders = async (
  key: string,
  amount: number,
  order_id: string,
  cart: any,
  userId: string,
  address: Record<string, any>

) => {
  try {
    const options = {
      description: 'Ecommerce Shopping',
      image: 'https://i.posting.cc/ZRCCXLgg/temp-Imagef-Coi-ZY.avif',
      currency: 'INR',
      key: key,
      amount: amount,
      name: 'Paltan',
      order_id: order_id,
      theme: { color: '#F37254' },
      prefill: {
        name: fullName,
        contact: phone,
      },
    };

    const data = await RazorpayCheckout.open(options);

    if (!data?.razorpay_payment_id || !data?.razorpay_signature) {
      return { type: 'error', message: 'Invalid Razorpay response' };
    }

    const orderResponse = await axios.post(`${BASE_URL}/orders`, {
      razorpay_order_id: order_id,
      razorpay_payment_id: data?.razorpay_payment_id,
      razorpay_signature: data?.razorpay_signature,
      userId: userId,
      cartItems: cart,
      branch: '686e910cba6c97c2a5301768',
      address: address,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
   {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  );

    const order = orderResponse.data?.order;

    if (order) {
      useCartStore.getState().clearCart();
      useAuthStore.getState().setCurrentOrder(order);
      navigate('OrderSuccess', {
        price: amount / 100,
        address: address,
      });
      return { type: 'success', order };
    } else {
      return { type: 'error', message: 'Order creation failed' };
    }
  } catch (err: any) {
    console.warn('❌ Payment Cancelled or Failed:', err?.description || err?.message);
    return { type: 'error', message: err?.description || 'Payment cancelled or failed' };
  }
};
