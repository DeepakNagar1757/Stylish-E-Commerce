import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "./TabNavigator";
import ProductDetailScreen from "../features/products/screens/ProductDetailScreen";
import { AppStackParamList } from "../types/navigation";
import Profile from "../features/profile/screens/Profile";

import Notification from "../features/profile/featuredScreens/Notification";
import PaymentMethod from "../features/profile/featuredScreens/PaymentMethod";
import PersonalDetails from "../features/profile/featuredScreens/PersonalDetails";
import OrdersScreen from "../features/profile/featuredScreens/OrdersScreen";
import CartProductDetailScreen from "../features/cart/screens/CartProductDetailScreen";
import FilterScreen from "../features/filter/screens/Filterscreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Cartdetail" component={CartProductDetailScreen} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} />

      {/* Profile Stack */}
      <Stack.Screen name="Notifications" component={Notification} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethod} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="OrdersList" component={OrdersScreen} />
    </Stack.Navigator>
  );
}
