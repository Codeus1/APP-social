import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';

interface JoinRequest {
    id: string;
    user: {
        id: string;
        name: string;
        avatar_url: string;
        host_level: string;
        rating: number;
    };
    status: string;
    created_at: string;
}

interface PlanPendingRequestsProps {
    requests: JoinRequest[];
    onRespond: (
        requestId: string,
        userId: string,
        status: 'accepted' | 'declined',
    ) => void;
}

export function PlanPendingRequests({
    requests,
    onRespond,
}: PlanPendingRequestsProps) {
    if (!requests || requests.length === 0) return null;

    return (
        <View>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {requests.map((req) => (
                <View key={req.id} style={styles.requestCard}>
                    <View style={styles.requestUser}>
                        <Image
                            source={{ uri: req.user.avatar_url }}
                            style={styles.requestAvatar}
                        />
                        <View>
                            <Text style={styles.requestName}>
                                {req.user.name}
                            </Text>
                            <Text style={styles.requestLevel}>
                                {req.user.host_level}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.requestActions}>
                        <Pressable
                            style={[styles.reqBtn, styles.reqBtnDecline]}
                            onPress={() =>
                                onRespond(req.id, req.user.id, 'declined')
                            }
                        >
                            <AntDesign
                                name="close"
                                size={16}
                                color={noctuaColors.text}
                            />
                        </Pressable>
                        <Pressable
                            style={[styles.reqBtn, styles.reqBtnAccept]}
                            onPress={() =>
                                onRespond(req.id, req.user.id, 'accepted')
                            }
                        >
                            <AntDesign name="check" size={16} color="#000" />
                        </Pressable>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '800',
        marginTop: 8,
        marginBottom: 4,
    },
    requestCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: noctuaColors.surface,
        borderRadius: noctuaRadii.card,
        padding: 12,
        marginTop: 8,
    },
    requestUser: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    requestAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    requestName: {
        color: noctuaColors.text,
        fontSize: 15,
        fontWeight: '700',
    },
    requestLevel: {
        color: noctuaColors.textMuted,
        fontSize: 13,
        fontWeight: '500',
    },
    requestActions: {
        flexDirection: 'row',
        gap: 8,
    },
    reqBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reqBtnDecline: {
        backgroundColor: noctuaColors.surfaceSoft,
    },
    reqBtnAccept: {
        backgroundColor: noctuaColors.primary,
    },
});
