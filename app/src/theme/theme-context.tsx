import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationLightTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { CustomColors, defaultColors } from "./colors";
// import { AsyncStorage } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from "react-native";
import { MD3Theme, MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperLightTheme } from 'react-native-paper';

const STORAGE_KEY = 'USER_THEME_PREFERENCE';

export type AppTheme = MD3Theme & NavigationTheme;

const mergeThemes = (paperTheme: typeof PaperLightTheme | typeof PaperDarkTheme,
    navigationTheme: typeof NavigationLightTheme | typeof NavigationDarkTheme,
    colors: CustomColors): AppTheme => ({
        ...paperTheme,
        ...navigationTheme,
        // ... paperTheme.colors,
        // ... navigationTheme.colors,
        colors: {
            ...paperTheme.colors,
            ...navigationTheme.colors,
            ...colors,
        },
        // ...colors,
        fonts: { ...paperTheme.fonts, ...navigationTheme.fonts },
    })


type ThemeContextType = {
    isDark: boolean;
    theme: typeof PaperLightTheme & typeof NavigationLightTheme & AppTheme;
    // theme: typeof PaperLightTheme | typeof NavigationLightTheme;
    toggleTheme: () => void;
    setCustomColors: (colors: Partial<CustomColors>) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    colorScheme: 'light' | 'dark' | null | undefined;
};


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);



export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [customColors, setCustomColorsState] = useState<CustomColors>(defaultColors.light);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved preference
    useEffect(() => {
        (async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedTheme === 'dark') {
                    setIsDark(true)
                    setColorScheme('dark')
                    Appearance.setColorScheme('dark')
                }
                else if (savedTheme === 'light') {
                    setIsDark(false)
                    setColorScheme('light')
                    Appearance.setColorScheme('light')
                };
            } catch (e) {
                console.warn('Failed to load theme preference', e);
            } finally {
                setIsLoaded(true);
            }
        })();
    }, []);

    // Listen to system theme changes if no manual preference
    useEffect(() => {
        const listener = Appearance.addChangeListener(({ colorScheme }) => {
            if (!(isLoaded && AsyncStorage.getItem(STORAGE_KEY))) {
                setIsDark(colorScheme === 'dark');
                setColorScheme(colorScheme)
                Appearance.setColorScheme(colorScheme)

            }
        });
        return () => listener.remove();
    }, [isLoaded]);

    const toggleTheme = async () => {
        const newValue = !isDark;
        setIsDark(newValue);
        setColorScheme(newValue ? 'dark' : 'light');
        Appearance.setColorScheme(newValue ? 'dark' : 'light')

        try {
            await AsyncStorage.setItem(STORAGE_KEY, newValue ? 'dark' : 'light');
        } catch (e) {
            console.warn('Failed to save theme preference', e);
        }
    };

    const setTheme = async (theme: 'light' | 'dark' | 'system') => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, theme);
            setIsDark(theme === 'dark');
            setColorScheme(theme === 'dark' ? 'dark' : 'light');
        } catch (e) {
            console.warn('Failed to save theme preference', e);
        }
    };

    const setCustomColors = (colors: Partial<CustomColors>) => {
        setCustomColorsState((prev: any) => ({ ...prev, ...colors }));
    };

    const baseColors = isDark ? defaultColors.dark : defaultColors.light;
    const theme = mergeThemes(
        isDark ? PaperDarkTheme : PaperLightTheme,
        isDark ? NavigationDarkTheme : NavigationLightTheme,
        baseColors
        // { ...baseColors, ...customColors }
    );

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, theme, setCustomColors, setTheme, colorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useThemeContext must be used within ThemeProvider');
    return context;
};



// import { createContext } from "react";

// export type ThemeContextType = {
//     currentTheme: 'light' | 'dark' | 'system';
//     toggleTheme: (newTheme: 'light' | 'dark' | 'system') => void;
// }


// export const ThemeContext = createContext<ThemeContextType>({
//     currentTheme: 'light',
//     toggleTheme: (newTheme: 'light' | 'dark' | 'system') => { },
// });

// const themeProviderValue: ThemeContextType = {