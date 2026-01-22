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
        <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerEmoji}>📊</Text>
                        <Text style={styles.title}>Fiyat Tahmin</Text>
                        <Text style={styles.subtitle}>Doğru Fiyat, Hızlı Ticaret</Text>
                    </View>

                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuCard}
                            onPress={() => navigation.navigate('PricePrediction')}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                style={styles.glassInner}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(79, 172, 254, 0.2)' }]}>
                                    <Text style={styles.menuButtonIcon}>💹</Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.menuButtonText}>Fiyat Tahmini</Text>
                                    <Text style={styles.menuButtonSubtext}>Yapay zeka ile ürün fiyatını öğren</Text>
                                </View>
                                <Text style={styles.arrowIcon}>→</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuCard}
                            onPress={() => navigation.navigate('PhoneEvaluation')}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                style={styles.glassInner}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(246, 79, 89, 0.2)' }]}>
                                    <Text style={styles.menuButtonIcon}>📱</Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.menuButtonText}>Telefon Değerleme</Text>
                                    <Text style={styles.menuButtonSubtext}>Telefonunun gerçek değerini bul</Text>
                                </View>
                                <Text style={styles.arrowIcon}>→</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuCard}
                            onPress={() => navigation.replace('Login')}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                style={styles.glassInner}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                                    <Text style={styles.menuButtonIcon}>🚪</Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.menuButtonText}>Çıkış Yap</Text>
                                    <Text style={styles.menuButtonSubtext}>Oturumu sonlandır</Text>
                                </View>
                            </LinearGradient>
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
    headerContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    headerEmoji: {
        fontSize: 48,
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginTop: 5,
        letterSpacing: 0.5,
    },
    menuContainer: {
        gap: 20,
    },
    menuCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    glassInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuButtonIcon: {
        fontSize: 30,
    },
    textContainer: {
        flex: 1,
    },
    menuButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    menuButtonSubtext: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    arrowIcon: {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 'bold',
    },
});
