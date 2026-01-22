import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import { adminAPI } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function AdminAdsScreen({ navigation }) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAds = async () => {
        try {
            const data = await adminAPI.getAds();
            setAds(data);
        } catch (error) {
            Alert.alert('Hata', 'İlanlar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAds();
    }, []);

    const handleDelete = (id, title) => {
        Alert.alert(
            'İlanı Sil',
            `"${title}" başlıklı ilanı yayından kaldırmak istediğinize emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminAPI.deleteAd(id);
                            loadAds();
                            Alert.alert('Başarılı', 'İlan silindi');
                        } catch (error) {
                            Alert.alert('Hata', 'Silme işlemi başarısız');
                        }
                    },
                },
            ]
        );
    };

    const renderAd = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{
                    uri: item.resimYolu && !item.resimYolu.includes('default')
                        ? `https://glandular-nonopprobrious-kairi.ngrok-free.dev/uploads/images/${item.resimYolu}`
                        : 'https://via.placeholder.com/150'
                }}
                style={styles.adImage}
            />
            <View style={styles.adInfo}>
                <Text style={styles.title} numberOfLines={1}>{item.baslik}</Text>
                <Text style={styles.price}>{item.fiyat} ₺</Text>
                <View style={styles.metaRow}>
                    <Text style={styles.category}>{item.kategori}</Text>
                    <Text style={styles.city}>{item.sehir}</Text>
                </View>
                <Text style={styles.seller}>Satıcı: {item.kullanici?.kullaniciAdi || 'Bilinmiyor'}</Text>
            </View>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.baslik)}
            >
                <Ionicons name="trash-outline" size={24} color="#FFF" />
                <Text style={styles.deleteButtonText}>Sil</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>İlan Yönetimi</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={ads}
                    renderItem={renderAd}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Henüz ilan yok.</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        flexDirection: 'row',
    },
    adImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    adInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4ECDC4',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    category: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    city: {
        fontSize: 12,
        color: '#666',
    },
    seller: {
        fontSize: 12,
        color: '#999',
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    deleteButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 50,
    },
});
