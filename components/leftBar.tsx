import { StyleSheet, Text, View } from "react-native";
import Button from "./button";

const LeftBar = () => {

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>
                OUZI
            </Text>
            <Button mode='navigation' active={true}>СЛОВА</Button>
            <Button mode='navigation'>ФРАЗЫ</Button>
            <Button mode='navigation'>ОБЩЕНИЕ</Button>
            <Button mode='navigation'>АККАУНТ</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(19, 31, 36, 1)',
        maxWidth: 300,
        width: '30%',
        paddingHorizontal: 30,
        alignItems: 'center',
        borderRightColor: 'rgba(82, 101, 109, 1)',
        borderRightWidth: 2,
    },
    logo: {
        fontSize: 30,
        color: 'white',
        paddingVertical: 30,
    }
})

export default LeftBar;