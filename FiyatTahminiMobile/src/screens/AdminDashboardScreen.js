import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { adminAPI } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboardScreen({ navigation }) {
    const [stats, setStats] = useState({
        kullaniciSayisi: 0,
        ilanSayisi: 0,
        mesajSayisi: 0,
    });
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        try {
            const data = await adminAPI.getStats();
            setStats(data);
        } catch (error) {
            Alert.alert('Hata', 'İstatistikler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const MenuItem = ({ title, icon, color, onPress }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <Ionicons name={icon} size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>{title}</Text>
            <Ionicons name="chevron-forward" size={24} color="#CCC" />
        </TouchableOpacity>
    );

    const StatCard = ({ title, value, icon, color }) => (
        <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: color }]}>
                <Ionicons name={icon} size={24} color="#FFF" />
            </View>
            <View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.headerTitle}>Yönetici Paneli 👋</Text>
                <Text style={styles.headerSubtitle}>Sistem durumu ve yönetimi</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#FFF" />
                ) : (
                    <>
                        <View style={styles.statsContainer}>
                            <StatCard
                                title="Toplam Üye"
                                value={stats.kullaniciSayisi}
                                icon="people"
                                color="#4ECDC4"
                            />
                            <StatCard
                                title="Aktif İlan"
                                value={stats.ilanSayisi}
                                icon="megaphone"
                                color="#FF6B6B"
                            />
                            <StatCard
                                title="Mesaj Trafiği"
                                value={stats.mesajSayisi}
                                icon="chatbubbles"
                                color="#FFE66D"
                            />
                        </View>

                        <View style={styles.menuContainer}>
                            <MenuItem
                                title="Kullanıcı Listesi"
                                icon="people"
                                color="#4ECDC4"
                                onPress={() => navigation.navigate('AdminUsers')}
                            />
                            <MenuItem
                                title="İlan Yönetimi"
                                icon="megaphone"
                                color="#FF6B6B"
                                onPress={() => navigation.navigate('AdminAds')}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => navigation.replace('Login')}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#FFF" />
                            <Text style={styles.logoutButtonText}>Güvenli Çıkış</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 40,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 30,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: '48%',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statTitle: {
        fontSize: 12,
        color: '#666',
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 10,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
