import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { phoneAPI } from '../services/api';

export default function PhoneEvaluationScreen({ navigation }) {
    const [phoneData, setPhoneData] = useState({
        marka: '',
        model: '',
        durum: '',
        yil: '',
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleEvaluate = async () => {
        if (!phoneData.marka || !phoneData.model) {
            Alert.alert('Hata', 'Lütfen en az marka ve model bilgilerini girin');
            return;
        }

        setLoading(true);
        try {
            const response = await phoneAPI.evaluate(phoneData);
            setResult(response);
        } catch (error) {
            Alert.alert('Hata', 'Değerleme yapılamadı. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Telefon Değerleme</Text>
                    <Text style={styles.subtitle}>AI ile telefon değerini öğren</Text>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Marka (ör: iPhone)"
                            placeholderTextColor="#999"
                            value={phoneData.marka}
                            onChangeText={(text) => setPhoneData({ ...phoneData, marka: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Model (ör: 13 Pro)"
                            placeholderTextColor="#999"
                            value={phoneData.model}
                            onChangeText={(text) => setPhoneData({ ...phoneData, model: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Durum (ör: Sıfır, İkinci El)"
                            placeholderTextColor="#999"
                            value={phoneData.durum}
                            onChangeText={(text) => setPhoneData({ ...phoneData, durum: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Yıl (ör: 2021)"
                            placeholderTextColor="#999"
                            value={phoneData.yil}
                            onChangeText={(text) => setPhoneData({ ...phoneData, yil: text })}
                            keyboardType="numeric"
                        />

                        <TouchableOpacity
                            style={styles.evaluateButton}
                            onPress={handleEvaluate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.evaluateButtonText}>Değerlendir</Text>
                            )}
                        </TouchableOpacity>

                        {result && (
                            <View style={styles.resultContainer}>
                                <Text style={styles.resultTitle}>AI Değerlendirmesi:</Text>
                                <Text style={styles.resultText}>{result.degerlendirme}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>← Geri Dön</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 30,
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    evaluateButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    evaluateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#E3F2FD',
        borderRadius: 10,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    resultText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#4A90E2',
        fontSize: 16,
    },
});
