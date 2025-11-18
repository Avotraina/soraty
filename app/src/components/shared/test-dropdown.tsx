import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";
// import { CustomColors } from "../theme/colors";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FontAwesome6Icons from 'react-native-vector-icons/FontAwesome6';
import { CustomColors } from "../../theme/colors";


type Option = {
    label: string;
    value: string;
};

type Props = {
    options: Option[];
    defaultValue?: string;
    multiSelect?: boolean;
    searchable?: boolean;
    onSelect?: (values: string[] | string) => void;
    selectcontainerStyle?: StyleProp<ViewStyle>;
    selectTextStyle?: StyleProp<TextStyle>;
    Icon?: StyleProp<ViewStyle>;
    selectIconStyle?: StyleProp<ViewStyle | any>;
    dropdownContainerStyle?: StyleProp<ViewStyle>;
    optionStyle?: StyleProp<ViewStyle & TextStyle>;
    selectedStyle?: StyleProp<ViewStyle & TextStyle>;

};

const TestDropdown: React.FC<Props> = ({
    options,
    multiSelect = false,
    searchable = false,
    onSelect,
    selectcontainerStyle,
    selectTextStyle,
    defaultValue,
    selectIconStyle,
    dropdownContainerStyle,
    optionStyle,
    selectedStyle,
}) => {
    const buttonRef = useRef<View>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [searchText, setSearchText] = useState("");

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

    const animation = useRef(new Animated.Value(0)).current;
    const searchInputRef = useRef<TextInput>(null);

    const toggleDropdown = () => {
        if (!dropdownVisible) {
            buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
                const windowHeight = Dimensions.get("window").height;
                const dropdownHeight = Math.min(
                    200,
                    options.length * 40 + (searchable ? 40 : 0)
                );

                const spaceBelow = windowHeight - (pageY + height);
                const spaceAbove = pageY;

                setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);

                setDropdownVisible(true);
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    if (searchable) {
                        setTimeout(() => searchInputRef.current?.focus(), 100);
                    }
                });
            });
        } else {
            closeDropdown();
        }
    };

    const closeDropdown = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setDropdownVisible(false));
    };

    const handleSelect = (value: string) => {
        if (multiSelect) {
            let newValues = [...selectedValues];
            if (newValues.includes(value)) {
                newValues = newValues.filter((v) => v !== value);
            } else {
                newValues.push(value);
            }
            setSelectedValues(newValues);
            onSelect?.(newValues);
        } else {
            setSelectedValues([value]);
            onSelect?.(value);
            closeDropdown();
        }
    };

    const filteredOptions = searchable
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(searchText.toLowerCase())
        )
        : options;


    const maxDropdownHeight = 200; // max height in px
    const optionHeight = 40;
    const searchInputHeight = searchable ? 40 : 0;
    const dropdownHeight = Math.min(filteredOptions.length * optionHeight + searchInputHeight, maxDropdownHeight);

    return (
        // <View style={{ width: "100%" }}>
        <View style={{ width: "50%" }}>
            <TouchableOpacity
                ref={buttonRef}
                onPress={toggleDropdown}
                style={[styles.containerStyle, selectcontainerStyle]}
            >
                {/* <Text style={[SelectTextStyle]}>
          {selectedValues.length
            ? multiSelect
              ? selectedValues.join(", ")
              : selectedValues[0]
            : defaultValue ? options.find(el => el.value == defaultValue)?.label : "Select..."}
            : "Select..."}
        </Text> */}

                {/* <Text>dsfadasflkdsajfdaslfjlkj</Text> */}
                <Text style={[selectTextStyle]}>
                    {selectedValues.length
                        ? multiSelect
                            ? options
                                .filter((opt) => selectedValues.includes(opt.value))
                                .map((opt) => opt.label)
                                .join(", ")
                            : options.find((opt) => opt.value === selectedValues[0])?.label
                        : defaultValue
                            ? options.find((el) => el.value === defaultValue)?.label
                            : "Select..."}
                </Text>
                {/* Right side: dropdown icon */}
                <FontAwesome6Icons
                    name={dropdownVisible ? "caret-up" : "caret-down"}
                    size={24}
                    // color={colors.text}
                    style={[selectIconStyle]}
                // style={styles.icon}
                />
            </TouchableOpacity>

            {dropdownVisible && (
                <>
                    {/* Fullscreen Pressable to detect taps anywhere */}
                    <Pressable
                        style={styles.overlay}
                        onPress={closeDropdown}
                    />

                    <Animated.View
                        pointerEvents="box-none"
                        style={[
                            styles.dropdownContainer,
                            dropdownContainerStyle,
                            openUpward
                                ? { bottom: 50, top: undefined }
                                : { top: 50, bottom: undefined },
                            { opacity: animation, transform: [{ scaleY: animation }], maxHeight: dropdownHeight, height: dropdownHeight },
                        ]}
                    >
                        {searchable && (
                            <TextInput
                                placeholder="Search..."
                                value={searchText}
                                onChangeText={setSearchText}
                                style={styles.searchInput}
                                ref={searchInputRef}
                            />
                        )}

                        <FlatList
                            data={filteredOptions}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleSelect(item.value)}
                                    style={[
                                        styles.option,
                                        optionStyle,
                                        selectedValues.includes(item.value) ? selectedStyle : {},
                                        // selectedValues.includes(defaultValue as string) ? selectedStyle : {},
                                    ]}
                                >
                                    <Text
                                        style={[selectedValues.includes(item.value) ? { fontWeight: "bold" } : {}, optionStyle, selectedValues.includes(item.value) ? selectedStyle : {}]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.value}
                            // numColumns={2}
                            // columnWrapperStyle={{ justifyContent: 'space-between' }}

                            className="px-2 pt-2"
                            style={{ paddingHorizontal: 8, paddingVertical: 8, flex: 1 }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={true}
                        // scrollToOverflowEnabled
                        // getItemLayout={(_, index) => ({length: 40, offset: 40*index, index})} // optional for performance
                        // scrollEnabled


                        />

                        {/* <ScrollView
                            style={{ maxHeight: 200 }}
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                        >
                            {filteredOptions.map((opt, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleSelect(opt.value)}
                                    style={[
                                        styles.option,
                                        optionStyle,
                                        selectedValues.includes(opt.value) ? selectedStyle : {},
                                        // selectedValues.includes(defaultValue as string) ? selectedStyle : {},
                                    ]}
                                >
                                    <Text
                                        style={[selectedValues.includes(opt.value) ? { fontWeight: "bold" } : {}, optionStyle, selectedValues.includes(opt.value) ? selectedStyle : {}]}
                                    >
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView> */}
                    </Animated.View>
                </>
            )
            }
        </View >
    );
};

const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({
    containerStyle: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#e40606ff",
        // flex: 1,
        flexGrow: 1,   // expands horizontally
        flexShrink: 0, // but doesn’t shrink vertically
        alignItems: 'center',
        flexDirection: 'row',
        alignContent: 'center',
        // alignItems: 'flex-end',
        justifyContent: 'space-between',
        maxHeight: 200,
        // position: 'relative'
        // display: 'flex'
    },
    dropdownContainer: {
        position: "absolute",
        // display: 'flex',
        // flex: 1,
        // flexGrow: 1,   // expands horizontally
        // flexShrink: 0, // but doesn’t shrink vertically
        left: 0,
        right: 0,
        backgroundColor: "#800505ff",
        borderRadius: 8,
        elevation: 5,
        zIndex: -9999,
        // overflow: "scroll",
    },
    option: {
        // margin: 0,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        // flex: 1
        // overflow: 'scroll'
    },
    searchInput: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "#f9f9f9",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 500,
    },
})


export default TestDropdown;
