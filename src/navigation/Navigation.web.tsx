// src/navigation/Navigation.web.tsx
import React from "react";
// @ts-expect-error - use unstable_HistoryRouter for versions <6.22
import { unstable_HistoryRouter as HistoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { navigationRef } from "@utils/NavigationUtils";


import Profile from "@features/profile/Profile";
import CustomerSupport from "@features/profile/customerSupport";
import ShareScreen from "@features/profile/share";
import SearchScreen from '@components/dashboard/SearchScreen';
import AboutPaltan from "@features/profile/Information/AboutPaltan";
import LegalInformationScreen from "@features/profile/Information/LegalInformationScreen";
import CustomerLogin from "@features/auth/CustomerLogin";
import ProductOrder from "@features/order/ProductOrder";
import OrderSuccess from "@features/order/OrderSuccess";
import ProductCategory from '@features/category/ProductCategory';
import ProductCategories from '@features/category/ProductCategories';
import MainTabs from "@features/dashboard/MainTabScreens";
import GroceryProductDetail from "@features/category/GroceryProductDetail";
import WearDetail from "@features/category/WearDetail";
import FurnitureDetail from "@features/category/FurnitureDetail";
import MobileDetails from "@features/category/MobileDetails";
import ProductDetail from "@features/category/ProductDetail";
import LocationSelector from '@components/dashboard/Location/LocationSelector';
import CurrentLocationScreen from '@components/dashboard/Location/CurrentLocation';
import InvoiceDownloadScreen from '@features/profile/InvoiceDownloadScreen';
import AddressDetail from '@components/dashboard/AddressDetail';
import LiveTracking from '@features/map/LiveTracking';
import DeliveredOrderDetails from '@features/profile/deliveredOrderDetail';


const Navigation = () => {
  return (
    <HistoryRouter history={navigationRef}>
      <Routes>

    
        <Route path="/currentlocation" element={<CurrentLocationScreen />} />
        <Route path="/locationselector" element={<LocationSelector />} />
        <Route path="/addressdetail" element={<AddressDetail />} />
        <Route path="/productorder" element={<ProductOrder />} />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/deliveredorderdetails" element={<DeliveredOrderDetails />} />
        <Route path="/productdetail" element={<ProductDetail />} />
        <Route path="/groceryproductdetail" element={<GroceryProductDetail />} />
        <Route path="/mobiledetail" element={<MobileDetails />} />
        <Route path="/furnituredetail" element={<FurnitureDetail />} />
        <Route path="/weardetail" element={<WearDetail />} />
        <Route path="/livetracking" element={<LiveTracking />} />
        

        <Route path="/productcategory/:id" element={<ProductCategory />} />
        <Route path="/productcategories/:id" element={<ProductCategories />} />

        <Route path="/searchscreen" element={<SearchScreen />} />
        <Route path="/aboutpaltan" element={<AboutPaltan />} />
        <Route path="/customersupport" element={<CustomerSupport />} />
        <Route path="/LegalInformationScreen" element={<LegalInformationScreen />} />
        <Route path="/share" element={<ShareScreen />} />

        <Route path="/*" element={<MainTabs />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HistoryRouter>
  );
};

export default Navigation;