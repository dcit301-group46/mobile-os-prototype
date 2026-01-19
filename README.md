# Mobile Operating System Prototype

**DCIT 301 - Operating Systems**  
**Group 46**

A React-based mobile operating system simulator that demonstrates core operating system concepts through touch-based UI, application lifecycle management, permission systems, connectivity simulation, and power management.

## Table of Contents

- [Project Description](#project-description)
- [Team Members](#team-members)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development Workflow](#development-workflow)
- [OS Concepts Demonstrated](#os-concepts-demonstrated)
- [Technologies Used](#technologies-used)

## Project Description

This project implements a simplified mobile operating system prototype that simulates the behavior of modern mobile platforms. The system provides a desktop/web-based environment demonstrating fundamental operating system principles including process management, resource allocation, security, and power management.

## Team Members

| Name | Role | Responsibilities |
|------|------|------------------|
| **Calyx Ish** | Team Lead | System Architecture & Core System Services |
| **Herbert** | UI/UX Designer | Touch Interface & Visual Design |
| **Mabel** | Developer | Application Lifecycle Management |
| **Obed** | Developer | Permission & Security System |
| **Jonas** | Developer | Connectivity Module (WiFi & Cellular) |
| **James** | Developer | Battery & Power Management |
| **Asaph** | Developer | System Applications Development |
| **Joy** | Developer | Documentation, Testing & QA |

## Features

### Core Requirements

#### 1. Touch-Based User Interface
- Simulated touch events (tap, swipe, long press)
- Home screen with app icons
- Status bar with system indicators
- App drawer and navigation
- Lock screen and unlock mechanism

#### 2. Application Lifecycle Management
- App states: Installed, Running, Paused, Stopped, Terminated
- Launch, pause, resume, and terminate operations
- Process scheduling and context switching
- Memory and resource allocation per app
- Background app management

#### 3. Permission System
- Permission types: Camera, Location, Storage, Internet
- Runtime permission requests
- User grant/deny functionality
- Permission state persistence
- Access control enforcement

#### 4. Mobile Connectivity Simulation
- WiFi toggle (ON/OFF)
- Cellular data simulation
- Connection state management
- Network-dependent app behavior
- Connectivity status indicators

#### 5. Battery & Power Management
- Battery level tracking (0-100%)
- Dynamic power consumption based on:
  - Running applications
  - Screen state
  - Connectivity usage
- Low power mode (activates at 20%)
- Power optimization strategies

#### 6. Basic System Applications
- **Settings**: WiFi/Cellular toggle, Permission manager, Battery status
- **Calculator**: Basic arithmetic operations
- **Notes**: Create and save notes
- **File Manager**: Simulated file storage and browsing

## Technical Architecture

### System Layers

```
┌─────────────────────────────────────┐
│        UI Layer (React)             │
│  Home Screen | Status Bar | Apps    │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      System Services Layer          │
│  App Manager | Permission Manager   │
│  Connectivity | Battery Manager     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         Kernel Layer                │
│  Process Mgmt | Memory | State      │
└─────────────────────────────────────┘
```

### Core Modules

- **AppManager**: Handles application lifecycle and state transitions
- **SystemContext**: Global state management (React Context/Redux)
- **PermissionManager**: Access control and permission enforcement
- **ConnectivityManager**: Network state and connectivity simulation
- **BatteryManager**: Power consumption tracking and optimization
- **BootManager**: System initialization and boot sequence
- **AlertManager**: System-level notifications and error handling

## Project Structure

```
mobile-os-prototype/
├── public/
│   └── assets/
├── src/
│   ├── system/
│   │   ├── AppManager.js
│   │   ├── SystemContext.js
│   │   ├── BootManager.js
│   │   └── AlertManager.js
│   ├── services/
│   │   ├── PermissionManager.js
│   │   ├── ConnectivityManager.js
│   │   └── BatteryManager.js
│   ├── apps/
│   │   ├── Settings/
│   │   ├── Calculator/
│   │   ├── Notes/
│   │   └── FileManager/
│   ├── ui/
│   │   ├── HomeScreen/
│   │   ├── LockScreen/
│   │   ├── StatusBar/
│   │   └── AppDrawer/
│   ├── navigation/
│   │   └── AppRouter.jsx
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── tests/
├── docs/
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/dcit301-group46/mobile-os-prototype.git
cd mobile-os-prototype
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser at `http://localhost:5173`

## Development Workflow

### Branch Strategy

- `main` - Stable production-ready code
- `dev` - Integration branch for testing
- `feature/*` - Individual feature development

### Workflow Process

1. Create feature branch from `dev`:
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

2. Develop and commit changes:
```bash
git add .
git commit -m "Add feature description"
```

3. Push and create Pull Request:
```bash
git push origin feature/your-feature-name
```

4. Request review from team members
5. Merge into `dev` after approval
6. Periodically merge `dev` into `main`

### Code Standards

- Follow ESLint configuration
- Use functional React components with hooks
- Write self-documenting code
- Keep comments minimal and meaningful
- Test before pushing

## OS Concepts Demonstrated

This project demonstrates the following operating system principles:

1. **Process Management**
   - Application lifecycle states
   - Process scheduling
   - Context switching

2. **Memory Management**
   - Resource allocation per application
   - Memory usage tracking
   - Resource cleanup on termination

3. **Security & Access Control**
   - Permission-based access
   - Runtime security checks
   - User authentication

4. **Power Management**
   - Dynamic power consumption
   - Resource optimization
   - Power state transitions

5. **Device Management**
   - Simulated hardware interfaces
   - Driver-level connectivity
   - Device state management

6. **User Interface**
   - Event-driven architecture
   - Input handling
   - Display management

## Technologies Used

- **Frontend Framework**: React 18
- **Language**: JavaScript (ES2020+)
- **Build Tool**: Vite
- **State Management**: React Context API
- **Styling**: CSS3 & CSS Modules
- **Routing**: React Router
- **Storage**: LocalStorage / IndexedDB
- **Testing**: Vitest / React Testing Library
- **Version Control**: Git & GitHub
- **Collaboration**: GitHub Organization (dcit301-group46)

## License

This project is developed for academic purposes as part of DCIT 301 coursework.

## Acknowledgments

Department of Computer Science  
University of Ghana  
DCIT 301 - Operating Systems  
Academic Year 2025/2026
