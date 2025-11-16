/*
// src/navigation/Navigation.web.tsx
import React from "react";
// @ts-expect-error - use unstable_HistoryRouter for versions <6.22
import { unstable_HistoryRouter as HistoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { navigationRef } from "@utils/NavigationUtils";

// ✅ Screens
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

const Navigation = () => {
  return (
    <HistoryRouter history={navigationRef}>
      <Routes>
        {/* ✅ All main tab routes handled inside MainTabs /}
        <Route path="/*" element={<MainTabs />} />

        {/* ✅ Other app-level routes /}
        <Route path="/customersupport" element={<CustomerSupport />} />
        <Route path="/share" element={<ShareScreen />} />
        <Route path="/aboutpaltan" element={<AboutPaltan />} />
        <Route path="/searchscreen" element={<SearchScreen />} />
         <Route path="/productcategory/:id" element={<ProductCategory />} />
          <Route path="/productcategories/:id" element={<ProductCategories />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/LegalInformationScreen" element={<LegalInformationScreen />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/productorder" element={<ProductOrder />} />

        {/* Default fallback /}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HistoryRouter>
  );
};

export default Navigation;  */




        // src/navigation/Navigation.web.tsx
import React from "react";
// @ts-expect-error - use unstable_HistoryRouter for versions <6.22
import { unstable_HistoryRouter as HistoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { navigationRef } from "@utils/NavigationUtils";

// ✅ Screens
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

const Navigation = () => {
  return (
    <HistoryRouter history={navigationRef}>
      <Routes>
        {/* ✅ All main tab routes handled inside MainTabs */}
        <Route path="/*" element={<MainTabs />} />

        {/* ✅ Other app-level routes */}
        <Route path="/customersupport" element={<CustomerSupport />} />
        <Route path="/share" element={<ShareScreen />} />
        <Route path="/aboutpaltan" element={<AboutPaltan />} />
        <Route path="/searchscreen" element={<SearchScreen />} />
        <Route path="/productcategory/:id" element={<ProductCategory />} />
        <Route path="/productcategories/:id" element={<ProductCategories />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/LegalInformationScreen" element={<LegalInformationScreen />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/productorder" element={<ProductOrder />} />
        <Route path="GroceryProductDetail" element={<GroceryProductDetail/>}  />
        <Route path="ProductDetail" element={<ProductDetail/>}  />
        <Route path="MobileDetail" element={<MobileDetails/>}  />
        <Route path="FurnitureDetail" element={<FurnitureDetail/>}  />        
        <Route path="WearDetail" element={<WearDetail/>}  />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HistoryRouter>
  );
};

export default Navigation;
  
