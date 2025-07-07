# 🛡️ HSE Incident Reporting App

A mobile and backend solution to report and track HSE (Health, Safety & Environment) incidents inside **Bosch**.

Built with **React Native (Expo)** for the mobile front‑end and **Node.js + MongoDB** for the back‑end.  
Incident details (with image attachment) are automatically emailed to selected recipients.

---

## 📂 Project Structure

```
HSEIncidentApp/        # React‑Native (Expo) mobile client
HSEIncidentBackend/    # Node.js + Express server & MongoDB models
```

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Mobile app   | React Native + Expo            |
| Backend API  | Node.js + Express              |
| Database     | MongoDB                        |
| Email        | Nodemailer (Gmail SMTP)        |

---

## 🚀 Features

- **Login / Signup** (email + password)
- **Report incident** with:
  - Image (gallery **or** camera)
  - Area, category, description
  - Multi‑select reporting persons  
- **Incident list** with filters (date, category) & recent‑first sort
- **Email notifications** with image attached
- **Logout confirmation** on back arrow
- **AsyncStorage** for session persistence

---

## 📦 Backend Setup

```bash
cd HSEIncidentBackend          # 1️⃣ enter backend folder
npm install                    # 2️⃣ install deps
```

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/hse-db
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password      # 🔑 Gmail App Password
```

Start the server:

```bash
npm start
```

---

## 📱 Front‑end (Expo) Setup

```bash
cd HSEIncidentApp              # 1️⃣ enter frontend folder
npm install                    # 2️⃣ install deps
npx expo start                 # 3️⃣ run Expo (scan QR code)
```

---

## 📚 Dependency Reference

### Backend

```bash
npm install express mongoose dotenv cors nodemailer body-parser
```

### Frontend

```bash
npm install axios @react-native-async-storage/async-storage
npm install @react-native-picker/picker
npm install react-native-element-dropdown
npm install expo-image-picker
```

---

## 🔐 Gmail SMTP Setup

1. Enable **2‑Step Verification** on your Gmail.  
2. Open <https://myaccount.google.com/apppasswords>  
3. Generate **Mail → Other (e.g. HSEApp)** password.  
4. Put the 16‑character key into `.env` as `EMAIL_PASS`.

Without this, email sending fails with *Invalid login*.

---

## 🗑️ Manual User Removal (Mongo shell)

```bash
use hse-db
db.users.deleteOne({ email: "user@example.com" })
```

(Optionally also remove their incidents with  
`db.incidents.deleteMany({ email: "user@example.com" })`)

---

## 📝 License

Internal Bosch prototype – **not for public distribution**.
