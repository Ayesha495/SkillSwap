import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const SkillTeachersScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { skill } = route.params;
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    setCurrentUserId(auth.currentUser?.uid || null);
  }, []);

  // Only fetch users when currentUserId is set
  useEffect(() => {
    if (!currentUserId) return; // Wait until we have the current user's ID
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map(uid => ({
          id: uid,
          ...data[uid],
        }));
        // Filter users who can teach the selected skill and are not the current user
        const filtered = usersArray.filter(
          user =>
            user.id !== currentUserId &&
            user.skillsToTeach &&
            Array.isArray(user.skillsToTeach) &&
            user.skillsToTeach.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        );
        setUsers(filtered);
      } else {
        setUsers([]);
      }
    });
    return () => unsubscribe();
  }, [skill, currentUserId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teachers for "{skill}"</Text>
      <ScrollView>
        {users.length === 0 && (
          <Text style={styles.noTeachers}>No teachers found for this skill.</Text>
        )}
        {users.map(user => (
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
              {/* Add more info if needed */}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FDFC', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#264653', marginBottom: 16 },
  noTeachers: { color: '#888', textAlign: 'center', marginTop: 32 },
  teacherCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
});

export default SkillTeachersScreen;
