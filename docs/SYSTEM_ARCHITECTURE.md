# System Architecture & Core System Services
**Module Documentation - Calyx Ish (Team Lead)**

## Overview

The System Architecture module forms the backbone of the Mobile OS Prototype, providing core system services, global state management, system initialization, and navigation infrastructure. This module coordinates between all other subsystems to create a cohesive operating system experience.

## Responsibilities

As Team Lead and System Architecture developer, my responsibilities include:

1. **System Architecture Design** - Overall system structure and component integration
2. **Core System Services** - Boot manager, alert manager, and system context
3. **Navigation Infrastructure** - App routing and screen transitions
4. **Team Coordination** - Merge management, code review, and integration oversight

## Module Structure

### Core Components

```
src/
├── system/
│   ├── AppManager.js          # Application lifecycle management
│   ├── SystemContext.js        # Global state management
│   ├── BootManager.js          # System initialization
│   └── AlertManager.js         # System notifications
├── ui/
│   ├── LockScreen/            # Lock screen UI
│   ├── HomeScreen/            # Home screen with app launcher
│   └── StatusBar/             # System status bar
└── App.jsx                     # Root component with screen controller
```

## Technical Implementation

### 1. SystemContext (Global State Management)

The SystemContext provides centralized state management for the entire operating system.

#### Features:
- **App State**: Tracks all installed and running applications
- **Permission State**: Manages granted/denied permissions
- **Connectivity State**: WiFi and cellular status
- **Battery State**: Power level and consumption
- **System State**: Screen lock, boot status, alerts

#### Implementation Pattern:
```javascript
import { createContext, useContext, useState, useEffect } from 'react'

export const SystemContext = createContext(null)

export const SystemProvider = ({ children }) => {
  const [systemState, setSystemState] = useState({
    isBooted: false,
    isLocked: true,
    apps: [],
    runningApps: [],
    permissions: {},
    connectivity: {
      wifi: false,
      cellular: false
    },
    battery: {
      level: 100,
      isCharging: false,
      powerSaveMode: false
    }
  })

  // State update methods
  // System initialization logic
  // Cross-module coordination

  return (
    <SystemContext.Provider value={{ systemState, setSystemState }}>
      {children}
    </SystemContext.Provider>
  )
}

export const useSystem = () => useContext(SystemContext)
```

### 2. BootManager (System Initialization)

Handles the operating system boot sequence and initialization.

#### Boot Sequence:
1. **Hardware Check**: Verify system resources
2. **Service Initialization**: Start system services (Battery, Connectivity, Permissions)
3. **App Discovery**: Scan and register installed applications
4. **State Restoration**: Load persisted user data
5. **UI Rendering**: Display lock screen

#### Key Functions:
- `initializeSystem()` - Main boot sequence
- `loadInstalledApps()` - Register system applications
- `restoreUserState()` - Restore previous session
- `startSystemServices()` - Initialize background services

### 3. AlertManager (System Notifications)

Manages system-level alerts, notifications, and error handling.

#### Alert Types:
- **Info**: General information (e.g., "WiFi Connected")
- **Warning**: Cautionary messages (e.g., "Low Battery - 20%")
- **Error**: System errors (e.g., "Permission Denied")
- **Success**: Confirmation messages (e.g., "App Installed")

#### Features:
- Priority queue for multiple alerts
- Auto-dismiss timers
- User acknowledgment tracking
- Alert history logging

### 4. Screen Management (App Overlay System)

Handles screen transitions using a view stacking system that accurately represents real mobile OS behavior.

#### Design Rationale:
Instead of using React Router (web pattern), this OS uses an **app overlay system** that mirrors how actual mobile operating systems (iOS/Android) work:
- Apps render as overlays on top of the home screen
- Multiple apps can be in memory simultaneously (background/foreground)
- Screen states managed via SystemContext (not URL routing)
- More memory efficient (~50KB lighter than React Router)
- Better demonstrates OS process management concepts

#### Screen States:
- **Boot Screen**: System initialization display
- **Lock Screen**: Authentication and device lock (default)
- **Home Screen**: App launcher with running apps as overlays
- **App Views**: Individual apps rendered as full-screen overlays

#### Navigation Features:
- State-based screen switching (isBooted, isLocked)
- App overlay rendering based on runningApps array
- Direct state manipulation (no route matching overhead)
- Instant transitions (no route change delays)

## Operating System Concepts Demonstrated

### 1. Process Management
- **App Lifecycle States**: Installed → Running → Paused → Stopped → Terminated
- **Context Switching**: Save/restore app state during transitions
- **Process Scheduling**: Manage CPU time allocation for background apps

### 2. Inter-Process Communication (IPC)
- **SystemContext**: Shared state between modules
- **Event Bus**: Alert propagation across components
- **Service Calls**: Permission requests, connectivity checks

### 3. Resource Management
- **Memory Allocation**: Track resource usage per app
- **Resource Cleanup**: Free resources on app termination
- **Resource Limits**: Enforce maximum running apps

### 4. Boot Process
- **BIOS-like Initialization**: Hardware checks
- **Kernel Loading**: Core service startup
- **Init System**: Application discovery and registration
- **Login Manager**: Lock screen presentation

