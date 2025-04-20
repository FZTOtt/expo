import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';

const Navbar = () => {

    return (
        <View style={styles.navbar}>
            <Link href="/statistic" style={styles.link}>Статистика</Link>
            <Link href="/" style={styles.logo}>OUZI</Link>
            <Link href="/themes" style={styles.link}>Темы</Link>
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        width: '100%',
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#555',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    link: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        // position: 'absolute',
        // left: 20,
    }
});

export default Navbar;