import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { noctuaColors } from '@/lib/theme/tokens';

export function ChatListHeader() {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Chats</Text>
            <View style={styles.actionsRow}>
                <Pressable style={styles.iconButton} hitSlop={12}>
                    <AntDesign
                        name="search"
                        size={18}
                        color={noctuaColors.text}
                    />
                </Pressable>
                <Pressable style={styles.iconButton} hitSlop={12}>
                    <AntDesign
                        name="edit"
                        size={18}
                        color={noctuaColors.text}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
        color: noctuaColors.text,
        fontSize: 28,
        fontWeight: '800',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: noctuaColors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
