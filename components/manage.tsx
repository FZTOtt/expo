import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import React from 'react';
import MicOn from '@/assets/icons/micon.svg';
import MicOff from '@/assets/icons/micoff.svg';
import AudioRecorder from './aidoRecorder';

type ManageProps = {
    onRecordComplete: (audio: Blob | string) => Promise<void>;
    onNext: () => void;
  };

const Manage = ({onRecordComplete, onNext}: ManageProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>                
                <AudioRecorder onState={MicOn} offState={MicOff} size={90} onRecordComplete={onRecordComplete}></AudioRecorder>
                <TouchableOpacity style={[styles.button]} onPress={onNext}>
                    <Text style={styles.buttonSkipText}>Пропустить</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.textDescription}>
                Варианты записи: 1) Зажать, записать, отпустить; 2) Нажать, записать, нажать
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
        gap: 30,
        marginLeft: 170
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
        color: 'white'
    }
});

export default Manage;