import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, UserPlus, Compass, Bell, Star } from 'lucide-react-native';
import { ref, onValue, get, set, remove  } from 'firebase/database';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { AuthContext } from '../AuthContext';
const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, loading } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const [favoriteTeachers, setFavoriteTeachers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // <-- Add filteredUsers state

  // Fetch users from Firebase
  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map(uid => ({
          id: uid,
          ...data[uid],
        }));
        setFeaturedUsers(usersArray);
        setFilteredUsers(usersArray); // <-- Initialize filteredUsers
      } else {
        setFeaturedUsers([]);
        setFilteredUsers([]); // <-- Initialize filteredUsers
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch topics from Firebase
  useEffect(() => {
    const topicsRef = ref(db, 'topics');
    const unsubscribe = onValue(topicsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const topicsArray = Object.keys(data).map(id => ({
          id,
          ...data[id],
        }));
        setTopics(topicsArray);
      } else {
        setTopics([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (featuredUsers.length === 0) {
      setUserRatings({});
      return;
    }

    const fetchAllRatings = async () => {
      const ratingsObj = {};
      for (const user of featuredUsers) {
        const ratingsRef = ref(db, `ratings/${user.id}`);
        const snapshot = await get(ratingsRef);
        const ratings = snapshot.val();
        if (ratings) {
          const values = Object.values(ratings).map(r => r.rating);
          ratingsObj[user.id] = values.length
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0;
        } else {
          ratingsObj[user.id] = 0;
        }
      }
      setUserRatings(ratingsObj);
    };

    fetchAllRatings();
  }, [featuredUsers]);

  // Fetch favorite teachers for the user
  useEffect(() => {
    if (!user) return;
    const favRef = ref(db, `favorites/${user.uid}`);
    const unsubscribe = onValue(favRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFavoriteTeachers(Object.values(data));
      } else {
        setFavoriteTeachers([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Always define hooks before any return!
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Place this AFTER all hooks
  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  const currentUserId = user?.uid;

  // Filtered lists based on search, and exclude current user from teachers
  const filteredTopics = topics.filter(topic =>
    topic.name?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsersExcludingCurrent = featuredUsers.filter(u => u.id !== currentUserId);

  // Helper to get user's achievements
  const getUserAchievements = () => {
    if (!user) return {};
    const myUser = featuredUsers.find(u => u.id === user.uid);
    if (!myUser) return {};
    const skillsToTeach = Array.isArray(myUser.skillsToTeach) ? myUser.skillsToTeach.length : 0;
    const skillsToLearn = Array.isArray(myUser.skillsToLearn) ? myUser.skillsToLearn.length : 0;
    const ratingsCount = Object.values(userRatings[user.uid] ? [userRatings[user.uid]] : []).length;
    const avgRating = userRatings[user.uid]?.toFixed(1) || '0.0';
    return { skillsToTeach, skillsToLearn, ratingsCount, avgRating };
  };

  const achievements = getUserAchievements();

 const toggleFavorite = (teacherId) => {
  if (!user) return;
  const favRef = ref(db, `favorites/${user.uid}/${teacherId}`);
  if (favoriteTeachers.includes(teacherId)) {
    // Remove from favorites in Firebase
    remove(favRef);
  } else {
    // Add to favorites in Firebase
    set(favRef, teacherId);
  }
};
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>SkillSwap</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => alert('Notifications coming soon!')}
        >
          <Bell color="#264653" size={24} />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Search color="#264653" size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Find skills or teachers..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#788B9A"
        />
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#264653" />
        }
      >
        {/* Featured Categories */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Explore Skills</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredTopics.map((topic) => (
              <TouchableOpacity 
                key={topic.id} 
                style={[styles.categoryCard, { backgroundColor: topic.color || '#2A9D8F' }]}
                onPress={() => alert(`You selected ${topic.name}`)}
              >
                <Text style={styles.categoryName}>{topic.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Featured Teachers */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text className="sectionTitle" style={styles.sectionTitle}>Featured Teachers</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllTeachers', { teachers: filteredUsers, userRatings })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {filteredUsersExcludingCurrent.map((user) => (
            <TouchableOpacity 
              key={user.id} 
              style={styles.teacherCard}
              onPress={() => navigation.navigate('TeacherProfile', { userId: user.id })}
            >
              <Image 
                source={
                  user.image && typeof user.image === 'string' && user.image.length > 0
                    ? { uri: user.image }
                    : require('../assets/profile.png')
                }
                style={styles.teacherImage} 
              />
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherName}>{user.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Star color="#FFD700" size={16} />
                  <Text style={{ marginLeft: 4, color: '#264653', fontWeight: 'bold' }}>
                    {userRatings[user.id]?.toFixed(1) || '0.0'} / 5
                  </Text>
                </View>
                <View style={styles.skillsContainer}>
                  {/* Skills to Teach */}
                  {user.skillsToTeach && Array.isArray(user.skillsToTeach) && user.skillsToTeach.length > 0 && (
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      flexShrink: 1,
                      marginBottom: 2,
                      maxWidth: '100%',
                    }}>
                      <Text style={{ color: '#2A9D8F', fontWeight: 'bold', marginRight: 4, fontSize: 12 }}>Teaches:</Text>
                      {user.skillsToTeach.slice(0, 3).map((skill, idx) => (
                        <View key={idx} style={styles.skillPill}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                      {user.skillsToTeach.length > 3 && (
                        <Text style={{ color: '#2A9D8F', fontSize: 12, fontWeight: 'bold', marginLeft: 4 }}>
                          +{user.skillsToTeach.length - 3} more
                        </Text>
                      )}
                    </View>
                  )}
                  {/* Skills to Learn */}
                  {user.skillsToLearn && Array.isArray(user.skillsToLearn) && user.skillsToLearn.length > 0 && (
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      flexShrink: 1,
                      marginBottom: 2,
                      maxWidth: '100%',
                    }}>
                      <Text style={{ color: '#F4A261', fontWeight: 'bold', marginRight: 4, fontSize: 12 }}>Wants:</Text>
                      {user.skillsToLearn.slice(0, 3).map((skill, idx) => (
                        <View key={idx} style={[styles.skillPill, { backgroundColor: '#FEF3E7' }]}>
                          <Text style={[styles.skillText, { color: '#F4A261' }]}>{skill}</Text>
                        </View>
                      ))}
                      {user.skillsToLearn.length > 3 && (
                        <Text style={{ color: '#F4A261', fontSize: 12, fontWeight: 'bold', marginLeft: 4 }}>
                          +{user.skillsToLearn.length - 3} more
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(user.id)}>
                <Star
                  color={favoriteTeachers.includes(user.id) ? "#FFD700" : "#2A9D8F"}
                  size={24}
                  style={styles.favoriteIcon}
                  fill={favoriteTeachers.includes(user.id) ? "#FFD700" : "none"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* What's New Section */}
        <View style={styles.whatNewContainer}>
          <Text style={styles.sectionTitle}>What's New</Text>
          {topics.slice(-3).reverse().map((topic, idx, arr) => (
            <View
              key={topic.id}
              style={[
                styles.newFeatureCard,
                idx === arr.length - 1 && { marginBottom: 0 }
              ]}
            >
              <TouchableOpacity
            key={topic.id}
            style={[
              styles.newFeatureCard,
              idx === arr.length - 1 && { marginBottom: 0 }
            ]}
            onPress={() => navigation.navigate('SkillUsers', { skill: topic.name })}
          >
            <Compass color="#fff" size={24} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>New Skill: {topic.name}</Text>
              <Text style={styles.featureDesc}>Now available to learn or teach!</Text>
            </View>
            </TouchableOpacity>
              </View>
            ))}
        </View>
        
        {/* Enhanced Achievements Section */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>My Achievements</Text>
          {user ? (
            <View style={styles.achievementsCard}>
              <View style={styles.achievementsHeader}>
                <Image 
                  source={
                    // Use the image from the database if available, otherwise fallback
                    (featuredUsers.find(u => u.id === user.uid)?.image && typeof featuredUsers.find(u => u.id === user.uid).image === 'string' && featuredUsers.find(u => u.id === user.uid).image.length > 0)
                      ? { uri: featuredUsers.find(u => u.id === user.uid).image }
                      : require('../assets/profile.png')
                  }
                  style={styles.achievementAvatar} 
                />
                <View>
                  <Text style={styles.achievementUsername}>
                    {/* Use the username from the database if available, otherwise fallback */}
                    {featuredUsers.find(u => u.id === user.uid)?.name || user.displayName || user.email}
                  </Text>
                  <Text style={styles.memberSince}>
                    Member since {new Date().toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}
                  </Text>
                </View>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Star color="#FFD700" size={18} />
                  </View>
                  <Text style={styles.statValue}>{achievements.avgRating}</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, {backgroundColor: '#E0F5F2'}]}>
                    <UserPlus color="#2A9D8F" size={18} />
                  </View>
                  <Text style={styles.statValue}>{achievements.skillsToTeach}</Text>
                  <Text style={styles.statLabel}>Teaching</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, {backgroundColor: '#FEF3E7'}]}>
                    <Compass color="#F4A261" size={18} />
                  </View>
                  <Text style={styles.statValue}>{achievements.skillsToLearn}</Text>
                  <Text style={styles.statLabel}>Learning</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.viewProfileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.viewProfileText}>View My Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.signInPromptCard}>
              <Text style={styles.signInPromptText}>Sign in to see your achievements!</Text>
              <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FDFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#264653',
    fontWeight: '500',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2A9D8F',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F5F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F5F2',
    paddingHorizontal: 16,
    paddingVertical: 9, // Decreased from 12 to 8
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#264653',
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 24,
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
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#2A9D8F',
    fontWeight: '600',
  },
  categoryCard: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 6,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  teacherCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  teacherImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F5F2',
  },
  teacherInfo: {
    flex: 1,
    marginLeft: 12,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 4,
  },
  skillsContainer: {
    flexDirection: 'column', // Change from 'row' to 'column'
    flexWrap: 'wrap',
    width: '100%',
  },
  skillPill: {
    backgroundColor: '#E0F5F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  skillText: {
    color: '#2A9D8F',
    fontSize: 12,
    fontWeight: '500',
  },
  favoriteIcon: {
    marginLeft: 6,
  },
  whatNewContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  newFeatureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A9D8F',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 14, // <-- Add this line for spacing between cards
  },
  featureTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  featureDesc: {
    color: '#E0F5F2',
    fontSize: 14,
  },
  getStartedContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00B4D8',
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  getStartedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  tipText: {
    textAlign: 'center',
    color: '#788B9A',
    marginTop: 8,
    fontSize: 14,
  },
  bottomPadding: {
    height: 80,
  },
  // Enhanced Achievements Section Styles
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  achievementsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  achievementAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#E0F5F2',
    borderWidth: 2,
    borderColor: '#2A9D8F',
  },
  achievementUsername: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#788B9A',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 40, 
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#788B9A',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
  },
  viewProfileButton: {
    backgroundColor: '#E0F5F2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewProfileText: {
    color: '#2A9D8F',
    fontWeight: '600',
    fontSize: 14,
  },
  signInPromptCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInPromptText: {
    fontSize: 16,
    color: '#264653',
    marginBottom: 16,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#2A9D8F',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

// Helper to fetch average rating for a user
const fetchAverageRating = async (userId) => {
  const ratingsRef = ref(db, `ratings/${userId}`);
  const snapshot = await get(ratingsRef);
  const ratings = snapshot.val();
  if (!ratings) return 0;
  const values = Object.values(ratings).map(r => r.rating);
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

export default HomeScreen;