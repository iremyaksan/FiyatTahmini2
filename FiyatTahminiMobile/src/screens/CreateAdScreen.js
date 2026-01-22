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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ilanAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
            <Text style={[styles.catText, active && styles.catTextActive]}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Yeni İlan Oluştur</Text>

            {/* Resim Ekleme Alanı */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="camera" size={40} color="#666" />
                        <Text style={styles.placeholderText}>Fotoğraf Ekle</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.form}>
                <Text style={styles.label}>Başlık</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Örn: iPhone 13 Pro Max"
                    value={baslik}
                    onChangeText={setBaslik}
                />

                <Text style={styles.label}>Fiyat (TL)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Örn: 35000"
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
                            value={sehir}
                            onChangeText={setSehir}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>İlçe</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Kadıköy"
                            value={ilce}
                            onChangeText={setIlce}
                        />
                    </View>
                </View>

                <Text style={styles.label}>Adres Detayı</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mahalle, sokak..."
                    value={adres}
                    onChangeText={setAdres}
                />

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>İlanı Yayınla</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        marginTop: 30,
    },
    imagePicker: {
        height: 200,
        backgroundColor: '#F0F0F0',
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 10,
        color: '#666',
    },
    form: {
        marginBottom: 50,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        backgroundColor: '#F9F9F9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    catButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        marginRight: 10,
        marginBottom: 10,
    },
    catButtonActive: {
        backgroundColor: '#4A90E2',
    },
    catText: {
        color: '#666',
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
        color: '#4A90E2',
    },
    row: {
        flexDirection: 'row',
    },
    submitButton: {
        backgroundColor: '#4A90E2',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#A0C4E8',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
