import React from "react";
import { ButtonProps } from "@/interfaces/componentsProps";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES } from "@/constants/theme";

const Button: React.FC<ButtonProps> = ({mode, active=false, size='lg', Icon, onClick, children, isMobile}) => {
    return (
        <TouchableOpacity onPress={onClick} style={[styles[size], styles[mode], active && styles[mode+'_active']]}>
            {mode === 'navigation' ?
                <View style={styles.navigationContent}>
                    {Icon && <Icon width={30} height={30}/>}
                    {!isMobile && <Text style={styles.navigationText}>
                        {children}
                    </Text>}
                    
                </View>
                :
                mode === 'modules' ?
                    <Text style={active ? styles[mode+'_activeText'] : styles[mode+'_passiveText']}>
                        {children}
                    </Text>
                :
                children
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    lg: {
        fontSize: FONT_SIZES.large,
        color: 'white',
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: 20
    },
    navigation: {
        borderRadius: BORDER_RADIUS.lg,
        borderColor: COLORS.borderPrimary,
        // width: '100%',
        height: 70,
        justifyContent: 'center',
        marginVertical: 15
    },
    navigation_active: {
        borderWidth: BORDER_WIDTH.md,   
        backgroundColor: 'rgba(32, 47, 54, 1)'
    },
    navigationContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    navigationText: {
        fontSize: FONT_SIZES.large,
        color: 'white',
        paddingLeft: 10
    },
    modules: {
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: BORDER_WIDTH.md,
        borderColor: COLORS.borderPrimary,
        width: '100%',
        paddingVertical: 15,
        justifyContent: 'center',
        marginVertical: 10
    },
    modules_activeText: {
        color: 'rgba(73, 192, 248, 1)',
        fontSize: FONT_SIZES.large
    },
    modules_passiveText: {
        color: 'white',
        fontSize: FONT_SIZES.large
    },
    references: {
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: BORDER_WIDTH.md,
        borderColor: COLORS.borderPrimary,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        marginVertical: 10  
    },
    references_passiveText: {
        color: 'white',
        fontSize: FONT_SIZES.large
    }
})

export default Button; 