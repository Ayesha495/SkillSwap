import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Star } from 'lucide-react-native';

const AllTeachersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { teachers, userRatings } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Teachers</Text>
      <FlatList
        data={teachers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.teacherCard}
            onPress={() => navigation.navigate('TeacherProfile', { userId: item.id })}
          >
            <Image
              source={
                item.image && typeof item.image === 'string' && item.image.length > 0
                  ? { uri: item.image }
                  : require('../assets/profile.png')
              }
              style={styles.teacherImage}
            />
            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Star color="#FFD700" size={16} />
                <Text style={{ marginLeft: 4, color: '#264653', fontWeight: 'bold' }}>
                  {userRatings[item.id]?.toFixed(1) || '0.0'} / 5
                </Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {item.skillsToTeach && Array.isArray(item.skillsToTeach)
                  ? item.skillsToTeach.map((skill, idx) => (
                      <View key={idx} style={styles.skillPill}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))
                  : null}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FDFC', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#264653', marginBottom: 16 },
  teacherCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  teacherImage: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0F5F2' },
  teacherInfo: { flex: 1, marginLeft: 12 },
  teacherName: { fontSize: 16, fontWeight: '600', color: '#264653', marginBottom: 4 },
  skillPill: {
    backgroundColor: '#E0F5F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  skillText: { color: '#2A9D8F', fontSize: 12, fontWeight: '500' },
});

export default AllTeachersScreen;