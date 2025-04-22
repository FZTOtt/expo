import { useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import React from "react"
import { View, StyleSheet, Text } from "react-native"

interface StatusBarProps {
    style?: object;
  }

const StatusBar = ({ style }: StatusBarProps) => {

    const { completedWords, totalWords } = useAppSelector((state: RootState) => state.translated);
    if (!completedWords && !totalWords) {
      return null
    } else {
      const progress = Math.min(completedWords / totalWords, 1);
      const progressPercent = `${progress * 100}%`;
      
      return (
          <View style={[styles.container, style]}>
              <View style={styles.backgroundBar}>
                  <View style={[styles.progressBar, { width: progressPercent }]} />
              </View>
              
              <View style={styles.textContainer}>
                  <Text style={styles.progressText}>
                      {completedWords}/{totalWords}
                  </Text>
              </View>
        </View>
      )
    }

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
    },
});


export default StatusBar;