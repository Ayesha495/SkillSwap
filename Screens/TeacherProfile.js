import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Star, UserPlus } from 'lucide-react-native';
import { ref, get, set, push, remove, onValue } from 'firebase/database';
import { db } from '../firebase';
import { AuthContext } from '../AuthContext';

const TeacherProfile = ({ route }) => {
  const { userId } = route.params;
  const { user } = useContext(AuthContext);
  const [teacher, setTeacher] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [showFullBio, setShowFullBio] = useState(false);
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Fetch teacher data
    const fetchTeacher = async () => {
      const snapshot = await get(ref(db, `users/${userId}`));
      setTeacher(snapshot.val());
    };
    // Fetch ratings
    const fetchRatings = async () => {
      const ratingsRef = ref(db, `ratings/${userId}`);
      const snapshot = await get(ratingsRef);
      const data = snapshot.val() || {};
      setRatings(Object.values(data));
      const values = Object.values(data).map(r => r.rating);
      setAverageRating(values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
    };
    fetchTeacher();
    fetchRatings();
  }, [userId]);

  // Favorite logic
  useEffect(() => {
    if (!user) return;
    const favRef = ref(db, `favorites/${user.uid}/${userId}`);
    const unsubscribe = onValue(favRef, (snapshot) => {
      setIsFavorite(!!snapshot.exists());
    });
    return () => unsubscribe();
  }, [user, userId]);

  const handleToggleFavorite = () => {
    if (!user) {
      Alert.alert('You must be logged in to favorite a teacher');
      return;
    }
    const favRef = ref(db, `favorites/${user.uid}/${userId}`);
    if (isFavorite) {
      remove(favRef);
    } else {
      set(favRef, userId);
    }
  };

  const handleSubmitRating = async () => {
    if (!myRating) {
      Alert.alert('Please select a rating');
      return;
    }
    if (!user?.uid) {
      Alert.alert('You must be logged in to rate');
      return;
    }
    await set(ref(db, `ratings/${userId}/${user.uid}`), {
      rating: myRating,
      comment: myComment,
    });
    Alert.alert('Thank you for your rating!');
    setMyRating(0);
    setMyComment('');
  };

  // --- Connect Button ---
  const handleConnect = async () => {
    if (!user?.uid) {
      Alert.alert('You must be logged in to connect');
      return;
    }
    // Send a notification (store in Firebase under notifications)
    const notifRef = push(ref(db, `notifications/${userId}`));
    await set(notifRef, {
      from: user.uid,
      type: 'connect_request',
      message: `${user.displayName || 'A user'} wants to connect with you!`,
      timestamp: Date.now(),
    });
    Alert.alert('Connection request sent!');
  };

  if (!teacher) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scrollView}>
      {/* Dynamic header background */}
      <View style={[
        styles.headerBackground,
      ]} />
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={
              teacher.image && typeof teacher.image === 'string' && teacher.image.length > 0
                ? { uri: teacher.image }
                : require('../assets/profile.png')
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>{teacher.name}</Text>
          {/* REMOVE the favorite button here */}
          {/* ...bio and rating... */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={styles.bio}
              numberOfLines={showFullBio ? undefined : 1}
              ellipsizeMode="tail"
            >
              {teacher.bio}
            </Text>
            {teacher.bio && teacher.bio.length > 40 && (
              <TouchableOpacity onPress={() => setShowFullBio(!showFullBio)}>
                <Text style={styles.viewMoreText}>
                  {showFullBio ? 'View Less' : 'View More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Star color="#FFD700" size={20} />
            <Text style={styles.ratingText}>{averageRating.toFixed(1)} / 5</Text>
          </View>
        </View>

        {/* Place Connect and Favorite buttons here, side by side */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
          <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
            <UserPlus color="#fff" size={18} />
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleFavorite} style={[styles.favoriteButton, { marginLeft: 10 }]}>
            <Star
              color="#2A9D8F"
              size={24}
              fill={isFavorite ? "#2A9D8F" : "none"}
            />
            <Text style={{
              color: "#2A9D8F",
              fontWeight: 'bold',
              marginLeft: 6,
              fontSize: 15,
            }}>
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Skills to Teach</Text>
          <View style={styles.skillsContainer}>
            {teacher.skillsToTeach && teacher.skillsToTeach.map((skill, idx) => (
              <View key={idx} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {teacher.certifications && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <Text style={styles.certificationText}>{teacher.certifications}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add Your Rating</Text>
          <View style={styles.starRatingContainer}>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity 
                key={num} 
                onPress={() => setMyRating(num)}
                style={styles.starButton}
              >
                <Star color={myRating >= num ? "#FFD700" : "#ccc"} size={32} />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Leave a comment (optional)"
            value={myComment}
            onChangeText={setMyComment}
            multiline={true}
            numberOfLines={3}
            placeholderTextColor="#8AABBC"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmitRating}>
            <Text style={styles.buttonText}>Submit Rating</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Ratings</Text>
          {ratings.length > 0 ? (
            <>
              {ratings.slice(0, showAllRatings ? ratings.length : 3).map((r, idx) => (
                <View key={idx} style={styles.ratingRow}>
                  <View style={styles.ratingBadge}>
                    <Star color="#FFD700" size={14} />
                    <Text style={styles.ratingBadgeText}>{r.rating}</Text>
                  </View>
                  <Text style={styles.ratingComment}>{r.comment}</Text>
                </View>
              ))}
              {ratings.length > 3 && !showAllRatings && (
                <TouchableOpacity onPress={() => setShowAllRatings(true)}>
                  <Text style={{ color: '#2A9D8F', fontWeight: 'bold', textAlign: 'center', marginVertical: 8 }}>
                    Show More
                  </Text>
                </TouchableOpacity>
              )}
              {ratings.length > 3 && showAllRatings && (
                <TouchableOpacity onPress={() => setShowAllRatings(false)}>
                  <Text style={{ color: '#2A9D8F', fontWeight: 'bold', textAlign: 'center', marginVertical: 8 }}>
                    Show Less
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.noRatingsText}>No ratings yet</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F0F7F7',
  },
  headerBackground: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 270,
    backgroundColor: '#2A9D8F', // teal
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  container: { 
    flex: 1,
    alignItems: 'center', 
    padding: 20,
    paddingTop: 10,
  },
  profileHeader: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    paddingTop: 20,
    paddingBottom: 20, // Add padding for spacing
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F7F7',
  },
  loadingText: {
    fontSize: 18,
    color: '#1A6B8F',
    fontWeight: '500',
  },
  avatar: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#E0F5F2',
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 6,
    color: '#fff',
  },
  bio: {
    fontSize: 16,
    color: '#E0F5F2',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 10,
    maxWidth: 220,
  },
  viewMoreText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
  },
  ratingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 5,
  },
  ratingText: { 
    marginLeft: 6, 
    fontWeight: 'bold', 
    fontSize: 16,
    color: '#1A6B8F',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#105E62',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 12,
    color: '#105E62',
  },
  skillsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
  },
  skillPill: { 
    backgroundColor: '#E0F5F2', 
    borderRadius: 20, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    margin: 4,
    borderWidth: 1,
    borderColor: '#78CDD7',
  },
  skillText: { 
    color: '#096B72', 
    fontWeight: '600',
    fontSize: 14,
  },
  certificationText: {
    color: '#333',
    fontSize: 15,
    lineHeight: 22,
  },
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    padding: 5,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#BEE3DB', 
    borderRadius: 12, 
    padding: 12, 
    width: '100%', 
    marginVertical: 12,
    backgroundColor: '#FBFEFF',
    color: '#1A6B8F',
    fontSize: 15,
  },
  button: { 
    backgroundColor: '#20B2AA', 
    borderRadius: 30, 
    padding: 14, 
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ratingRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 12,
    backgroundColor: '#F9FDFD',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#78CDD7',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F5F2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  ratingBadgeText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#096B72',
  },
  ratingComment: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
  noRatingsText: {
    color: '#8AABBC',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  connectButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#2A9D8F', // teal
    borderRadius: 30, 
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  connectButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    marginLeft: 8,
    fontSize: 16,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30, // Match connectButton's borderRadius for a sporter look
    borderWidth: 2,
    borderColor: '#2A9D8F',
  },
});

export default TeacherProfile;