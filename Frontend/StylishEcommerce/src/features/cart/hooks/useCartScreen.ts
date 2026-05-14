import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useCartStore } from "@/src/Store/cartStore";
import { useAddressStore } from "@/src/Store/addressStore";

import type { Address, AddressFormData } from "@/src/Store/addressStore";
import type { AppStackParamList } from "@/src/types/navigation";

type NavigationType = NativeStackNavigationProp<AppStackParamList>;

export const useCartScreen = () => {
  const navigation = useNavigation<NavigationType>();

  // Cart Store
  const {
    cartItems,
    cartTotal,
    isLoading: isCartLoading,
    getCart,
    updateQty,
    remove,
  } = useCartStore();

  // Address Store
  const {
    addresses,
    selectedAddressId,
    fetchAddresses,
    addAddress,
    updateAddress,
    selectAddress,
  } = useAddressStore();

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await Promise.all([fetchAddresses(), getCart()]);

    setRefreshing(false);
  }, [fetchAddresses, getCart]);

  const selectedAddress =
    addresses.find((a) => a._id === selectedAddressId) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0];

  const otherAddresses = addresses.filter(
    (a) => a._id !== selectedAddress?._id,
  );

  useEffect(() => {
    fetchAddresses();
    getCart();
  }, []);

  const handleCartItemPress = (id: string) => {
    navigation.navigate("Cartdetail", {
      productId: id,
    });
  };

  const handleIncrement = (
    productId: string,
    size: string,
    currentQty: number,
  ) => {
    updateQty(productId, size, currentQty + 1);
  };

  const handleDecrement = (
    productId: string,
    size: string,
    currentQty: number,
  ) => {
    if (currentQty > 1) {
      updateQty(productId, size, currentQty - 1);
    } else {
      handleRemove(productId, size);
    }
  };

  const handleRemove = (productId: string, size: string) => {
    remove(productId, size);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressModalVisible(true);
  };

  const handleEditAddress = () => {
    if (selectedAddress) {
      setEditingAddress(selectedAddress);
      setAddressModalVisible(true);
    }
  };

  const handleSaveAddress = async (data: AddressFormData) => {
    if (editingAddress) {
      await updateAddress(editingAddress._id, data);
    } else {
      await addAddress(data);
    }
  };

  const closeAddressModal = () => {
    setAddressModalVisible(false);
    setEditingAddress(null);
  };

  return {
    cartItems,
    cartTotal,
    isCartLoading,
    addresses,
    selectedAddress,
    otherAddresses,
    selectedAddressId,
    addressModalVisible,
    editingAddress,
    refreshing,
    onRefresh,
    handleCartItemPress,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleAddAddress,
    handleEditAddress,
    handleSaveAddress,
    closeAddressModal,
    selectAddress,
    navigation,
  };
};
