import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../features/home/screens/HomeScreen";
import SearchScreen from "../features/search/screens/SearchScreen";
import CartScreen from "../features/cart/screens/CartScreen";
import WishlistScreen from "../features/wishlist/screens/WishlistScreen";

import AnimatedTabIcon from "@/src/components/atoms/AnimatedTabIcon";
import { spacing } from "../Theme/spacing";
import useAppTheme from "../hooks/useAppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          justifyContent: "center",
          marginHorizontal: 20,
          borderRadius: 99,
          marginBottom:
            Platform.OS === "ios" ? spacing.xxl : 10 + insets.bottom,
          marginTop: 10,
          alignItems: "center",

          elevation: 20,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },

          paddingTop: 0,
          paddingBottom: 0,
          height: 70,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          justifyContent: "center",
          alignItems: "center",
          marginTop: 14,
        },

        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.black,

        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? "home" : "home-outline",
            Search: focused ? "search" : "search-outline",
            Cart: focused ? "cart" : "cart-outline",
            Wishlist: focused ? "heart" : "heart-outline",
            Settings: focused ? "settings" : "settings-outline",
          } as const;

          return (
            <AnimatedTabIcon
              name={icons[route.name as keyof typeof icons]}
              color={color}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}
