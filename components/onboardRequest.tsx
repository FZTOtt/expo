import { useAppDispatch, useAppSelector } from '@/hooks';
import { setOnboarding, setRequestOnboard } from '@/redux/onboard';
import { RootState } from '@/redux/store';
import { setReloadTargetWord } from '@/redux/translated';
import { router } from 'expo-router';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

const OnboardRequest = () => {
    const dispatch = useAppDispatch();
    const { requestOnboard } = useAppSelector((state: RootState) => state.onboard)
    if (!requestOnboard) {
        return null
    }

    const rejectOnboard = () => {
        dispatch(setRequestOnboard(false))
    }

    const acceptOnboard = () => {
        dispatch(setRequestOnboard(false))
        dispatch(setOnboarding(true))
        router.navigate('/onboarding')
    }
    return (
        <View style={styles.container}>
            <View style={styles.requestContainer}>
                <Text style={{fontSize: 20}}>
                    Впервые на сайте?
                </Text>
                <Text style={{fontSize: 20}}>
                    Пройдите обучение!
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.rejectButton}>
                    <Text style={styles.rejectText} onPress={rejectOnboard}>
                        Нет 
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton} onPress={acceptOnboard}>
                    <Text style={styles.acceptText}>
                        Да!
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        borderWidth: 1,
        borderRadius: 5,
        // width: 200,
        // height: 100,
        right: 100,
        top: 100,
        padding: 10
    },
    requestContainer: {
        alignItems: 'center',
        
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15
    },
    acceptButton: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: 'green',
        borderRadius: 5
    },
    acceptText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '400'
    },
    rejectButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'red',
        borderRadius: 5
    },
    rejectText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '400'
    }
})

export default OnboardRequest;