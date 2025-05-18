import LeftBar from "@/components/leftBar";
import RightBar from "@/components/rightBar";
import { View, StyleSheet } from "react-native";
import Account from "@/components/account";

const AccountPage = () => {
    return (
        <View style={styles.container}>
            <LeftBar />
            <Account />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(19, 31, 36, 1)',
        flexDirection: 'row'
    },
});
export default AccountPage;