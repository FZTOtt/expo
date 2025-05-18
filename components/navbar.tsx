import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';

const Navbar = () => {
    return (
        <View style={styles.navbar}>
            {/* <Link href="/statistic" style={styles.linkLeft}>Статистика</Link> */}
            <Link href="/" style={styles.logo}>OUZI</Link>
            {/* <Link href="/themes" style={styles.linkRight}>Темы</Link> */}
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'relative',
    },
    logo: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    linkLeft: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        position: 'absolute',
        left: 20,
    },
    linkRight: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        position: 'absolute',
        right: 20,
    }
});

export default Navbar;