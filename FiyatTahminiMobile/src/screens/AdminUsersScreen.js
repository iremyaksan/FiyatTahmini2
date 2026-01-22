import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { adminAPI } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function AdminUsersScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            const data = await adminAPI.getUsers();
            setUsers(data);
        } catch (error) {
            Alert.alert('Hata', 'Kullanıcılar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = (id, name) => {
        Alert.alert(
            'Kullanıcıyı Sil',
            `${name} isimli kullanıcıyı silmek istediğinize emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminAPI.deleteUser(id);
                            loadUsers(); // Listeyi yenile
                            Alert.alert('Başarılı', 'Kullanıcı silindi');
                        } catch (error) {
                            Alert.alert('Hata', 'Silme işlemi başarısız');
                        }
                    },
                },
            ]
        );
    };

    const renderUser = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.userInfo}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.kullaniciAdi.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View>
                    <Text style={styles.username}>{item.kullaniciAdi}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <View style={[styles.roleBadge,
                    { backgroundColor: item.rol === 'ADMIN' ? '#FF6B6B' : '#4ECDC4' }
                    ]}>
                        <Text style={styles.roleText}>{item.rol}</Text>
                    </View>
                </View>
            </View>

            {item.rol !== 'ADMIN' && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id, item.kullaniciAdi)}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Kullanıcı Listesi</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUser}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Kullanıcı bulunamadı.</Text>
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
        paddingTop: 50, // Status bar için yer
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
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
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
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    roleText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 50,
    },
});
