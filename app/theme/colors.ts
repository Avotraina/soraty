import { Theme as NavigationTheme } from '@react-navigation/native';
import { MD3Theme } from 'react-native-paper';


type NavigationColors = NavigationTheme['colors'];
type PaperColors = MD3Theme['colors'];


export type CustomColors = NavigationColors & PaperColors & {
    // background: string;

    primary: string;
    secondary: string;
    tertiary: string; //(CTA / Alert)
    notification: string; //(Highlight / Support)

    surface: string; // for cards / sheets
    text: string; // dark text for readability
    // border: string; // subtle border color

    // 🛑 Semantic
    error: string;
    warning: string;
    success: string;
    info: string;

    primaryText: string; //(headings, body)
    secondaryText: string; // (labels, hints)
    placeholderText: string; //(placeholders /disabled)

    card: string
    primaryContainer: string
    inversePrimary: string

    successContainer: string;
    infoContainer: string;
    warningContainer: string;
    errorContainer: string;

    chipsContainer?: string;

}


export const defaultColors = {
    light: {
        background: '#FAFAFA',
        // background: '#BDE0FE',
        primary: '#4F46E5', // focused menu item, text on button, Text
        secondary: '#FF6B6B',
        tertiary: '#6B7280',
        notification: '#FACC15',
        surface: '#FFFFFF',
        text: '#111827',
        // border: '#D0D0D0',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#22C55E',
        info: '#3B82F6',
        primaryText: '#1F2937',
        secondaryText: '#6B7280',
        placeholderText: '#9CA3AF',
        primaryContainer: '#E0E7FF',
        inversePrimary: '#FFFFFF',
        card: '#F5F5F5', // Header and drawer background

        successContainer: '#DCFCE7',
        infoContainer: '#DBEAFE',
        errorContainer: '#FEE2E2',
        warningContainer: '#FEF3C7',

        chipsContainer: '#F1F5F9',
        // onPrimary: '#ee0b0bde', 

        // backdrop: '#00000099',


    } as CustomColors,

    dark: {
        background: '#0F1115',
        primary: '#818CF8',
        secondary: '#FF8A8A',
        tertiary: '#9CA3AF',
        notification: '#FACC15',
        // surface: '#FFFFFF',
        // surface: '#1E2025',
        surface: '#1A1C20',
        text: '#F3F4F6',
        border: '#D0D0D0',
        error: '#FF4D4D',
        warning: '#F39C12',
        success: '#2ECC71',
        info: '#3498DB',
        primaryText: '#F9FAFB',
        secondaryText: '#9CA3AF',
        placeholderText: '#6B7280',
        card: '#16181B', // (Drawer and header background)
        shadow: '#ffffffff',

        successContainer: '#d4edda',
        infoContainer: '#cce5ff',
        errorContainer: '#f8d7da',
        warningContainer: '#fff3cd',
        backdrop: '#000000CC',


        chipsContainer: '#1E293B',
    } as CustomColors,
};