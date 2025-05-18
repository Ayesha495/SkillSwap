import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const FavoritesScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [favoriteTeachers, setFavoriteTeachers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Fetch all users
  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map(uid => ({
          id: uid,
          ...data[uid],
        }));
        setAllUsers(usersArray);
      } else {
        setAllUsers([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch favorite teachers for current user
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

  // Filter users to only show favorites
  const favoriteUsers = allUsers.filter(u => favoriteTeachers.includes(u.id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorite Teachers</Text>
      {favoriteUsers.length === 0 ? (
        <Text style={styles.emptyText}>You haven't favorited any teachers yet.</Text>
      ) : (
        <ScrollView>
          {favoriteUsers.map((teacher) => (
            <TouchableOpacity
              key={teacher.id}
              style={styles.teacherCard}
              onPress={() => navigation.navigate('TeacherProfile', { userId: teacher.id })}
            >
              <Image
                source={
                  teacher.image && typeof teacher.image === 'string' && teacher.image.length > 0
                    ? { uri: teacher.image }
                    : require('../assets/profile.png')
                }
                style={styles.teacherImage}
              />
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherName}>{teacher.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Star color="#FFD700" size={18} fill="#FFD700" />
                  <Text style={{ marginLeft: 6, color: '#264653', fontWeight: 'bold' }}>Favorite</Text>
                </View>
                {/* Show up to 3 skills to teach */}
                {teacher.skillsToTeach && Array.isArray(teacher.skillsToTeach) && teacher.skillsToTeach.length > 0 && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                    <Text style={{ color: '#2A9D8F', fontWeight: 'bold', marginRight: 4, fontSize: 12 }}>Teaches:</Text>
                    {teacher.skillsToTeach.slice(0, 3).map((skill, idx) => (
                      <View key={idx} style={styles.skillPill}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {teacher.skillsToTeach.length > 3 && (
                      <Text style={{ color: '#2A9D8F', fontSize: 12, fontWeight: 'bold', marginLeft: 4 }}>
                        +{teacher.skillsToTeach.length - 3} more
                      </Text>
                    )}
                  </View>
                )}
                {/* Show up to 3 skills to learn */}
                {teacher.skillsToLearn && Array.isArray(teacher.skillsToLearn) && teacher.skillsToLearn.length > 0 && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                    <Text style={{ color: '#F4A261', fontWeight: 'bold', marginRight: 4, fontSize: 12 }}>Wants:</Text>
                    {teacher.skillsToLearn.slice(0, 3).map((skill, idx) => (
                      <View key={idx} style={[styles.skillPill, { backgroundColor: '#FEF3E7' }]}>
                        <Text style={[styles.skillText, { color: '#F4A261' }]}>{skill}</Text>
                      </View>
                    ))}
                    {teacher.skillsToLearn.length > 3 && (
                      <Text style={{ color: '#F4A261', fontSize: 12, fontWeight: 'bold', marginLeft: 4 }}>
                        +{teacher.skillsToLearn.length - 3} more
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FDFC',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 18,
    textAlign: 'center',
  },
  emptyText: {
    color: '#788B9A',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  teacherCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
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
});

export default FavoritesScreen;