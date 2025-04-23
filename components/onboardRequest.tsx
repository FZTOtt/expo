import { useAppDispatch, useAppSelector } from '@/hooks';
import { RootState } from '@/redux/store';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

const OnboardRequest = () => {
    const dispatch = useAppDispatch();
    const { requestOnboard } = useAppSelector((state: RootState) => state.onboard)
    if (!requestOnboard) {
        return null
    }
    return (
        <View style={styles.container}>
            <View style={styles.requestContainer}>
                <Text>
                    Впервые на сайте?
                </Text>
                <Text>
                    Пройдите обучение!
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.rejectButton}>
                    <Text >
                        не  
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton}>
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
        fontSize: 16,
        color: 'white',
        fontWeight: '400'
    },
    rejectButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 16,
        color: 'red'
    }
})

export default OnboardRequest;