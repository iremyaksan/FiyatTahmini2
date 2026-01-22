import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
    return (
        <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Fiyat Tahmin Platformu</Text>
                    <Text style={styles.subtitle}>Doğru Fiyat, Hızlı Ticaret</Text>

                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => navigation.navigate('PricePrediction')}
                        >
                            <Text style={styles.menuButtonIcon}>📊</Text>
                            <Text style={styles.menuButtonText}>Fiyat Tahmini</Text>
                            <Text style={styles.menuButtonSubtext}>Ürün fiyatını tahmin et</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => navigation.navigate('PhoneEvaluation')}
                        >
                            <Text style={styles.menuButtonIcon}>📱</Text>
                            <Text style={styles.menuButtonText}>Telefon Değerleme</Text>
                            <Text style={styles.menuButtonSubtext}>AI ile telefon değerlendir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => {
                                // Çıkış yap
                                navigation.replace('Login');
                            }}
                        >
                            <Text style={styles.menuButtonIcon}>🚪</Text>
                            <Text style={styles.menuButtonText}>Çıkış Yap</Text>
                            <Text style={styles.menuButtonSubtext}>Hesaptan çık</Text>
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
        marginBottom: 40,
    },
    menuContainer: {
        gap: 20,
    },
    menuButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    menuButtonIcon: {
        fontSize: 48,
        marginBottom: 10,
    },
    menuButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    menuButtonSubtext: {
        fontSize: 14,
        color: '#666',
    },
});
