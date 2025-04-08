import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';

const Navbar = () => {

    // useEffect(() => {
    //     const checkNetwork = async () => {
    //         try {
    //             console.log('try network');
    //             const [response, payload] = await getWord('hello');
                
    //             console.log(response, payload)
    //         } catch (error) {
    //             console.error('ошибка в checkNetwork:', error);
    //         }
    //     };

    //     checkNetwork();
        
    // }, []);

    

    return (
        <View style={styles.navbar}>
            <Link href="/" style={styles.logo}>OUZI</Link>
            <Link href="/statistic" style={styles.link}>Статистика</Link>
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        width: '100%',
        height: 60,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
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
        position: 'absolute',
        left: 20,
    }
});

export default Navbar;