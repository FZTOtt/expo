import React from "react"
import { View, StyleSheet, Text } from "react-native"

interface StatusBarProps {
    current?: number;
    goal?: number;
    style?: object;
  }

const StatusBar = ({ current=10, goal=30, style }: StatusBarProps) => {

    const progress = Math.min(current / goal, 1);
    const progressPercent = `${progress * 100}%`;
    
    return (
        <View style={[styles.container, style]}>
            <View style={styles.backgroundBar}>
                <View style={[styles.progressBar, { width: progressPercent }]} />
            </View>
            
            {/* Текст с прогрессом по центру */}
            <View style={styles.textContainer}>
                <Text style={styles.progressText}>
                    {current}/{goal}
                </Text>
            </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      height: 30,
      justifyContent: 'center',
      borderWidth: 1
    //   position: 'relative',
    },
    backgroundBar: {
      height: 28,
      width: 1000,
      backgroundColor: 'white',
      borderRadius: 5,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#4CAF50',
      borderRadius: 5,
    },
    textContainer: {
      position: 'absolute',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
    },
});


export default StatusBar;