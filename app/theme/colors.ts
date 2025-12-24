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
        background: '#eef7ffff',
        // background: '#BDE0FE',
        primary: '#A2D2FF', // focused menu item, text on button, Text
        secondary: '#FFAFCC',
        tertiary: '#CDB4DB',
        notification: '#FFC8DD',
        surface: '#FFFFFF',
        text: '#1A1A1A',
        // border: '#D0D0D0',
        error: '#FF4D4D',
        warning: '#F39C12',
        success: '#2ECC71',
        info: '#3498DB',
        primaryText: '#474747ff',
        secondaryText: '#4A4A4A',
        placeholderText: '#7A7A7A',
        primaryContainer: '#A2D2FF',
        inversePrimary: '#1A1A1A',
        card: '#eef7ffff', // Header and drawer background

        successContainer: '#d4edda',
        infoContainer: '#cce5ff',
        errorContainer: '#f8d7da',
        warningContainer: '#fff3cd',



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


        chipsContainer: '#1E293B',
    } as CustomColors,
};