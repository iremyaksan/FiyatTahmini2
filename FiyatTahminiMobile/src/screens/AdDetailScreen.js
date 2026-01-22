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
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Resim */}
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

            {/* İçerik */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{ad.baslik}</Text>
                    <Text style={styles.price}>{ad.fiyat} ₺</Text>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>{ad.sehir} / {ad.ilce}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={20} color="#666" />
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

            {/* Aksiyon Butonları */}
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleCall}>
                    <Ionicons name="call-outline" size={24} color="#4A90E2" />
                    <Text style={[styles.actionText, { color: '#4A90E2' }]}>Ara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleMessage}>
                    <Ionicons name="chatbubble-outline" size={24} color="#FFF" />
                    <Text style={styles.actionText}>Mesaj Gönder</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    content: {
        padding: 20,
        paddingBottom: 100, // Footer için yer
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        marginLeft: 5,
        color: '#666',
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    sellerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 15,
        borderRadius: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4A90E2',
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
        color: '#333',
    },
    sellerRole: {
        fontSize: 14,
        color: '#999',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginHorizontal: 5,
    },
    primaryButton: {
        backgroundColor: '#4A90E2',
    },
    secondaryButton: {
        backgroundColor: '#F0F5FF',
        borderWidth: 1,
        borderColor: '#4A90E2',
    },
    actionText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
});
