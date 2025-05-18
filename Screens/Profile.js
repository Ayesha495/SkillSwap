import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, get } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setProfile(snapshot.val());
        } else {
          setProfile({
            name: user.displayName || 'No Name',
            email: user.email,
            photoURL: user.photoURL,
            bio: 'No bio provided.',
            skillsToTeach: [],
            skillsToLearn: [],
          });
        }
      } catch (error) {
        setProfile({
          name: user.displayName || 'No Name',
          email: user.email,
          photoURL: user.photoURL,
          bio: 'No bio provided.',
          skillsToTeach: [],
          skillsToLearn: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0B8C7C" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F9F9" />
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profile?.image
                  ? { uri: profile.image }
                  : require('../assets/profile.png')
              }
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{profile?.name}</Text>
            <Text style={styles.email}>{profile?.email}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#0B8C7C" />
            <Text style={styles.sectionTitle}>About Me</Text>
          </View>
          <Text style={styles.bio}>{profile?.bio}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="school-outline" size={20} color="#0B8C7C" />
            <Text style={styles.sectionTitle}>Skills to Teach</Text>
          </View>
          <View style={styles.skillsContainer}>
            {profile?.skillsToTeach && profile.skillsToTeach.length > 0 ? (
              profile.skillsToTeach.map((skill, idx) => (
                <View key={idx} style={styles.skillPill}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.noSkills}>No skills listed yet</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="book-outline" size={20} color="#0B8C7C" />
            <Text style={styles.sectionTitle}>Skills to Learn</Text>
          </View>
          <View style={styles.skillsContainer}>
            {profile?.skillsToLearn && profile.skillsToLearn.length > 0 ? (
              profile.skillsToLearn.map((skill, idx) => (
                <View key={idx} style={styles.learnSkillPill}>
                  <Text style={styles.learnSkillText}>{skill}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.noSkills}>No skills listed yet</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="star" size={18} color="#FFD700" style={styles.buttonIcon} />
          <Text style={styles.favoritesButtonText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9F9',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0B8C7C',
    borderRadius: 20,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D4D56',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#5A8D9A',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 18,
    color: '#0B8C7C',
    marginLeft: 8,
  },
  bio: {
    fontSize: 16,
    color: '#2E4F4F',
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  skillPill: {
    backgroundColor: '#E0F5F2',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#D0EBE8',
  },
  skillText: {
    color: '#0B8C7C',
    fontWeight: '600',
    fontSize: 14,
  },
  learnSkillPill: {
    backgroundColor: '#E1F0FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#D1E6FF',
  },
  learnSkillText: {
    color: '#1A73E8',
    fontWeight: '600',
    fontSize: 14,
  },
  noSkills: {
    color: '#95AEBB',
    fontStyle: 'italic',
    fontSize: 15,
  },
  emptyStateContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  editButton: {
    backgroundColor: '#0B8C7C',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  favoritesButton: {
    backgroundColor: '#FFFFFF', // white interior
    borderRadius: 24,           // more pill-like
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#0B8C7C',     // teal border
    shadowColor: '#0B8C7C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  favoritesButtonText: {
    color: '#0B8C7C',           
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default ProfileScreen;