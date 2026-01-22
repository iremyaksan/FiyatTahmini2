import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { ilanAPI } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const loadAd = async () => {
            try {
                const data = await ilanAPI.getDetail(id);
                setAd(data);
                const userId = await AsyncStorage.getItem('userId');
                setCurrentUserId(Number(userId));
            } catch (error) {
                Alert.alert('Hata', 'İlan detayları yüklenemedi');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        loadAd();
    }, [id]);

    const handleCall = () => {
        // Numara olmadığı için dummy action
        Alert.alert('Bilgi', 'Satıcı telefon numarası bulunamadı.');
    };

    const handleMessage = () => {
        if (!currentUserId) {
            Alert.alert('Uyarı', 'Mesaj göndermek için giriş yapmalısınız.');
            return;
        }
        if (ad.kullanici?.id === currentUserId) {
            Alert.alert('Uyarı', 'Kendi ilanınıza mesaj gönderemezsiniz.');
            return;
        }
        // Mesaj ekranına yönlendir 
        // navigation.navigate('MessageDetail', { receiverId: ad.kullanici.id, adId: ad.id });
        Alert.alert('Bilgi', 'Mesajlaşma özelliği yakında eklenecek!');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4facfe" />
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Resim */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: ad.resimYolu && !ad.resimYolu.includes('default')
                                ? `https://glandular-nonopprobrious-kairi.ngrok-free.dev/uploads/images/${ad.resimYolu}`
                                : 'https://via.placeholder.com/400'
                        }}
                        style={styles.image}
                    />
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* İçerik */}
                <View style={styles.glassContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{ad.baslik}</Text>
                        <Text style={styles.price}>{ad.fiyat} ₺</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="location-outline" size={20} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.infoText}>{ad.sehir} / {ad.ilce}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="calendar-outline" size={20} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.infoText}>Bugün</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Açıklama</Text>
                    <Text style={styles.description}>{ad.aciklama}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Satıcı Bilgileri</Text>
                    <View style={styles.sellerContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {ad.kullanici?.kullaniciAdi?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.sellerName}>{ad.kullanici?.kullaniciAdi}</Text>
                            <Text style={styles.sellerRole}>Üye</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Aksiyon Butonları Flat Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButtonContainer} onPress={handleCall}>
                    <View style={[styles.actionButton, styles.secondaryButton]}>
                        <Ionicons name="call-outline" size={24} color="#4facfe" />
                        <Text style={[styles.actionText, { color: '#4facfe' }]}>Ara</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerButtonContainer} onPress={handleMessage}>
                    <LinearGradient
                        colors={['#4facfe', '#00f2fe']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.actionButton, styles.primaryButtonGradient]}
                    >
                        <Ionicons name="chatbubble-outline" size={24} color="#FFF" />
                        <Text style={styles.actionText}>Mesaj Gönder</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f2027',
    },
    scrollContent: {
        paddingBottom: 100, // Footer için yer
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 20,
    },
    glassContent: {
        marginTop: -30,
        backgroundColor: 'rgba(23, 42, 51, 0.95)', // Slightly opaque for readability over text
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        minHeight: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    price: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#4facfe',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 12,
    },
    infoText: {
        marginLeft: 8,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#4facfe',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
    },
    sellerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4facfe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    sellerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    sellerRole: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(15, 32, 39, 0.9)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerButtonContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 15,
    },
    primaryButtonGradient: {
        // gradient
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: '#4facfe',
    },
    actionText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
});
