import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';
import { useAuth } from '@/lib/auth/auth-context';
import { mockUserProfile, mockRecentPlans } from '@/features/user/mock-data';
import { UserBadge, Review, RecentPlan } from '@/features/user/types';

export default function ProfileScreen() {
  const { user: authUser, signOut } = useAuth();
  const user = authUser ?? mockUserProfile;

  const renderBadge = ({ item }: { item: UserBadge }) => (
    <View style={styles.badgeItem}>
      <View style={styles.badgeIconContainer}>
        <Text style={styles.badgeIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.badgeName} numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );

  const renderRecentPlan = ({ item }: { item: RecentPlan }) => (
    <View style={styles.recentPlanCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.recentPlanImage} />
      <View style={styles.recentPlanInfo}>
        <Text style={styles.recentPlanTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.recentPlanDate}>{item.date}</Text>
      </View>
    </View>
  );

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image
          source={{ uri: item.reviewerAvatarUrl }}
          style={styles.reviewerAvatar}
        />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.reviewerName}</Text>
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <AntDesign
                key={i}
                name="star"
                size={12}
                color={i < item.rating ? noctuaColors.primary : noctuaColors.textMuted}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>{item.createdAt}</Text>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
    </View>
  );

  const renderInterestTag = (interest: string, index: number) => (
    <View key={index} style={styles.interestTag}>
      <Text style={styles.interestText}>{interest}</Text>
    </View>
  );

  return (
    <ScreenContainer>
      <Pressable
        onPress={signOut}
        style={{ alignSelf: 'flex-end', marginBottom: 12, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: noctuaColors.border }}
      >
        <Text selectable style={{ color: noctuaColors.text }}>Cerrar sesión</Text>
      </Pressable>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {}}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AntDesign name="setting" size={24} color={noctuaColors.text} />
          </TouchableOpacity>

          {/* Avatar with online status */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            <View style={styles.onlineStatus} />
          </View>

          {/* User name */}
          <Text style={styles.userName}>{user.name}</Text>

          {/* Host level badge */}
          <View style={styles.hostLevelContainer}>
            <AntDesign name="star" size={16} color={noctuaColors.primary} />
            <Text style={styles.hostLevel}>{user.hostLevel}</Text>
          </View>

          {/* Rating and plan count */}
          <View style={styles.ratingRow}>
            <AntDesign name="star" size={16} color={noctuaColors.primary} />
            <Text style={styles.ratingText}>{user.rating}</Text>
            <Text style={styles.ratingSeparator}>•</Text>
            <Text style={styles.planCount}>{user.totalPlans} plans</Text>
          </View>

          {/* Edit profile button */}
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.stats.plansHosted}</Text>
            <Text style={styles.statLabel}>Plans Hosted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.stats.plansJoined}</Text>
            <Text style={styles.statLabel}>Plans Joined</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.stats.connections}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
          <View style={styles.interestsRow}>
            {user.interests.map(renderInterestTag)}
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <FlatList
            data={user.badges}
            renderItem={renderBadge}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesList}
          />
        </View>

        {/* Recent Plans Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Plans</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See all →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockRecentPlans}
            renderItem={renderRecentPlan}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentPlansList}
          />
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What people say</Text>
          <FlatList
            data={user.reviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: noctuaColors.primary,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: noctuaColors.success,
    borderWidth: 3,
    borderColor: noctuaColors.background,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: noctuaColors.text,
    marginBottom: 8,
  },
  hostLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  hostLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: noctuaColors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: noctuaColors.text,
  },
  ratingSeparator: {
    color: noctuaColors.textMuted,
    marginHorizontal: 4,
  },
  planCount: {
    fontSize: 16,
    fontWeight: '600',
    color: noctuaColors.textMuted,
  },
  editButton: {
    borderWidth: 1,
    borderColor: noctuaColors.primary,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  editButtonText: {
    color: noctuaColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: noctuaColors.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: noctuaColors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: noctuaColors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: noctuaColors.border,
    alignSelf: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: noctuaColors.text,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: noctuaColors.textMuted,
    lineHeight: 22,
    marginBottom: 16,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: noctuaColors.border,
  },
  interestText: {
    fontSize: 13,
    color: noctuaColors.text,
    fontWeight: '500',
  },
  badgesList: {
    gap: 12,
  },
  badgeItem: {
    alignItems: 'center',
    width: 80,
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: noctuaColors.surface,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeIcon: {
    fontSize: 28,
  },
  badgeName: {
    fontSize: 11,
    color: noctuaColors.textMuted,
    textAlign: 'center',
  },
  seeAllLink: {
    fontSize: 14,
    color: noctuaColors.primary,
    fontWeight: '600',
  },
  recentPlansList: {
    gap: 12,
  },
  recentPlanCard: {
    width: 140,
    backgroundColor: noctuaColors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: noctuaColors.border,
  },
  recentPlanImage: {
    width: '100%',
    height: 90,
  },
  recentPlanInfo: {
    padding: 10,
  },
  recentPlanTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: noctuaColors.text,
    marginBottom: 2,
  },
  recentPlanDate: {
    fontSize: 11,
    color: noctuaColors.textMuted,
  },
  reviewCard: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: noctuaColors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: noctuaColors.text,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: noctuaColors.textMuted,
  },
  reviewText: {
    fontSize: 14,
    color: noctuaColors.textMuted,
    lineHeight: 20,
  },
});
