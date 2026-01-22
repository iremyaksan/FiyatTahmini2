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
import { predictionAPI } from '../services/api';

export default function PricePredictionScreen({ navigation }) {
    const [formData, setFormData] = useState({
        marka: '',
        model: '',
        yil: '',
        km: '',
        yakit: '',
        vites: '',
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        if (!formData.marka || !formData.model || !formData.yil || !formData.km) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        setLoading(true);
        try {
            const response = await predictionAPI.predict(formData);
            setResult(response);
        } catch (error) {
            Alert.alert('Hata', 'Tahmin yapılamadı. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Fiyat Tahmini</Text>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Marka (ör: Toyota)"
                            placeholderTextColor="#999"
                            value={formData.marka}
                            onChangeText={(text) => setFormData({ ...formData, marka: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Model (ör: Corolla)"
                            placeholderTextColor="#999"
                            value={formData.model}
                            onChangeText={(text) => setFormData({ ...formData, model: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Yıl (ör: 2020)"
                            placeholderTextColor="#999"
                            value={formData.yil}
                            onChangeText={(text) => setFormData({ ...formData, yil: text })}
                            keyboardType="numeric"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Kilometre (ör: 50000)"
                            placeholderTextColor="#999"
                            value={formData.km}
                            onChangeText={(text) => setFormData({ ...formData, km: text })}
                            keyboardType="numeric"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Yakıt Tipi (ör: Benzin)"
                            placeholderTextColor="#999"
                            value={formData.yakit}
                            onChangeText={(text) => setFormData({ ...formData, yakit: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Vites (ör: Otomatik)"
                            placeholderTextColor="#999"
                            value={formData.vites}
                            onChangeText={(text) => setFormData({ ...formData, vites: text })}
                        />

                        <TouchableOpacity
                            style={styles.predictButton}
                            onPress={handlePredict}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.predictButtonText}>Tahmin Et</Text>
                            )}
                        </TouchableOpacity>

                        {result && (
                            <View style={styles.resultContainer}>
                                <Text style={styles.resultTitle}>Tahmini Fiyat:</Text>
                                <Text style={styles.resultPrice}>{result.tahminiFiyat} TL</Text>
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
    predictButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    predictButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#E8F5E9',
        borderRadius: 10,
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
    resultPrice: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
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
