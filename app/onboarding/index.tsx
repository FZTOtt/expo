import Manage from "@/components/manage";
import OnboardRequest from "@/components/onboardRequest";
import ReferenceModal from "@/components/referenceModal";
import TagFilter from "@/components/tagFilter";
import Target from "@/components/target";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { Dimensions, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import StatusBar from "@/components/statusBar";
import React, { useEffect, useState } from "react";
import { setFinished, setOnboarding } from "@/redux/onboard";
import { router } from "expo-router";

const OnboardingPage = () => {
    const { tags } = useAppSelector((state: RootState) => state.translated)
    const dispatch = useAppDispatch();
    const { height } = Dimensions.get('window');
    const paddingTop = height * 0.2;
    const [currentStep, setCurrentStep] = useState(0);
    const [showOnboarding, setShowOnboarding] = useState(true);

    useEffect(() => {
        dispatch(setFinished(false))
    })

    const steps = [
        {
            target: 'Target',
            title: 'Целевое слово и подсказки',
            description: 'Здесь будет отображаться слово, которое надо произнести и подсказки: справка, воспроизведение произношения слова, транскрипция',
        },
        {
            target: 'Manage',
            title: 'Управление',
            description: `1. Кнопка воспроизведения своей записи. Станет активной после записи произношения. \n2. Кнопка записи произношения. Нажмите, чтобы начать запись произношения, нажмите повторно для остановки записи. \n3. Кнопка перехода к соедующему слову.`,
        },
        {
            target: 'TagFilter',
            title: 'Темы',
            description: 'Фильтруйте слова по темам для удобного изучения',
        },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setShowOnboarding(false);
            dispatch(setOnboarding(false))
        }
    };

    const finishInboarding = () => {
        dispatch(setFinished(true))
        router.push('/')
    }

    const currentStepData = steps[currentStep];

    if (!showOnboarding) {
        return (
            <View style={[styles.container, { paddingTop }]}>
                <TouchableOpacity style={styles.finish} onPress={finishInboarding}>
                    Завершить обучение
                </TouchableOpacity>
                <OnboardRequest />
                {tags && <StatusBar style={styles.status}/>}
                <TagFilter/>
                <Target />
                <Manage />
                <ReferenceModal />

            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop }]}>
            <View style={styles.overlay} />
            
            <View style={styles.highlightWrapper}>
                {currentStepData.target === 'Target' && <Target />}
                {currentStepData.target === 'Manage' && <Manage />}
                {currentStepData.target === 'TagFilter' && <TagFilter />}
            </View>

            {/* Подсказка */}
            <View style={styles.tooltip}>
                <Text style={styles.tooltipTitle}>{currentStepData.title}</Text>
                <Text style={styles.tooltipDescription}>{currentStepData.description}</Text>
                
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                        {currentStep === steps.length - 1 ? 'Завершить' : 'Далее'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 300,
        backgroundColor: '#fff',
        position: 'relative'
    },
    status: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '20%',
        minWidth: 200,
        borderRadius: 7
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        // backgroundColor: 'rgba(0,0,0,0.5)',
    },
    highlightWrapper: {
        position: 'relative',
        zIndex: 1,
    },
    tooltip: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        zIndex: 1,
        borderWidth: 1
    },
    tooltipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tooltipDescription: {
        fontSize: 16,
        marginBottom: 20,
    },
    nextButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    finish: {
        position: 'absolute',
        right: 40,
        bottom: 50,
        fontSize: 20,
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 15,
        color: 'white',
        borderRadius: 8
    }
});

export default OnboardingPage;