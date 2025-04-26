import React from "react";
import { ButtonProps } from "@/interfaces/componentsProps";
import { StyleSheet, TouchableOpacity } from "react-native";

const Button: React.FC<ButtonProps> = ({mode, active=false, size='lg', icon, onClick, children}) => {

    return (
        <TouchableOpacity onPress={onClick} style={[styles[size], styles[mode], active && styles.active]}>
            {children}
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
        fontSize: 20,
        color: 'white',
        borderRadius: 12,
        borderColor: 'rgba(63, 133, 167, 1)',
        
        width: '100%',
        height: 70,
        justifyContent: 'center',
        marginVertical: 15
    },
    active: {
        borderWidth: 2,
    }
})

export default Button; 