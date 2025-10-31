// SnackbarProvider.tsx
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomColors } from '../theme/colors';
// import { useTheme } from '@react-navigation/native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

type SnackbarVariant = 'success' | 'error' | 'info' | 'warning';

type SnackbarContextType = {
    showSnackbar: (
        message: string,
        variant?: SnackbarVariant,
        duration?: number
    ) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
    showSnackbar: () => { },
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState<SnackbarVariant>('info');
    const [duration, setDuration] = useState(3000);

    // const { colors } = useTheme();
    const { colors } = useTheme();

    const styles = makeStyles(colors);

    // const fadeAnim = new Animated.Value(0);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const animateIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const animateOut = (callback?: () => void) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(callback);
    };

    const showSnackbar = useCallback(
        (msg: string, type: SnackbarVariant = 'info', dur = 3000) => {
            // setVisible(false);
            // Alert.alert(msg);
            setMessage(msg);
            setVariant(type);
            setDuration(dur);
            setVisible(true);
            animateIn();
        },
        []
    );

    const onDismiss = () => {
        animateOut(() => setVisible(false));
    };

    const getVariantStyle = () => {
        switch (variant) {
            case 'success':
                // return { color: styles.success.color, backgroundColor: styles.success.backgroundColor, icon: 'check-circle' };
                return { color: styles.success.color, backgroundColor: (colors as CustomColors).successContainer, icon: 'check-circle' };

            case 'error':
                // return { color: '#C62828', backgroundColor: '#FFCDD2', icon: 'alert-circle' };
                return { color: styles.error.color, backgroundColor: styles.error.backgroundColor, icon: 'alert-circle' };
            case 'warning':
                // return { color: '#F57C00', backgroundColor: '#FFE0B2', icon: 'alert' };

                return { color: styles.warning.color, backgroundColor: styles.warning.backgroundColor, icon: 'alert' };
            default:
                // return { color: '#0277BD', backgroundColor: '#BBDEFB', icon: 'information' };
                return { color: styles.info.color, backgroundColor: styles.info.backgroundColor, icon: 'information' };

        }
    };

    const { backgroundColor, color, icon } = getVariantStyle();

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {/* <Portal> */}
            {visible && (
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        transform: [{ translateY: -28 }], // center vertically (adjust for height)
                        alignItems: 'center', // center horizontally
                        // zIndex: 99999999
                    }}
                >
                    <Snackbar
                        visible={visible}
                        onDismiss={onDismiss}
                        duration={duration}
                        style={{
                            // ...snackbarStyles,
                            backgroundColor,
                            borderRadius: 12,
                            // marginBottom: 16,
                            // marginHorizontal: 12,
                            // position: 'absolute',
                            alignSelf: 'center',
                            // bottom: 16,
                        }}
                    >
                        <Text style={{ fontWeight: '600', color: color }}>
                            <MaterialCommunityIcons name={icon} size={18} color={color} /> {message}
                        </Text>
                    </Snackbar>
                </Animated.View>
            )}
            {/* </ Portal> */}
        </SnackbarContext.Provider>
    );
};


const makeStyles = (colors: CustomColors & MD3Colors | MD3Colors | any) => StyleSheet.create({
    success: {
        backgroundColor: colors.successContainer,
        color: colors.success,
    },
    error: {
        backgroundColor: colors.errorContainer,
        color: colors.error,
    },
    info: {
        backgroundColor: colors.infoContainer,
        color: colors.info,
    },
    warning: {
        backgroundColor: colors.warningContainer,
        color: colors.warning,
    },
})