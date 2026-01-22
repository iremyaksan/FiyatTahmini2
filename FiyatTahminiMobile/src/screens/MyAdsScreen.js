import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ilanAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function MyAdsScreen({ navigation }) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMyAds = async () => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                const data = await ilanAPI.getMyAds(userId);
                setAds(data);
            }
        } catch (error) {
            Alert.alert('Hata', 'İlanlarınız yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMyAds();
        }, [])
    );

    const handleDelete = (id) => {
        Alert.alert(
            'İlanı Sil',
            'Bu ilanı silmek istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ilanAPI.delete(id);
                            loadMyAds(); // Yenile
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
                        : 'https://via.placeholder.com/300'
                }}
                style={styles.cardImage}
            />
            <View style={styles.cardContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={1}>{item.baslik}</Text>
                    <Text style={styles.price}>{item.fiyat} ₺</Text>
                </View>
                <Text style={styles.date}>{item.kategori}</Text>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.detailButton]}
                        onPress={() => navigation.navigate('AdDetail', { id: item.id })}
                    >
                        <Ionicons name="eye-outline" size={20} color="#FFF" />
                        <Text style={styles.actionText}>İncele</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FFF" />
                        <Text style={styles.actionText}>Sil</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>İlanlarım</Text>
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
                        <View style={styles.emptyContainer}>
                            <Ionicons name="documents-outline" size={50} color="#CCC" />
                            <Text style={styles.emptyText}>Henüz ilanınız yok.</Text>
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => navigation.navigate('CreateAd')}
                            >
                                <Text style={styles.createButtonText}>Hemen İlan Ver</Text>
                            </TouchableOpacity>
                        </View>
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
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 15,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4ECDC4',
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginLeft: 10,
    },
    detailButton: {
        backgroundColor: '#4A90E2',
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
    },
    actionText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#999',
        marginBottom: 20,
    },
    createButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
