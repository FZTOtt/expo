import { StyleSheet, TouchableOpacity, View, Text, Modal, Platform } from "react-native"
import Modules from "./modules";
import Reference from "./reference";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useState } from "react";
import { COLORS } from "@/constants/theme";
import { useTheme } from "@/hooks/useThemes";

const ModAndRefs = () => {

    const { deviceType } = useWindowDimensions();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const { fontSizes } = useTheme()

    if (deviceType !== 'pc') {
        return (
            <>
                <TouchableOpacity 
                    style={styles.refButton}
                    onPress={handleOpenModal}
                >
                    <Text style={[styles.refText, {fontSize: fontSizes.medium}]}>
                        Справка
                    </Text>
                </TouchableOpacity>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, Platform.OS === 'android' && {flex: 1}]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, {fontSize: fontSizes.large}]}>Справка</Text>
                                <TouchableOpacity 
                                    onPress={handleCloseModal}
                                    style={styles.closeButton}
                                >
                                    <Text style={[styles.closeButtonText, {fontSize: fontSizes.large}]}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <Reference />
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
    return (
        <View style={styles.container}>
            <Modules/>
            <Reference/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: 400,
        minWidth: 250
    },
    modules: {
        borderColor: 'rgba(82, 101, 109, 1)',
        borderBottomWidth: 2,
        height: '50%'
    },
    refButton: {
        position: 'absolute',
        top: 20,
        right: 20
    },
    refText: {
        color: 'white'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.backgroundMain,
        borderRadius: 20,
        width: '90%',
        maxHeight: '80%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    modalTitle: {
        fontWeight: 'bold',
        color: 'white',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        color: 'white',
    },
    modalBody: {
        flex: 1,
    }
})

export default ModAndRefs;