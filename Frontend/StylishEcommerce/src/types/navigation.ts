import { FilterState } from "@/src/hooks/Useproductfilters";
import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
  ForgetPassword: undefined;
  GetStarted: undefined;
  RegisterVerification: { email: string; password?: string };
};

export type AppTabParamList = {
  Home: undefined;
  Search: { filterType?: string; filterValue?: string };
  Cart: undefined;
  Wishlist: undefined;
  Settings: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<AppTabParamList>;
  ProductDetail: { productId: string };
  Profile: undefined;
  Cartdetail: { productId: string };
  FilterScreen: {
    filters: FilterState;
    onApplyFilters: (filters: FilterState) => void;
  };

  // Profile Screens
  Notifications: undefined;
  PaymentMethods: undefined;
  PersonalDetails: undefined;
  OrdersList: undefined;
};
