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

### Core Implementation

#### 1. Enhanced Lock Screen
- **iOS-Style Design**: Modern gradient background with ultra-light typography
- **PIN Authentication**: 4-digit PIN pad (default: 1234) with visual feedback
- **Live Clock**: Real-time clock updating every second with date display
- **Status Indicators**: Battery level, charging status, WiFi/cellular connectivity at top
- **Screen Off Mode**: Double-tap anywhere to turn screen off/on for power saving
- **Swipe to Unlock**: Alternative unlock method with gesture support
- **Security**: PIN validation with error feedback and automatic retry

#### 2. Enhanced Home Screen
- **iOS-Style Interface**: Gradient background (blue to white) with modern aesthetics
- **Live Time Widget**: Large 72px time display with date at top of screen
- **App Grid**: 4-column grid layout with custom colored icons per app
  - Settings: Gray (#8E8E93)
  - Calculator: Orange (#FF9500)
  - Notes: Yellow (#FFCC00)
  - File Manager: Blue (#007AFF)
- **Running Indicators**: Small dots under active apps
- **Dock**: Frosted glass dock at bottom with 3 most-used apps
- **Page Indicators**: Dots showing current page (ready for multi-page support)
- **Home Indicator**: iOS-style gesture bar at bottom
- **Double-Tap to Lock**: Tap anywhere twice to lock device
- **Smooth Animations**: Scale transforms and cubic-bezier easing

#### 3. Live Status Bar
- **Real-Time Updates**: Clock updates every 60 seconds automatically
- **Battery Display**: Icon + percentage side-by-side with color coding
  - Red: ≤10%
  - Orange: ≤20%
  - Normal: >20%
- **Charging Indicator**: Green bolt icon with pulse animation when charging
- **Connectivity Icons**: WiFi and cellular signal indicators
- **Dark Mode Support**: Dynamic color switching based on darkMode prop
- **Consistent Across Apps**: Shows in all screens (Home, Lock, Apps)

#### 4. Enhanced Settings Application
- **5 Major Sections**: Connectivity, Battery, Apps, Permissions, About

##### Connectivity Section
- **Card-Based Layout**: Clean, organized information cards
- **WiFi Details**: Network name, security type (WPA2), frequency (5GHz), IP address, signal quality
- **Cellular Details**: Network type (5G), data usage (2.3GB/10GB), upload/download stats
- **Toggle Controls**: Easy on/off switches for WiFi and cellular

##### Battery Section
- **Visual Battery Icon**: 60x100px battery with dynamic fill level
- **24-Hour Usage Graph**: SVG line graph showing battery drain over time
- **Battery Health Card**: Health percentage (100%), cycle count (12 cycles)
- **Power Usage by App**: List showing battery consumption per app
- **Battery Tips**: Helpful suggestions for extending battery life
- **Real-Time Tracking**: Updates as battery drains/charges

##### Apps Section
- **Memory Overview**: Widget showing total memory usage (178MB/512MB)
- **Running/Installed Views**: Toggle between active and all apps
- **App Cards**: Each app displays icon, name, memory usage
- **Custom Icons**: Color-coded icons matching home screen
- **App Details**: Tap for detailed information
- **Memory Limits**: 512MB total, max 5 running apps

##### Permissions Section
- **Dual View System**: Switch between "By App" and "By Permission"
- **Overview Stats**: Total apps, apps with permissions, permission types
- **Permission Categories**: Camera, Location, Storage, Microphone with colored icons
- **Grant/Revoke Controls**: Easy permission management
- **App Listings**: See which apps have which permissions
- **Visual Indicators**: Icons and colors for permission states

##### About Section
- **Device Header**: Blue gradient icon with device name
- **Storage Widget**: Visual bar (178MB/512MB) with percentage
- **System Information**: OS version, build number
- **Hardware Details**: A20 Bionic chip, 512MB memory
- **Project Information**: DCIT 301, Group 46
- **Team Credits**: All 8 team members listed with roles
- **Legal Footer**: Copyright and university information

#### 5. Enhanced Notes Application
- **Modern UI**: iOS-style design with clean typography
- **Search Functionality**: Real-time filtering by title or content
- **Auto-Save**: Saves changes as you type with visual indicator
- **Save Status**: Shows "Saving..." then green "Saved" checkmark
- **Note List**: Displays title, preview, and last modified time
- **Word Count**: Real-time word counter in editor footer
- **Create Notes**: Large + button creates new note instantly
- **Edit Notes**: Full-screen editor with large title input and multi-line content
- **Delete Notes**: Context menu (three dots) with delete option
- **Empty States**: Beautiful icons and messages for empty list or no search results
- **Smooth Animations**: Slide-in modals and button feedback

#### 6. Enhanced File Manager
- **Storage Overview**: Visual progress bar showing used/total storage (512MB max)
- **Breadcrumb Navigation**: Home > Folder path with clickable segments
- **Search**: Filter files and folders by name in real-time
- **View Modes**: Toggle between List and Grid views
- **List View**: Detailed info with file size, type, and modified date
- **Grid View**: Compact icon grid for quick browsing
- **Color-Coded Files**: 
  - Folders: Blue
  - Images: Red
  - Videos: Orange
  - Audio: Green
  - Documents: Gray
- **Context Menu**: Rename and delete options via three-dot menu
- **Create Files/Folders**: + button with dropdown menu
- **Delete Confirmation**: Modal dialog before permanent deletion
- **Default Structure**: Documents, Photos, Downloads folders
- **File Operations**: Create, rename, delete files and folders
- **Persistent Storage**: Uses localStorage for file system state

#### 7. Realistic Battery Management
- **Smart Initial State**: Starts at 85% (or restores from localStorage)
- **Auto-Recovery**: If battery was dead, resets to 85% on boot
- **Idle Charging**: Assumes +15% charge if device idle >1 hour
- **Realistic Drain Rates**:
  - Screen on: ~2.8% per hour
  - Screen locked: ~0.36% per hour
  - Per running app: ~1% per hour
  - WiFi: ~0.7% per hour
  - Cellular: ~1.4% per hour
- **Charging Rate**: +9% per minute (~11 minutes for full charge)
- **Toggle Charging**: Manual charging control available
- **Power Save Mode**: Automatically activates at 20%, reduces drain by 50%
- **Battery Warnings**: Console alerts at 20% (low) and 10% (critical)
- **Shutdown at 0%**: System shutdown when battery depleted

#### 8. Application Lifecycle Management
- **App States**: Installed, Running, Paused, Stopped, Terminated
- **Launch Apps**: Click icon to launch, switches to running state
- **Close Apps**: X button in app header terminates process
- **Running Indicators**: Shows active apps in home screen
- **Memory Tracking**: Monitors memory usage per app
- **Max Running Apps**: Limit of 5 concurrent apps
- **Background Management**: Apps can run in background
- **State Persistence**: Saves running apps to localStorage

#### 9. Permission System
- **Permission Types**: Camera, Location, Storage, Microphone
- **Runtime Requests**: Apps request permissions when needed
- **Modal Dialogs**: iOS-style permission request popups
- **Grant/Deny**: User can allow or deny each permission
- **Persistent State**: Permissions saved to localStorage
- **Access Control**: Apps check permissions before accessing resources
- **Permission Manager**: Centralized management in Settings

#### 10. Mobile Connectivity Simulation
- **WiFi Toggle**: Enable/disable WiFi with visual feedback
- **Cellular Toggle**: Enable/disable cellular data
- **Connection States**: ON/OFF states tracked
- **Status Indicators**: Icons in status bar show connectivity
- **Network Details**: IP address, signal strength, data usage
- **Airplane Mode**: Future support ready
- **Battery Impact**: Connectivity affects battery drain

## Technical Architecture

### Device Specifications

**iPhone 17 Pro Max Simulation**
- **Screen Size**: 430×932px
- **Border Radius**: 55px (rounded corners)
- **Design Language**: iOS-style with modern aesthetics
- **Color Palette**: 
  - Primary Blue: #007AFF
  - Background: #F2F2F7
  - Gray: #8E8E93
  - Green: #34C759
  - Orange: #FF9500
  - Red: #FF3B30
  - Yellow: #FFCC00

### System Layers

```
┌─────────────────────────────────────┐
│        UI Layer (React)             │
│  Lock Screen | Home Screen          │
│  Status Bar | Apps | Dock           │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      System Services Layer          │
│  App Manager | Permission Manager   │
│  Connectivity | Battery Manager     │
│  Boot Manager | Alert Manager       │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         Storage Layer               │
│  localStorage | State Management    │
│  File System | Notes Storage        │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         Kernel Layer                │
│  Process Mgmt | Memory | State      │
│  Event Loop | Resource Tracking     │
└─────────────────────────────────────┘
```

### Core Modules

- **SystemContext**: Global state management using React Context API
  - Manages system state (locked, booted, running apps)
  - Battery state and charging status
  - Connectivity state (WiFi, cellular)
  - Permissions registry
  - Installed apps registry

- **BatteryManager**: Power consumption tracking and optimization
  - Realistic drain rates based on usage
  - Charging simulation
  - Power save mode at 20%
  - Battery health tracking
  - Auto-recovery on boot

- **PermissionManager**: Access control and permission enforcement
  - Runtime permission requests
  - Permission state persistence
  - Grant/revoke functionality
  - Permission checking before access

- **ConnectivityManager**: Network state and connectivity simulation
  - WiFi and cellular toggles
  - Connection state tracking
  - Network information display
  - Data usage monitoring

- **AppManager**: Handles application lifecycle
  - Launch/close operations
  - Running app tracking
  - Memory allocation
  - App state persistence

### Key Implementation Details

#### State Management
- **React Context API**: Central SystemContext provides global state
- **localStorage**: Persistence for battery, permissions, notes, files
- **useEffect Hooks**: Real-time updates (clock, battery drain)
- **Controlled Components**: All inputs managed by React state

#### Performance Optimizations
- **Memoization**: useCallback for expensive functions
- **Lazy Loading**: Apps loaded on demand
- **Efficient Re-renders**: Proper dependency arrays in useEffect
- **CSS Transitions**: Hardware-accelerated animations

#### Battery Simulation
- **setInterval**: Updates battery every second
- **Drain Calculation**: Based on screen state, running apps, connectivity
- **Charging Logic**: Adds battery when isCharging is true
- **Smart Defaults**: Realistic starting values and recovery logic

#### Live Updates
- **Status Bar Clock**: Updates every 60 seconds
- **Lock Screen Clock**: Updates every 1 second
- **Battery Level**: Updates every 1 second based on usage
- **Auto-Save**: Notes save with 300ms debounce

#### Storage Architecture
- **Notes**: Stored as JSON array in localStorage
- **File System**: Tree structure in localStorage
- **Permissions**: Object map in localStorage
- **System State**: Partial state persistence
- **Auto-Restore**: Loads saved state on boot

## Project Structure

```
mobile-os-prototype/
├── public/
│   └── assets/
├── src/
│   ├── system/
│   │   ├── SystemContext.jsx      # Global state management
│   │   └── (future modules)
│   ├── services/
│   │   ├── BatteryManager.js      # Power management
│   │   ├── PermissionManager.js   # Access control
│   │   └── ConnectivityManager.js # Network simulation
│   ├── apps/
│   │   ├── Settings/
│   │   │   ├── Settings.jsx       # 5 sections (enhanced)
│   │   │   └── Settings.css
│   │   ├── Calculator/
│   │   │   ├── Calculator.jsx     # Basic arithmetic
│   │   │   └── Calculator.css
│   │   ├── Notes/
│   │   │   ├── Notes.jsx          # Create, edit, search (enhanced)
│   │   │   └── Notes.css
│   │   └── FileManager/
│   │       ├── FileManager.jsx    # File operations (enhanced)
│   │       └── FileManager.css
│   ├── ui/
│   │   ├── HomeScreen/
│   │   │   ├── HomeScreen.jsx     # App grid, dock (enhanced)
│   │   │   └── HomeScreen.css
│   │   ├── LockScreen/
│   │   │   ├── LockScreen.jsx     # PIN pad, screen off (enhanced)
│   │   │   └── LockScreen.css
│   │   └── StatusBar/
│   │       ├── StatusBar.jsx      # Live time, battery (enhanced)
│   │       └── StatusBar.css
│   ├── App.jsx                    # Main application component
│   └── main.jsx                   # React entry point
├── docs/
│   ├── GIT_TRAINING.md            # Git workflow guide
│   └── SYSTEM_ARCHITECTURE.md     # Technical details
├── .gitignore
├── package.json                   # Dependencies
├── vite.config.js                 # Build configuration
├── CONTRIBUTING.md                # Contribution guidelines
└── README.md                      # This file
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

- `dev` - Default branch for active development (protected)
- `review` - Integration testing and QA (protected)
- `prod` - Production-ready code for demos and submission (protected)
- `feature/*` - Individual feature development
- `main` - Historical reference (rarely used)

### Workflow Process

**Note:** When you clone the repository, you'll automatically be on the `dev` branch.

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

### 1. Process Management
- **Application States**: Implemented full lifecycle (Installed → Running → Terminated)
- **Process Scheduling**: Apps launch and close on demand
- **Context Switching**: Switching between apps preserves state
- **Resource Limits**: Maximum 5 concurrent running apps
- **Process Termination**: Clean shutdown with resource cleanup

### 2. Memory Management
- **Resource Allocation**: Each app has defined memory footprint
- **Memory Tracking**: Real-time monitoring (178MB/512MB total)
- **Memory Limits**: 512MB total system memory enforced
- **Resource Cleanup**: Memory freed when apps close
- **Memory Overflow**: Prevents exceeding capacity

### 3. Security & Access Control
- **Permission System**: Runtime permission requests (Camera, Location, Storage, Microphone)
- **Access Control**: Apps must request permissions before accessing resources
- **User Authorization**: User grants or denies permissions via modal dialogs
- **State Persistence**: Permission decisions saved and enforced
- **Security Enforcement**: Checks permissions before resource access

### 4. Power Management
- **Dynamic Consumption**: Battery drains based on:
  - Screen state (on: 2.8%/hr, locked: 0.36%/hr)
  - Running applications (~1%/hr each)
  - Connectivity (WiFi: 0.7%/hr, Cellular: 1.4%/hr)
- **Power Optimization**: Power save mode at 20% reduces drain by 50%
- **Charging Simulation**: +9% per minute when charging
- **State Transitions**: Smooth transitions between power states
- **Battery Health**: Tracks charge cycles and health percentage

### 5. Device Management
- **Hardware Simulation**: WiFi and cellular radios
- **Driver Interfaces**: Toggle controls for hardware
- **Device State**: Track ON/OFF states
- **Status Indicators**: Visual feedback in status bar
- **Resource Coordination**: Connectivity affects battery drain

### 6. File System Management
- **Virtual File System**: Tree structure with folders and files
- **CRUD Operations**: Create, read, update, delete files/folders
- **Storage Tracking**: Calculate and display used/total storage
- **Persistence**: File system state saved to localStorage
- **Path Navigation**: Breadcrumb navigation through folders

### 7. User Interface & Event Handling
- **Event-Driven Architecture**: Touch events (tap, double-tap, swipe)
- **Input Handling**: PIN entry, search, form inputs
- **Display Management**: Multiple screens (Lock, Home, Apps)
- **Animation Engine**: CSS transitions for smooth UI
- **Responsive Design**: Adapts to different view modes

### 8. Inter-Process Communication
- **System Context**: Global state shared across components
- **Service Communication**: Apps interact with system services
- **Event Broadcasting**: Battery/connectivity changes notify all apps
- **Message Passing**: Permission requests and responses

### 9. Concurrency & Synchronization
- **Asynchronous Operations**: Permission requests are async
- **State Synchronization**: Updates propagate consistently
- **Race Condition Prevention**: Proper state management
- **Timer Management**: Multiple intervals for different updates

### 10. Persistence & Storage
- **localStorage API**: Used for all persistent data
- **State Serialization**: Convert complex objects to JSON
- **Auto-Save**: Notes and files save automatically
- **State Recovery**: Restore system state on boot
- **Data Integrity**: Validation before save/load

## Technologies Used

- **Frontend Framework**: React 18.2
- **Language**: JavaScript (ES2020+)
- **Build Tool**: Vite 5.1
- **State Management**: React Context API
- **Icons**: Font Awesome 6.5.1 (free solid icons)
- **UI Library**: Material UI 5.15.10 (Calculator component)
- **Styling**: CSS3 with custom properties
- **Storage**: localStorage for persistence
- **Version Control**: Git & GitHub
- **Collaboration**: GitHub Organization (dcit301-group46)

### Development Dependencies
- **ESLint**: Code quality and consistency
- **Vite Plugins**: React, SWC for fast builds
- **Hot Module Replacement**: Live reload during development

### Design System
- **Typography**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Color Scheme**: iOS-inspired palette with system colors
- **Spacing**: 4px base unit, 8px increments
- **Animations**: CSS transitions with cubic-bezier easing
- **Icons**: Font Awesome (no emojis used, all icons from FA library)

## Usage Guide

### Unlocking the Device
1. Default PIN: `1234`
2. Tap numbers on PIN pad or swipe up to unlock
3. Double-tap anywhere on lock screen to turn screen off/on

### Navigating Home Screen
1. Tap app icon to launch
2. Double-tap empty space to lock device
3. Running apps show dot indicator
4. Use dock for quick access to favorite apps

### Using Applications

#### Notes
- Tap + button to create new note
- Search notes using search bar
- Tap note to edit
- Use three-dot menu to delete
- Auto-saves as you type

#### File Manager
- Toggle between list/grid view
- Search files by name
- Tap + to create file/folder
- Use three-dot menu for rename/delete
- Navigate folders with breadcrumbs

#### Settings
- Connectivity: Toggle WiFi/Cellular, view network details
- Battery: See usage graph, health, power tips
- Apps: Manage running apps and memory
- Permissions: Control app permissions
- About: Device and project information

### Power Management
- Battery drains based on usage
- Charging can be toggled in Settings > Battery
- Power save mode activates automatically at 20%
- Screen off mode reduces battery drain

## Known Limitations

- No actual network connectivity (simulated)
- Calculator uses Material UI (external library)
- File system limited to 512MB
- Maximum 5 running apps
- localStorage has browser limits (~5-10MB)
- No actual file downloads/uploads
- Permission system is simulated
- Battery drain is accelerated for demonstration

## License

This project is developed for academic purposes as part of DCIT 301 coursework.

## Acknowledgments

Department of Computer Science  
University of Ghana  
DCIT 301 - Operating Systems  
Academic Year 2025/2026
