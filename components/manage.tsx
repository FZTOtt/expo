import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import React from 'react';
import MicOn from '@/assets/icons/micon.svg';
import MicOff from '@/assets/icons/micoff.svg';
import AudioRecorder from './aidoRecorder';
import Next from '@/assets/icons/Next.svg';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { useTheme } from '@/hooks/useThemes';

type ManageProps = {
    onRecordComplete: (audio: Blob | string) => Promise<void>;
    onNext: () => void;
    completed?: boolean 
  };

const Manage = ({onRecordComplete, onNext, completed}: ManageProps) => {

    const { deviceType } = useWindowDimensions();
    const { fontSizes } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>                
                <AudioRecorder onState={MicOn} offState={MicOff} size={90} onRecordComplete={onRecordComplete}></AudioRecorder>
                <TouchableOpacity style={[styles.button]} onPress={onNext}>
                    {deviceType === 'mobile' ? 
                        <Next width={30} height={30}/>
                    :
                        <Text style={[styles.buttonSkipText, {fontSize: fontSizes.medium}]}>{completed ? 'Завершить' : 'Пропустить'}</Text>
                    }
                </TouchableOpacity>
            </View>
            <Text style={[styles.textDescription, {fontSize: fontSizes.small}]}>
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
        color: 'white'
    },
    textDescription: {
        paddingTop: 20,
        color: 'white',
        textAlign: 'center'
    }
});

export default Manage;