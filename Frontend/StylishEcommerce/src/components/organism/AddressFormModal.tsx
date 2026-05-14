import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { spacing } from "@/src/Theme/spacing";
import { colors } from "@/src/Theme/colors";
import LabeledInput from "@/src/components/atoms/LabeledInput";
import Button from "@/src/components/atoms/Button";
import { Ionicons } from "@expo/vector-icons";
import type { Address, AddressFormData } from "@/src/Store/addressStore";
import useAppTheme from "@/src/hooks/useAppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AddressFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: AddressFormData) => Promise<void>;
  address?: Address | null;
};

const LABEL_OPTIONS: Array<"Home" | "Work" | "Other"> = [
  "Home",
  "Work",
  "Other",
];

const STATES = [
  { label: "Andhra Pradesh", value: "Andhra Pradesh" },
  { label: "Bihar", value: "Bihar" },
  { label: "Delhi", value: "Delhi" },
  { label: "Goa", value: "Goa" },
  { label: "Gujarat", value: "Gujarat" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Kerala", value: "Kerala" },
  { label: "Madhya Pradesh", value: "Madhya Pradesh" },
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Punjab", value: "Punjab" },
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Tamil Nadu", value: "Tamil Nadu" },
  { label: "Telangana", value: "Telangana" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh" },
  { label: "West Bengal", value: "West Bengal" },
];

const emptyForm: AddressFormData = {
  label: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const AddressFormModal = ({
  visible,
  onClose,
  onSave,
  address,
}: AddressFormModalProps) => {
  const { colors } = useAppTheme();
  const [form, setForm] = useState<AddressFormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!address;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (address) {
      setForm({
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
      });
    } else {
      setForm(emptyForm);
    }
  }, [address, visible]);

  const updateField = (key: keyof AddressFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    if (!form.fullName.trim()) {
      Alert.alert("Validation", "Full name is required");
      return false;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      Alert.alert("Validation", "Valid phone number is required");
      return false;
    }
    if (!form.addressLine1.trim()) {
      Alert.alert("Validation", "Address is required");
      return false;
    }
    if (!form.city.trim()) {
      Alert.alert("Validation", "City is required");
      return false;
    }
    if (!form.state.trim()) {
      Alert.alert("Validation", "State is required");
      return false;
    }
    if (!form.pincode.trim() || form.pincode.length < 5) {
      Alert.alert("Validation", "Valid pincode is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await onSave(form);
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            paddingVertical: Platform.OS === "android" ? insets.bottom : 10,
          }}
        >
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              {isEditing ? "Edit Address" : "Add New Address"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionLabel}>Address Type</Text>
            <View style={styles.labelRow}>
              {LABEL_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.labelChip,
                    form.label === option && styles.labelChipActive,
                  ]}
                  onPress={() => updateField("label", option)}
                >
                  <Ionicons
                    name={
                      option === "Home"
                        ? "home-outline"
                        : option === "Work"
                          ? "briefcase-outline"
                          : "location-outline"
                    }
                    size={16}
                    color={form.label === option ? "#fff" : "#666"}
                  />
                  <Text
                    style={[
                      styles.labelChipText,
                      form.label === option && styles.labelChipTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputWrapper}>
              <LabeledInput
                label="Full Name *"
                value={form.fullName}
                onChangeText={(v) => updateField("fullName", v)}
                placeholder="Enter full name"
              />
            </View>

            <View style={styles.inputWrapper}>
              <LabeledInput
                label="Phone Number *"
                value={form.phone}
                onChangeText={(v) => updateField("phone", v)}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
              />
            </View>

            <View style={styles.inputWrapper}>
              <LabeledInput
                label="Address Line 1 *"
                value={form.addressLine1}
                onChangeText={(v) => updateField("addressLine1", v)}
                placeholder="House no., Building, Street"
              />
            </View>

            <View style={styles.inputWrapper}>
              <LabeledInput
                label="Address Line 2"
                value={form.addressLine2 || ""}
                onChangeText={(v) => updateField("addressLine2", v)}
                placeholder="Area, Landmark (optional)"
              />
            </View>

            <View style={styles.inputWrapper}>
              <LabeledInput
                label="Pincode *"
                value={form.pincode}
                onChangeText={(v) => updateField("pincode", v)}
                keyboardType="number-pad"
                placeholder="Enter pincode"
              />
            </View>

            <View style={styles.inputWrapper}>
              <LabeledInput
                label="City *"
                value={form.city}
                onChangeText={(v) => updateField("city", v)}
                placeholder="Enter city"
              />
            </View>

            <View style={styles.inputWrapper}>
              <LabeledInput
                label="State *"
                isDropDown={true}
                dropDownData={STATES}
                value={form.state}
                onChangeText={(v) => updateField("state", v)}
                placeholder="Select state"
              />
            </View>

            <View style={styles.inputWrapper}>
              <LabeledInput
                label="Country *"
                value={form.country}
                onChangeText={(v) => updateField("country", v)}
                placeholder="Enter country"
              />
            </View>
          </ScrollView>

          <View style={[styles.footer, { backgroundColor: colors.background }]}>
            <Button
              placeholder={isEditing ? "Update Address" : "Save Address"}
              onPress={handleSave}
              isLoading={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddressFormModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  sectionLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  labelChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.background,
  },
  labelChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  labelChipText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: "#666",
  },
  labelChipTextActive: {
    color: colors.background,
  },
  inputWrapper: {
    marginTop: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    backgroundColor: colors.background,
  },
});
