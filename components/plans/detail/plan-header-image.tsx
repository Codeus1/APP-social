import { View, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

interface PlanHeaderImageProps {
    imageUrl: string | null;
    isHost: boolean;
    isDeleting?: boolean;
    onBack: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function PlanHeaderImage({
    imageUrl,
    isHost,
    isDeleting,
    onBack,
    onEdit,
    onDelete,
}: PlanHeaderImageProps) {
    const defaultHero =
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800';
    return (
        <View style={styles.heroWrapper}>
            <Image
                source={{ uri: imageUrl || defaultHero }}
                style={styles.heroImage}
            />
            <SafeAreaView style={styles.topBar} edges={['top']}>
                <Pressable style={styles.topButton} onPress={onBack}>
                    <AntDesign name="arrow-left" size={20} color="#fff" />
                </Pressable>

                <View style={styles.topBarRight}>
                    {isHost && (
                        <>
                            {onEdit && (
                                <Pressable
                                    style={styles.topButton}
                                    onPress={onEdit}
                                >
                                    <AntDesign
                                        name="edit"
                                        size={20}
                                        color="#fff"
                                    />
                                </Pressable>
                            )}
                            {onDelete && (
                                <Pressable
                                    style={[
                                        styles.topButton,
                                        {
                                            backgroundColor:
                                                'rgba(255,50,50,0.6)',
                                        },
                                    ]}
                                    onPress={onDelete}
                                    disabled={isDeleting}
                                >
                                    <AntDesign
                                        name="delete"
                                        size={20}
                                        color="#fff"
                                    />
                                </Pressable>
                            )}
                        </>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    heroWrapper: {
        height: 320,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    topBarRight: {
        flexDirection: 'row',
        gap: 10,
    },
    topButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
