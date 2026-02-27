import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { noctuaColors } from '@/lib/theme/tokens';

interface CoverImagePickerProps {
    imageUrl: string | null;
    onChange: (url: string) => void;
}

export function CoverImagePicker({
    imageUrl,
    onChange,
}: CoverImagePickerProps) {
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            onChange(result.assets[0].uri);
        }
    };

    return (
        <Pressable style={styles.coverImageSection} onPress={pickImage}>
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.coverImagePlaceholder}
                />
            ) : (
                <View style={styles.coverImagePlaceholder}>
                    <AntDesign
                        name="plus"
                        size={24}
                        color={noctuaColors.primary}
                    />
                    <Text style={styles.coverImageText}>Add cover photo</Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    coverImageSection: {
        marginBottom: 24,
    },
    coverImagePlaceholder: {
        height: 160,
        borderRadius: 20,
        backgroundColor: noctuaColors.surface,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    coverImageText: {
        color: noctuaColors.textMuted,
        fontSize: 14,
        marginTop: 8,
    },
});
