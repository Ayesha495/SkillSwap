import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const SkillUsersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { skill } = route.params;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map(uid => ({
          id: uid,
          ...data[uid],
        }));
        const filtered = usersArray.filter(user =>
          (Array.isArray(user.skillsToTeach) && user.skillsToTeach.includes(skill)) ||
          (Array.isArray(user.skillsToLearn) && user.skillsToLearn.includes(skill))
        );
        setUsers(filtered);
      } else {
        setUsers([]);
      }
    });
    return () => unsubscribe();
  }, [skill]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>People with "{skill}"</Text>
      <ScrollView>
        {users.length === 0 && (
          <Text style={styles.emptyText}>No users found with this skill.</Text>
        )}
        {users.map(user => (
          <TouchableOpacity
            key={user.id}
            style={styles.userCard}
            onPress={() => navigation.navigate('TeacherProfile', { userId: user.id })}
          >
            <Image
              source={
                user.image && typeof user.image === 'string' && user.image.length > 0
                  ? { uri: user.image }
                  : require('../assets/profile.png')
              }
              style={styles.avatar}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.skills}>
                {Array.isArray(user.skillsToTeach) && user.skillsToTeach.includes(skill)
                  ? 'Teaches'
                  : 'Wants to Learn'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FDFC', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2A9D8F', marginBottom: 16 },
  emptyText: { color: '#788B9A', textAlign: 'center', marginTop: 40 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0F5F2' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#264653' },
  skills: { fontSize: 13, color: '#2A9D8F', marginTop: 2 },
});

export default SkillUsersScreen;