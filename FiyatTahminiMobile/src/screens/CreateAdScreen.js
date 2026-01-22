import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView, // Added for better UX
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ilanAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateAdScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form State
    const [baslik, setBaslik] = useState('');
    const [fiyat, setFiyat] = useState('');
    const [kategori, setKategori] = useState('Elektronik'); // Default
    const [aciklama, setAciklama] = useState('');
    const [sehir, setSehir] = useState('');
    const [ilce, setIlce] = useState('');
    const [adres, setAdres] = useState('');

    const pickImage = async () => {
        // İzin iste
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Hata', 'Galeri izni gerekiyor!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleCreate = async () => {
        if (!baslik || !fiyat || !aciklama || !sehir || !ilce) {
            Alert.alert('Uyarı', 'Lütfen zorunlu alanları doldurun!');
            return;
        }

        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId');
            const token = await AsyncStorage.getItem('userToken');

            const formData = new FormData();
            formData.append('baslik', baslik);
            formData.append('fiyat', fiyat);
            formData.append('kategori', kategori);
            formData.append('aciklama', aciklama);
            formData.append('sehir', sehir);
            formData.append('ilce', ilce);
            formData.append('adres', adres);
            formData.append('userId', userId);

            if (image) {
                // Dosya adını ve tipini al
                let filename = image.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

                formData.append('resim', {
                    uri: image,
                    name: filename,
                    type: type,
                });
            }

            await ilanAPI.create(formData);
            Alert.alert('Başarılı', 'İlanınız oluşturuldu!', [
                { text: 'Tamam', onPress: () => navigation.navigate('Home') }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'İlan oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const CategoryButton = ({ title, active }) => (
        <TouchableOpacity
            style={[styles.catButton, active && styles.catButtonActive]}
            onPress={() => setKategori(title)}
        >
            <LinearGradient
                colors={active ? ['#4facfe', '#00f2fe'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.catButtonGradient}
            >
                <Text style={[styles.catText, active && styles.catTextActive]}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Yeni İlan Oluştur</Text>
                    </View>

                    {/* Resim Ekleme Alanı */}
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.image} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Ionicons name="camera" size={40} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.placeholderText}>Fotoğraf Ekle</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.glassCard}>
                        <Text style={styles.label}>Başlık</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Örn: iPhone 13 Pro Max"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={baslik}
                            onChangeText={setBaslik}
                        />

                        <Text style={styles.label}>Fiyat (TL)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Örn: 35000"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            keyboardType="numeric"
                            value={fiyat}
                            onChangeText={setFiyat}
                        />

                        <Text style={styles.label}>Kategori</Text>
                        <View style={styles.categories}>
                            <CategoryButton title="Elektronik" active={kategori === 'Elektronik'} />
                            <CategoryButton title="Vasıta" active={kategori === 'Vasıta'} />
                            <CategoryButton title="Ev / Emlak" active={kategori === 'Ev / Emlak'} />
                            <CategoryButton title="Giyim" active={kategori === 'Giyim'} />
                        </View>

                        <Text style={styles.label}>Açıklama</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ürün hakkında detaylı bilgi..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            multiline
                            numberOfLines={4}
                            value={aciklama}
                            onChangeText={setAciklama}
                        />

                        <Text style={styles.sectionTitle}>Konum Bilgileri</Text>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.label}>Şehir</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="İstanbul"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={sehir}
                                    onChangeText={setSehir}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>İlçe</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Kadıköy"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={ilce}
                                    onChangeText={setIlce}
                                />
                            </View>
                        </View>

                        <Text style={styles.label}>Adres Detayı</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mahalle, sokak..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={adres}
                            onChangeText={setAdres}
                        />

                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.disabledButton]}
                            onPress={handleCreate}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#4facfe', '#00f2fe']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitButtonGradient}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.submitButtonText}>İlanı Yayınla</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
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
    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 30,
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    imagePicker: {
        height: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        marginBottom: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 10,
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#FFF',
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: '#FFF',
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        gap: 10,
    },
    catButton: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    catButtonActive: {
        // gradient handles bg
    },
    catButtonGradient: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    catText: {
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    catTextActive: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 15,
        color: '#4facfe',
    },
    row: {
        flexDirection: 'row',
    },
    submitButton: {
        marginTop: 10,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#4facfe',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 6,
    },
    submitButtonGradient: {
        padding: 18,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
