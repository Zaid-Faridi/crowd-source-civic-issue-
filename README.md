# NagarMitr - Civic Issue Reporting Platform 🏙️

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

**NagarMitr** is a robust, crowd-sourced civic issue reporting platform designed to bridge the gap between citizens and municipal authorities. By leveraging modern web technologies and real-time databases, it empowers users to report, track, and resolve local issues such as potholes, garbage dumps, broken streetlights, and water leakage effectively.

This project was built to demonstrate the power of **dynamic, data-driven web applications** using Vanilla JavaScript and Firebase.

---

## � Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-%EF%B8%8F-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Configuration Guide](#-configuration-guide)
- [Project Structure](#-project-structure)
- [Usage Guidelines](#-usage-guidelines)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

### **1. Smart Reporting System**
- **Intuitive Wizard Interface**: A step-by-step form guides users through category selection, description, and location tagging.
- **Visual Evidence**: Users can upload photos (simulated) to provide proof of the issue.
- **Smart Categorization**: Pre-defined categories like *Pothole*, *Garbage*, *Water*, *Streetlight*, and *Traffic*.
- **Priority tagging**: Users can flag issues as *Low*, *Medium*, or *High* priority.

### **2. Interactive Live Map**
- **Geolocation Integration**: Automatically detects the user's current position to pin-point issues accurately.
- **Visual Markers**: Custom SVG markers color-coded by category (e.g., Orange for Garbage, Pink for Potholes).
- **Interactive Info Windows**: Clicking a marker reveals a summary card with the issue status and description.
- **Dynamic Filtering**: Toggle visibility of specific issue types for focused viewing.

### **3. Real-Time Dashboard & Analytics**
- **Live Counters**: "Active Reports" and "Resolved Issues" metrics update instantly via WebSocket connections (Firestore `onSnapshot`).
- **Personalized Dashboard**: Users can track the status of their own submissions in the "My Reports" tab.
- **Visual Data Analytics**:
    - **Weekly Activity Chart**: A bar chart visualizing the frequency of reports over the last 7 days.
    - **Category Distribution**: A doughnut chart breaking down the types of issues reported in the community.

### **4. User Management**
- **Secure Authentication**: Integration with Firebase Authentication for secure Sign Up and Login.
- **Profile Persistence**: User sessions are managed to keep users logged in across page reloads.

---

## 🏗 Architecture

The application follows a **Serverless Architecture** pattern.

- **Frontend**: A Single Page Application (SPA)-like experience built with Semantic HTML5, CSS3, and Vanilla JavaScript.
- **Backend as a Service (BaaS)**: Google Firebase acts as the backend.
    - **Firestore**: A NoSQL document-based database stores all issue data (`issues` collection).
    - **Authentication**: Manages user identities.
- **Services**:
    - **Google Maps API**: Provides mapping and geocoding services.
    - **Chart.js**: Renders client-side analytics graphs.

Data flow is primarily **Client-to-Firebase** directly. There is no intermediate Node.js server for data processing, ensuring low latency and high scalability.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Core** | HTML5, CSS3 | Sementic markup and custom responsive styling. |
| **Scripting** | JavaScript (ES6+) | Application logic, DOM manipulation, and API calls. |
| **Database** | Firebase Firestore | Real-time NoSQL database. |
| **Auth** | Firebase Auth | Email/Password authentication. |
| **Maps** | Google Maps JS API | Rendering interactive maps and markers. |
| **Visualization** | Chart.js | Rendering responsive data charts. |
| **Icons** | Google Material Symbols | Modern, scalable UI icons. |
| **Dev Server** | Live-Server | Lightweight development server. |

---

## 📋 Prerequisites

Before you begin, ensure you have the following tools installed:

1.  **Node.js & npm**: Download from [nodejs.org](https://nodejs.org/).
2.  **Git**: For version control.
3.  **Code Editor**: VS Code is recommended.

You will also need:
-   A **Google Cloud Platform** account (for Maps API).
-   A **Firebase** account (for Database & Auth).

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nagar-mitr.git
cd nagar-mitr
```

### 2. Install Dependencies
This project requires `live-server` to serve files locally with hot-reload capability.
```bash
npm install
```

### 3. Setup Environment Variables
You need to configure your API keys.

1.  Open `index.html`.
2.  Locate the Google Maps script tag:
    ```html
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initMap" async defer></script>
    ```
3.  Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual key.

### 4. Run the Application
Start the local development server:
```bash
npm start
```
The application will automatically open in your default browser at `http://127.0.0.1:5500`.

---

## 🔧 Configuration Guide

### Setting up Firebase

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  **Firestore Database**:
    -   Navigate to "Firestore Database" and create a database.
    -   Start in **Test mode** (for development) inside the `issues` collection.
4.  **Authentication**:
    -   Navigate to "Authentication" > "Sign-in method".
    -   Enable **Email/Password**.
5.  **Get Config**:
    -   Go to Project Settings > General.
    -   Register a web app and copy the `firebaseConfig` object.
    -   Paste this object into `firebase-init.js`.

### Setting up Google Maps

1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a project and enable **Maps JavaScript API**.
3.  Create Credentials (API Key).
4.  (Optional) Restrict the API key to your local HTTP referrer (`http://127.0.0.1:5500/*`) to prevent unauthorized use.

---

## � Project Structure

A quick look at the top-level files and directories:

```
.
├── index.html          # Main landing page (Home)
├── dashboard.html      # User analytics and history
├── report.html         # Issue reporting wizard
├── auth.html           # Login/Signup forms
├── styles.css          # Main stylesheet
├── script.js           # Shared UI logic and form handling
├── map.js              # Map initialization and marker logic
├── home.js             # Home page specific data fetching
├── dashboard.js        # Dashboard analytics and charts
├── firebase-init.js    # Firebase configuration
└── README.md           # Project documentation
```

---

## 📖 Usage Guidelines

### Reporting an Issue
1.  Navigate to the Home page.
2.  Click the **+** Floating Action Button or the "Report Issue" card.
3.  **Step 1**: Select the Category (e.g., Pothole).
4.  **Step 2**: Enter a Title and Description.
5.  **Step 3**: Confirm your Location.
6.  **Step 4**: Upload a Photo (Optional).
7.  **Submit**: You will receive a unique Token ID.

### Viewing Analytics
1.  Click the **Dashboard** link in the navigation bar.
2.  View the **Weekly Activity** to see community engagement.
3.  Check the **My Reports** tab to see the status of issues you have submitted.

---

## 🛣 Future Roadmap

We have exciting plans for v2.0!

- [ ] **Admin Panel**: A dedicated portal for municipal authorities to update issue status.
- [ ] **Push Notifications**: Notify users when their report status changes.
- [ ] **Mobile App**: A React Native version for iOS and Android.
- [ ] **social Sharing**: Share reports on social media to gather more upvotes.
- [ ] **Dark Mode**: A system-wide dark theme.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👏 Acknowledgements

-   [Google Firebase](https://firebase.google.com)
-   [Chart.js](https://www.chartjs.org)
-   [Google Fonts & Icons](https://fonts.google.com)
-   [OpenStreetMap](https://www.openstreetmap.org) (Concept inspiration)

---

**NagarMitr** - *Empowering Citizens, Building Better Cities.*
