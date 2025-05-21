<<<<<<< HEAD
# SkillSwap

*SkillSwap* is a mobile application built using *React Native (Expo)* and *Firebase*, designed to connect users for mutual skill exchange. Whether you want to teach a skill or learn one, SkillSwap helps you find the perfect match.

---

## 📱 Features

### ✅ Implemented
- 🔐 *Authentication*
  - Login & Signup
  - Password Recovery
- 👤 *User Management*
  - Edit Profile (Name, Bio, Skills to Teach, Skills to Learn)
  - View Available Teachers
  - Display Skills & Reviews
- ⭐ *Favorites*
  - Add users to your favorites list
- 🔍 *Skill Matching*
  - Search users by name and skill

---

## 🧩 Tech Stack

| Technology      | Purpose                         |
|----------------|----------------------------------|
| React Native    | Cross-platform mobile app        |
| Expo            | Simplifies development workflow  |
| Firebase Auth   | User authentication              |
| Firebase Realtime DB | Store and manage user data  |
| React Navigation | Navigation between screens     |

---

## 🖌 UI/UX Design

- 🟢 Primary Color: #00a0a9
- 🔵 Secondary Color: #D9F5F6
- Clean, minimal, and modern UI
- Creative and intuitive onboarding flow

---
=======
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
>>>>>>> 9859ff0114848b6f79bae4b9eee425305ddc04d8
