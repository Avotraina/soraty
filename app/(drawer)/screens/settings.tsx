import ThemeSwitch from "@/app/components/settings/theme-switch";
import { ThemedInputPassword } from "@/app/components/themed/themed-input-password";
import { CustomColors } from "@/app/theme/colors";
import { Cloud, Folder, Lock, Palette, Shield, User } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export default function SettingsScreen() {
    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);
    

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isGoogleDriveConnected, setIsGoogleDriveConnected] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setIsChangingPassword(true);
        setTimeout(() => {
            setIsChangingPassword(false);
            Alert.alert("Success", "Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }, 1500);
    };

    const toggleGoogleDriveConnection = () => {
        if (!isGoogleDriveConnected) {
            Alert.alert(
                "Connect to Google Drive",
                "This will allow you to backup your notes to Google Drive. Do you want to proceed?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Connect",
                        onPress: () => setIsGoogleDriveConnected(true),
                    },
                ]
            );
        } else {
            Alert.alert(
                "Disconnect Google Drive",
                "Are you sure you want to disconnect?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Disconnect",
                        onPress: () => setIsGoogleDriveConnected(false),
                    },
                ]
            );
        }
    };

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.screenTitle}>Settings</Text>


                {/* Theme Switch Section */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Palette color={colors.primary} size={24} />
                        <Text style={styles.sectionTitle}>Switch theme</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <ThemeSwitch />
                    </View>
                </View>

                {/* Password Section */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Lock color={colors.primary} size={24} />
                        <Text style={styles.sectionTitle}>Change Password</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Current Password</Text>
                        {/* <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        /> */}
                        {/* <ThemedInput style={styles.input} onChangeText={setCurrentPassword} /> */}
                        <ThemedInputPassword style={styles.input} onChangeText={setCurrentPassword} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        {/* <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        /> */}
                        <ThemedInputPassword style={styles.input} onChangeText={setNewPassword} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        {/* <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        /> */}
                        <ThemedInputPassword style={styles.input} onChangeText={setConfirmPassword} />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.primaryButton,
                            isChangingPassword && styles.buttonDisabled
                        ]}
                        onPress={handleChangePassword}
                        disabled={isChangingPassword}
                    >
                        <Text style={styles.primaryButtonText}>
                            {isChangingPassword ? "Changing Password..." : "Change Password"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Folder color={colors.primary} size={24} />
                        <Text style={styles.sectionTitle}>Categories</Text>
                    </View>

                    <Text style={styles.sectionDescription}>
                        Organize your notes into custom categories
                    </Text>

                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Manage Categories</Text>
                    </TouchableOpacity>
                </View>

                {/* Google Drive */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Cloud color={colors.primary} size={24} />
                        <Text style={styles.sectionTitle}>Google Drive Backup</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.sectionDescription}>
                            Backup your notes to Google Drive
                        </Text>
                        <Switch
                            trackColor={{ false: "#d1d5db", true: colors.primary }}
                            value={isGoogleDriveConnected}
                            onValueChange={toggleGoogleDriveConnection}
                        />
                    </View>

                    <View style={styles.infoBox}>
                        <View style={styles.infoHeader}>
                            <Shield color={colors.primary} size={16} />
                            <Text style={styles.infoTitle}>Connection Status</Text>
                        </View>
                        <Text style={styles.infoText}>
                            {isGoogleDriveConnected
                                ? "Connected and backing up automatically."
                                : "Not connected. Enable to backup your notes."}
                        </Text>
                    </View>
                </View>

                {/* Account Info */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <User color={colors.primary} size={24} />
                        <Text style={styles.sectionTitle}>Account Information</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.metaLabel}>Email</Text>
                        <Text style={styles.metaValue}>user@example.com</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.metaLabel}>Member Since</Text>
                        <Text style={styles.metaValue}>January 15, 2023</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.metaLabel}>Notes Created</Text>
                        <Text style={styles.metaValue}>42 notes</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}


const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.onBackground,
        marginBottom: 24,
    },

    sectionCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 1,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 12,
        color: colors.onSurface,
    },
    sectionDescription: {
        fontSize: 16,
        color: colors.onSurfaceVariant,
        marginBottom: 16,
    },

    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        color: colors.onSurfaceVariant,
        marginBottom: 4,
    },
    input: {
        // borderWidth: 1,
        borderColor: colors.outline,
        borderRadius: 12,
        // paddingHorizontal: 16,
        // paddingVertical: 12,
        fontSize: 16,
        color: colors.onSurface,
    },

    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: "500",
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },

    infoBox: {
        backgroundColor: colors.primaryContainer,
        borderRadius: 12,
        padding: 12,
    },
    infoHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    infoTitle: {
        marginLeft: 8,
        fontWeight: "500",
        color: colors.onPrimaryContainer,
    },
    infoText: {
        fontSize: 14,
        color: colors.onPrimaryContainer,
    },

    infoRow: {
        marginBottom: 12,
    },
    metaLabel: {
        fontSize: 13,
        color: colors.onSurfaceVariant,
    },
    metaValue: {
        fontSize: 16,
        color: colors.onSurface,
        marginTop: 2,
    },
});
