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
        {/* ✅ All main tab routes handled inside MainTabs */}
        <Route path="/*" element={<MainTabs />} />

        {/* ✅ Other app-level routes */}
        <Route path="/customersupport" element={<CustomerSupport />} />
        <Route path="/share" element={<ShareScreen />} />
        <Route path="/aboutpaltan" element={<AboutPaltan />} />
        <Route path="/searchscreen" element={<SearchScreen />} />
        <Route path="/productcategory" element={<ProductCategory />} />
        <Route path="/productcategories" element={<ProductCategories />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/LegalInformationScreen" element={<LegalInformationScreen />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/productorder" element={<ProductOrder />} />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HistoryRouter>
  );
};

export default Navigation;
