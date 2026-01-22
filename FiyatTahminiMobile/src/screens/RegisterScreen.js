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
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authAPI } from '../services/api';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Hata', 'Şifreler eşleşmiyor');
            return;
        }

        setLoading(true);
        try {
            await authAPI.register(username, email, password);
            Alert.alert('Başarılı', 'Kayıt başarılı! Giriş yapabilirsiniz.', [
                { text: 'Tamam', onPress: () => navigation.navigate('Login') },
            ]);
        } catch (error) {
            Alert.alert('Hata', 'Kayıt başarısız. Lütfen tekrar deneyin.');
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
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.emoji}>✨</Text>
                            <Text style={styles.title}>Aramıza Katıl</Text>
                            <Text style={styles.subtitle}>Saniyeler İçinde Üye Ol</Text>
                        </View>

                        <View style={styles.glassCard}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Kullanıcı adınızı belirleyin"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>E-posta</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="E-posta adresiniz"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Şifre</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Güçlü bir şifre seçin"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Şifre Tekrar</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Şifrenizi onaylayın"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={['#4facfe', '#00f2fe']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.registerButtonText}>
                                        {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                                style={styles.loginLink}
                            >
                                <Text style={styles.loginLinkText}>
                                    Zaten hesabın var mı? <Text style={styles.loginLinkBold}>Giriş Yap</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    emoji: {
        fontSize: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
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
        marginBottom: 15,
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
    registerButton: {
        marginTop: 15,
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
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginLinkText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
    },
    loginLinkBold: {
        color: '#4facfe',
        fontWeight: 'bold',
    },
});
