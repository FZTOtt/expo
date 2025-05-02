import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import MicOn from '@/assets/icons/micon.svg';
import MicOff from '@/assets/icons/micoff.svg';
import AudioRecorder from './aidoRecorder';
import Skip from '@/assets/icons/skip.svg';

type ManageProps = {
    onRecordComplete: (audio: Blob | string) => Promise<void>;
    onNext: () => void;
  };

const Manage = ({onRecordComplete, onNext}: ManageProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>                
                <AudioRecorder onState={MicOn} offState={MicOff} size={90} onRecordComplete={onRecordComplete}></AudioRecorder>
                <TouchableOpacity style={[styles.button, styles.disabledButton]} onPress={onNext}>
                    <Skip width={40} height={40}/>
                </TouchableOpacity>
            </View >
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
        marginLeft: 70
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
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonLarge: {
      width: 90,
      height: 90,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    disabledButton: {
      opacity: 0.5,
    },
    icon: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    iconLarge: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});

export default Manage;