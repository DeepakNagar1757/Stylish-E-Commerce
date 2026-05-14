import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { Image } from "expo-image";
import { colors } from "@/src/Theme/colors";
import { spacing } from "@/src/Theme/spacing";
import StackHeader from "@/src/components/molecules/StackHeader";
import Edit from "@/src/assets/svg/profile/editPencil.svg";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import LabeledInput from "@/src/components/atoms/LabeledInput";
import Avatar from "@/src/components/atoms/Avatar";
import Button from "@/src/components/atoms/Button";

import { useAuthStore } from "@/src/Store/authStore";
import { useAddressStore } from "@/src/Store/addressStore";
import { apiHandler } from "@/src/Services/apiHandler";
import { ENDPOINTS } from "@/src/Services/endpoints";
import AddressCard from "@/src/components/molecules/AddressCard";
import AddressFormModal from "@/src/components/organism/AddressFormModal";
import type { Address, AddressFormData } from "@/src/Store/addressStore";
import { Ionicons } from "@expo/vector-icons";
import useAppTheme from "@/src/hooks/useAppTheme";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PersonalDetails = () => {
  const { user, updateUser, fetchProfile } = useAuthStore();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const {
    addresses,
    isLoading: addressLoading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
  } = useAddressStore();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.avatar || null,
  );

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchAddresses();
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setProfileImage(user.avatar || null);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      Alert.alert("Validation", "First name is required");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert("Validation", "Valid phone number is required");
      return;
    }

    try {
      setProfileLoading(true);

      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("phone", phone.trim());

      if (profileImage && profileImage.startsWith("file://")) {
        const filename = profileImage.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("avatar", {
          uri: profileImage,
          name: filename || "profile.jpg",
          type,
        } as any);
      }

      const result = await apiHandler.put(ENDPOINTS.USER.PROFILE, formData);

      updateUser(result.user);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || oldPassword.length < 6) {
      Alert.alert(
        "Validation",
        "Current password must be at least 6 characters",
      );
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Validation", "New password must be at least 6 characters");
      return;
    }

    try {
      setPasswordLoading(true);
      await apiHandler.put(ENDPOINTS.USER.CHANGE_PASSWORD, {
        oldPassword,
        newPassword,
      });

      Alert.alert("Success", "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setShowPasswordSection(false);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressModalVisible(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressModalVisible(true);
  };

  const handleDeleteAddress = (address: Address) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete your "${address.label}" address?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAddress(address._id),
        },
      ],
    );
  };

  const handleEditProfile = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveAddress = async (data: AddressFormData) => {
    if (editingAddress) {
      await updateAddress(editingAddress._id, data);
    } else {
      await addAddress(data);
    }
  };

  return (
    <SafeAreaWrapper backgroundColor={colors.background}>
      <StackHeader title="Personal Details" back={true} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-20}
      >
        <ScrollView
          style={{ flex: 1, paddingHorizontal: spacing.screenPadding }}
          contentContainerStyle={{ paddingBottom: 10 + insets.bottom }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Image */}
          <View
            style={[
              styles.profileContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View>
              <Avatar size={96} uri={profileImage} style={styles.image} />
              <TouchableOpacity
                style={styles.blueCirlce}
                activeOpacity={0.7}
                onPress={handleEditProfile}
              >
                <Edit width={14} height={14} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Personal Info
          </Text>

          <View style={styles.inputContainer}>
            <LabeledInput
              label="First Name *"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
            />
          </View>
          <View style={styles.inputContainer}>
            <LabeledInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
            />
          </View>
          <View style={styles.inputContainer}>
            <LabeledInput
              label="Email"
              value={user?.email || ""}
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <LabeledInput
              label="Phone Number *"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
            />
          </View>

          <View style={styles.saveProfileBtn}>
            <Button
              placeholder="Save Profile"
              onPress={handleSaveProfile}
              isLoading={profileLoading}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.dark }]} />

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Security
          </Text>

          {!showPasswordSection ? (
            <TouchableOpacity
              style={styles.changePasswordBtn}
              onPress={() => setShowPasswordSection(true)}
            >
              <View style={styles.changePasswordRow}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <Text style={styles.changePasswordText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ) : (
            <View style={styles.passwordSection}>
              <View style={styles.inputContainer}>
                <LabeledInput
                  label="Current Password"
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  isPassword={true}
                  placeholder="Enter current password"
                />
              </View>
              <View style={styles.inputContainer}>
                <LabeledInput
                  label="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  isPassword={true}
                  placeholder="Enter new password"
                />
              </View>
              <View style={styles.passwordActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setShowPasswordSection(false);
                    setOldPassword("");
                    setNewPassword("");
                  }}
                >
                  <Text
                    style={[styles.cancelText, { color: colors.textSecondary }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Button
                    placeholder="Update Password"
                    onPress={handleChangePassword}
                    isLoading={passwordLoading}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.addressHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              My Addresses
            </Text>
            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={handleAddAddress}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.addAddressText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {addresses.length === 0 ? (
            <View style={styles.emptyAddressContainer}>
              <Ionicons name="location-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No addresses saved yet</Text>
              <TouchableOpacity onPress={handleAddAddress}>
                <Text style={styles.addFirstText}>
                  Add your first delivery address
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={() => handleEditAddress(address)}
                onDelete={() => handleDeleteAddress(address)}
                onSetDefault={() => setDefault(address._id)}
              />
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Address Form Modal */}
      <AddressFormModal
        visible={addressModalVisible}
        onClose={() => {
          setAddressModalVisible(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        address={editingAddress}
      />
    </SafeAreaWrapper>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingBottom: spacing.lg,
  },
  image: {
    height: 96,
    width: 96,
    borderRadius: 99,
    marginTop: spacing.xxxl,
  },
  blueCirlce: {
    backgroundColor: colors.blue,
    height: spacing.xxxl,
    width: spacing.xxxl,
    borderRadius: 99,
    position: "absolute",
    right: 0,
    bottom: 0,
    borderWidth: 4,
    borderColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    includeFontPadding: false,
  },
  inputContainer: {
    marginTop: spacing.xl,
  },
  divider: {
    height: 0.5,
    marginVertical: spacing.xxxl,
    backgroundColor: colors.gray,
  },

  saveProfileBtn: {
    marginTop: spacing.xxl,
  },

  changePasswordBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: spacing.lg,
    borderRadius: spacing.radiusMd,
    marginTop: spacing.lg,
  },
  changePasswordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  changePasswordText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
  },
  passwordSection: {
    marginTop: spacing.md,
  },
  passwordActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelBtn: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  cancelText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: "#666",
  },

  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  addAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addAddressText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  emptyAddressContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    color: "#999",
  },
  addFirstText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.primary,
    textDecorationLine: "underline",
  },
});