## Integration with Other Modules

### AppManager (Mabel)
- Provides lifecycle state transitions
- Coordinates with SystemContext for app state
- Enforces resource limits

### PermissionManager (Obed)
- Integrates permission checks into app launch
- Stores permission state in SystemContext
- Triggers permission dialogs via AlertManager

### ConnectivityManager (Jonas)
- Updates connectivity state in SystemContext
- Triggers network status alerts
- Affects app behavior (network-dependent apps)

### BatteryManager (James)
- Updates battery level in SystemContext
- Triggers low battery alerts
- Enforces power save mode restrictions

### System Apps (Asaph)
- Registers apps during boot
- Provides Settings app for system configuration
- Accesses system state via SystemContext

### UI Components (Herbert)
- Renders based on SystemContext state
- Screen switching via state flags (isLocked, isBooted)
- Apps render as overlays when in runningApps array
- Displays AlertManager notifications

## Development Guidelines

### State Management Best Practices
1. **Single Source of Truth**: All global state in SystemContext
2. **Immutable Updates**: Use spread operators for state changes
3. **Minimal Re-renders**: Optimize context value memoization
4. **Persistence**: Save critical state to localStorage

### Screen Management Rules
1. **Use SystemContext State**: Screen changes via state updates (unlockScreen, lockScreen)
2. **Guard Screen Access**: Check isBooted and isLocked before rendering
3. **Clean Transitions**: CSS transitions for screen changes
4. **App Stack**: Running apps maintained in runningApps array

### Boot Sequence Optimization
1. **Async Operations**: Use promises for service initialization
2. **Lazy Loading**: Defer non-critical initialization
3. **Error Handling**: Graceful degradation on service failure
4. **Progress Indication**: Show boot progress to user

## Testing Strategy

### Unit Tests
- SystemContext state updates
- BootManager initialization sequence
- AlertManager queue management
- AppRouter route matching

### Integration Tests
- Cross-module communication
- Service coordination during boot
- State synchronization across components

### Performance Tests
- Boot time measurement (target: <2 seconds)
- State update performance
- Memory usage tracking

## Common Issues and Solutions

### Issue 1: Infinite Re-renders
**Cause**: SystemContext value not memoized  
**Solution**: Wrap context value in useMemo

### Issue 2: State Not Persisting
**Cause**: localStorage not saving on state change  
**Solution**: Add useEffect to sync state with localStorage

### Issue 3: Slow Boot Time
**Cause**: Synchronous service initialization  
**Solution**: Use Promise.all() for parallel initialization

## Future Enhancements

1. **Multi-user Support**: User profiles and account switching
2. **Advanced Boot Options**: Safe mode, recovery mode
3. **System Updates**: Over-the-air update simulation
4. **Performance Monitoring**: Real-time system metrics
5. **Crash Reporting**: Error logging and diagnostics

## API Reference

### SystemContext API

```javascript
const { systemState, updateSystemState } = useSystem()

// Update specific state slice
updateSystemState({ isLocked: false })

// Access state
const { isBooted, apps, battery } = systemState
```

### BootManager API

```javascript
import { bootSystem } from './system/BootManager'

await bootSystem() // Returns Promise<boolean>
```

### AlertManager API

```javascript
import { showAlert } from './system/AlertManager'

showAlert({
  type: 'warning',
  title: 'Low Battery',
  message: 'Battery at 20%',
  duration: 5000
})
```

### Screen Management API

```javascript
import { useSystem } from './system/SystemContext'

const { unlockScreen, lockScreen, launchApp, closeApp } = useSystem()

// Navigate to home screen
unlockScreen()

// Launch an app (renders as overlay)
launchApp('calculator')

// Close app (removes from runningApps)
closeApp('calculator')

// Lock device
lockScreen()
```

## Documentation and Code Comments

### Code Organization
```javascript
// 1. Import statements
import { useState, useEffect } from 'react'

// 2. Constants
const BOOT_TIMEOUT = 5000

// 3. Helper functions
const initializeService = async () => {}

// 4. Main component
const SystemCore = () => {}

// 5. Export
export default SystemCore
```

### Comment Standards
- Use JSDoc for function documentation
- Explain "why" not "what"
- Document complex algorithms
- Note OS concepts being demonstrated

## Contribution to Project Goals

This module directly demonstrates the following OS concepts required by the project:

**Process Management** - App lifecycle and state management with overlay system  
**Memory Management** - Resource allocation, cleanup, and efficient state-based rendering  
**Inter-Process Communication** - SystemContext shared state (like shared memory)  
**Boot Sequence** - Multi-stage system initialization process  
**Resource Coordination** - Service orchestration via centralized state  
**Error Handling** - AlertManager and graceful degradation  
**Context Switching** - App foreground/background state management  
**View Controller Stack** - App overlay system mimicking iOS/Android architecture  

## Contact

**Module Owner**: Kwakye Ishmael Affum
**Role**: Team Lead  
**Responsibilities**: System Architecture & Core System Services  

For questions about system architecture, integration, or coordination between modules, please reach out via the team communication channel.

---

**Last Updated**: January 30, 2026  
**Version**: 1.0  
**Status**: Active Development
