import React from "react";
import { ButtonProps } from "@/interfaces/componentsProps";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";

const Button: React.FC<ButtonProps> = ({mode, active=false, size='lg', Icon, onClick, children}) => {
    return (
        <TouchableOpacity onPress={onClick} style={[styles[size], styles[mode], active && styles[mode+'_active']]}>
            {mode === 'navigation' ?
                <View style={styles.navigationContent}>
                    {Icon && <Icon width={30} height={30}/>}
                    <Text style={styles.navigationText}>
                        {children}
                    </Text>
                    
                </View>
                :
                <Text style={active ? styles[mode+'_activeText'] : styles[mode+'_passiveText']}>
                    {children}
                </Text>
                
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    lg: {
        fontSize: 20,
        color: 'white',
        borderRadius: 12,
        paddingHorizontal: 20
    },
    navigation: {
        borderRadius: 12,
        borderColor: 'rgba(63, 133, 167, 1)',
        width: '100%',
        height: 70,
        justifyContent: 'center',
        marginVertical: 15
    },
    navigation_active: {
        borderWidth: 2,
        backgroundColor: 'rgba(32, 47, 54, 1)'
    },
    navigationContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    navigationText: {
        fontSize: 20,
        color: 'white',
        paddingLeft: 10
    },
    modules: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(63, 133, 167, 1)',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        marginVertical: 10
    },
    modules_activeText: {
        color: 'rgba(73, 192, 248, 1)',
        fontSize: 20
    },
    modules_passiveText: {
        color: 'white',
        fontSize: 20
    }
})

export default Button; 