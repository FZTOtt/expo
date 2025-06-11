import { View, TouchableOpacity, StyleSheet, Text, useWindowDimensions } from 'react-native';
import React from 'react';
import MicOn from '@/assets/icons/micon.svg';
import MicOff from '@/assets/icons/micoff.svg';
import AudioRecorder from './aidoRecorder';
import Next from '@/assets/icons/Next.svg';

type ManageProps = {
    onRecordComplete: (audio: Blob | string) => Promise<void>;
    onNext: () => void;
    completed?: boolean 
  };

const Manage = ({onRecordComplete, onNext, completed}: ManageProps) => {

    const {width} = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>                
                <AudioRecorder onState={MicOn} offState={MicOff} size={90} onRecordComplete={onRecordComplete}></AudioRecorder>
                <TouchableOpacity style={[styles.button]} onPress={onNext}>
                    {isMobile ? 
                        <Next width={30} height={30}/>
                    :
                        <Text style={styles.buttonSkipText}>{completed ? 'Завершить' : 'Пропустить'}</Text>
                    }
                </TouchableOpacity>
            </View>
            <Text style={styles.textDescription}>
                Используйте микрофон для записи произношения
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    recognizedText: {
        marginTop: 20,
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
    },
    textContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
        position: 'absolute',
        left: 100,
        paddingHorizontal: 15,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'rgba(63, 133, 167, 1.00)',
    },
    buttonSkipText: {
        fontSize: 20,
        color: 'white'
    },
    textDescription: {
        fontSize: 16,
        paddingTop: 20,
        color: 'white',
        textAlign: 'center'
    }
});

export default Manage;