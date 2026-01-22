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
import { LinearGradient } from 'expo-linear-gradient';

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
        <View style={styles.glassCard}>
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
                        <LinearGradient
                            colors={['#4facfe', '#00f2fe']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Ionicons name="eye-outline" size={18} color="#FFF" />
                            <Text style={styles.actionText}>İncele</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButtonContainer]}
                        onPress={() => handleDelete(item.id)}
                    >
                        <View style={styles.deleteButton}>
                            <Ionicons name="trash-outline" size={18} color="#FFF" />
                            <Text style={styles.actionText}>Sil</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>İlanlarım</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4facfe" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={ads}
                    renderItem={renderAd}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="documents-outline" size={60} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyText}>Henüz ilanınız yok.</Text>
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => navigation.navigate('CreateAd')}
                            >
                                <LinearGradient
                                    colors={['#4facfe', '#00f2fe']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.createButtonGradient}
                                >
                                    <Text style={styles.createButtonText}>Hemen İlan Ver</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    listContent: {
        padding: 20,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    cardImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 15,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4facfe',
    },
    date: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    actionButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    detailButton: {
        // gradient handles bg
    },
    deleteButtonContainer: {
        // bg handled by inner view
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 59, 48, 0.8)', // Red
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    actionText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 18,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 30,
    },
    createButton: {
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#4facfe',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    createButtonGradient: {
        paddingVertical: 15,
        paddingHorizontal: 35,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
