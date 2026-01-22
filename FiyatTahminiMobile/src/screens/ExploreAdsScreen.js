import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ilanAPI } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreAdsScreen({ navigation }) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(null);
    const [search, setSearch] = useState('');

    const loadAds = async () => {
        setLoading(true);
        try {
            // Backend'den kategori ve arama filtresiyle çekebiliriz
            // Şimdilik hepsi endpoint'i kullanıyoruz, filtrelemeyi frontend veya backend parametreyle yaparız
            const data = await ilanAPI.getAll(category);
            setAds(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'İlanlar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadAds();
        }, [category])
    );

    const filteredAds = ads.filter(ad =>
        ad.baslik?.toLowerCase().includes(search.toLowerCase()) ||
        ad.aciklama?.toLowerCase().includes(search.toLowerCase())
    );

    const CategoryButton = ({ title, icon }) => (
        <TouchableOpacity
            style={[styles.catButton, category === title && styles.catButtonActive]}
            onPress={() => setCategory(category === title ? null : title)}
        >
            <Ionicons name={icon} size={20} color={category === title ? '#FFF' : '#333'} />
            <Text style={[styles.catText, category === title && styles.catTextActive]}>{title}</Text>
        </TouchableOpacity>
    );

    const renderAd = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AdDetail', { id: item.id })}
        >
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
                <Text style={styles.location}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    {item.sehir}, {item.ilce}
                </Text>
                <View style={styles.footerRow}>
                    <Text style={styles.categoryBadge}>{item.kategori}</Text>
                    <Text style={styles.date}>Yeni</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="İlan başlığı veya açıklama ara..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <CategoryButton title="Elektronik" icon="laptop-outline" />
                    <CategoryButton title="Vasıta" icon="car-sport-outline" />
                    <CategoryButton title="Ev / Emlak" icon="home-outline" />
                    <CategoryButton title="Giyim" icon="shirt-outline" />
                </ScrollView>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredAds}
                    renderItem={renderAd}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={50} color="#CCC" />
                            <Text style={styles.emptyText}>İlan bulunamadı</Text>
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
    searchContainer: {
        backgroundColor: '#FFF',
        padding: 15,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    searchBox: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    filterContainer: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    catButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    catButtonActive: {
        backgroundColor: '#4A90E2',
        borderColor: '#4A90E2',
    },
    catText: {
        marginLeft: 5,
        fontWeight: '500',
        color: '#333',
    },
    catTextActive: {
        color: '#FFF',
    },
    listContent: {
        padding: 10,
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
        height: 200,
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
    location: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
    categoryBadge: {
        fontSize: 12,
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        color: '#666',
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#999',
    },
});
