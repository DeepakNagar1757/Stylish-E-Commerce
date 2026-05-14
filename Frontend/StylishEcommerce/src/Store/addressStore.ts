import { create } from "zustand";
import { apiHandler } from "../Services/apiHandler";
import { ENDPOINTS } from "../Services/endpoints";

export type Address = {
  _id: string;
  label: "Home" | "Work" | "Other";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

export type AddressFormData = Omit<Address, "_id" | "isDefault">;

type AddressState = {
  addresses: Address[];
  selectedAddressId: string | null;
  isLoading: boolean;

  fetchAddresses: () => Promise<void>;
  addAddress: (data: AddressFormData) => Promise<void>;
  updateAddress: (id: string, data: Partial<AddressFormData>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
  selectAddress: (id: string) => void;
  getSelectedAddress: () => Address | undefined;
};

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  selectedAddressId: null,
  isLoading: false,

  fetchAddresses: async () => {
    try {
      set({ isLoading: true });
      const data = await apiHandler.get(ENDPOINTS.USER.ADDRESSES);
      const addresses: Address[] = data;

      const defaultAddr = addresses.find((a) => a.isDefault);
      set({
        addresses,
        selectedAddressId: get().selectedAddressId || defaultAddr?._id || null,
      });
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addAddress: async (data) => {
    const result = await apiHandler.post(ENDPOINTS.USER.ADDRESSES, data);
    const newAddress: Address = result.address;

    set((state) => {
      const updatedAddresses = [...state.addresses, newAddress];
      return {
        addresses: updatedAddresses,
        selectedAddressId:
          newAddress.isDefault || updatedAddresses.length === 1
            ? newAddress._id
            : state.selectedAddressId,
      };
    });
  },

  updateAddress: async (id, data) => {
    const result = await apiHandler.put(ENDPOINTS.USER.ADDRESS_BY_ID(id), data);
    const updated: Address = result.address;

    set((state) => ({
      addresses: state.addresses.map((a) => (a._id === id ? updated : a)),
    }));
  },

  deleteAddress: async (id) => {
    await apiHandler.delete(ENDPOINTS.USER.ADDRESS_BY_ID(id));

    set((state) => {
      const remaining = state.addresses.filter((a) => a._id !== id);
      const wasSelected = state.selectedAddressId === id;

      return {
        addresses: remaining,
        selectedAddressId: wasSelected
          ? remaining.find((a) => a.isDefault)?._id || remaining[0]?._id || null
          : state.selectedAddressId,
      };
    });

    get().fetchAddresses();
  },

  setDefault: async (id) => {
    const result = await apiHandler.patch(ENDPOINTS.USER.SET_DEFAULT(id));

    set((state) => ({
      addresses: state.addresses.map((a) => ({
        ...a,
        isDefault: a._id === id,
      })),
      selectedAddressId: id,
    }));
  },

  selectAddress: (id) => {
    set({ selectedAddressId: id });
  },

  getSelectedAddress: () => {
    const { addresses, selectedAddressId } = get();
    return (
      addresses.find((a) => a._id === selectedAddressId) ||
      addresses.find((a) => a.isDefault) ||
      addresses[0]
    );
  },
}));
