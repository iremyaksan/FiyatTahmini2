import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authAPI } from '../services/api';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.login(username, password);
            // Başarılı giriş - Ana sayfaya yönlendir
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Hata', 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.emoji}>🚀</Text>
                        <Text style={styles.title}>Fiyat Tahmini</Text>
                        <Text style={styles.subtitle}>Giriş Yap ve Başla</Text>
                    </View>

                    <View style={styles.glassCard}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Kullanıcı adınızı girin"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Şifre</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Şifrenizi girin"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#4facfe', '#00f2fe']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.loginButtonText}>
                                    {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            style={styles.registerLink}
                        >
                            <Text style={styles.registerLinkText}>
                                Hesabın yok mu? <Text style={styles.registerLinkBold}>Kayıt Ol</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    emoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 5,
        letterSpacing: 0.5,
    },
    glassCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    loginButton: {
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#4facfe',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    registerLink: {
        marginTop: 25,
        alignItems: 'center',
    },
    registerLinkText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
    },
    registerLinkBold: {
        color: '#4facfe',
        fontWeight: 'bold',
    },
});
