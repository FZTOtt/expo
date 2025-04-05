import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const Navbar = () => {

    // useEffect(() => {
    //     // const checkNetwork = async () => {
    //     //     try {
    //     //         console.log('try network');
    //     //         const response = await fetch('https://ouzistudy.ru/api/word/get_word/hello');
                
    //     //         if (!response.ok) {
    //     //             throw new Error('Ошибка при получении аудио');
    //     //         }

    //     //         const answer = await response.formData();
    //     //         console.log('Аудио успешно получено:', answer);

    //     //         const { sound } = await Audio.Sound.createAsync(
    //     //             { uri: audioBlob } // Загружаем аудиофайл напрямую с URL
    //     //         );

    //     //         setSound(sound);
    //     //     } catch (error) {
    //     //         console.error('ошибка в checkNetwork:', error);
    //     //     }
    //     // };

    //     // checkNetwork();
        
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