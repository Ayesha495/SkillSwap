# 🌟 SkillSwap – React Native App

**SkillSwap** is a mobile app built with React Native and Firebase that allows users to showcase the skills they can teach, discover others with similar interests, and connect in a peer-to-peer learning environment. Designed with community and simplicity in mind, it's perfect for students, freelancers, and hobbyists.

---

## ✨ Features

- 🔐 Firebase Authentication (Email & Password)
- 👤 Profile Creation & Management (Name, Bio, Skills, Photo)
- 📸 Image Upload with Expo Image Picker
- 🧠 Add, Edit & Display Skills in Tag Format
- 🔍 Search Skills/Users by Keywords or Categories
- ⭐ Add Skills or Users to Favorites
- 📊 Ratings System for Peer Feedback
- 📁 Local Caching using AsyncStorage
- 🔄 Auth State Persistence
- 🧩 Topic Browsing (Skill Categories)
- 🛎️ (Upcoming) Push Notifications with FCM

---

## 🛠️ Tech Stack

| Layer            | Technology Used                  |
| ---------------- | -------------------------------- |
| **Frontend**     | React Native (Expo)              |
| **Navigation**   | React Navigation (Stack + Tabs)  |
| **Auth**         | Firebase Authentication          |
| **Database**     | Firebase Realtime Database       |
| **Storage**      | Firebase Storage, AsyncStorage   |
| **Image Upload** | Expo Image Picker                |

---

## 📲 Screens Overview 

- `LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen`
- `HomeScreen`, , `FavoritesScreen`
- `ProfileScreen`, `SettingsScreen`, `RatingScreen`
- , `TopicDetailScreen`
- `SkillDetailScreen`, `EditProfileScreen`
- `NotificationsScreen` *(planned)*

---

## 🧱 Firebase Database Structure (Simplified)

```json
{
  "users": {
    "userId123": {
      "name": "Alice",
      "bio": "Designer & mentor",
      "image": "https://...",
      "skillsToTeach": ["Figma", "UX Research"],
      "favorites": ["userId456"],
      "ratings": {
        "userId456": 5
      }
    }
  },
  "topics": {
    "design": {
      "title": "Design",
      "description": "All things related to design"
    }
  },
  "favorites": {
    "userId123": {
      "userId456": true
    }
  },
  "ratings": {
    "userId456": {
      "userId123": 4
    }
  }
}
```
