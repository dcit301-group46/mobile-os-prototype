# Application Lifecycle Management - Mabel

## Overview
I created a simple system that manages how apps start, run, and close in our mobile OS simulator.

## What I Built

### 1. AppManager.js (Main File)
This file controls everything about app lifecycle.

**The 5 App States:**
- **INSTALLED** - App exists but not running
- **RUNNING** - App is active on screen
- **PAUSED** - App is in background  
- **STOPPED** - App stopped but can resume
- **TERMINATED** - App completely closed

**Main Functions:**
```javascript
launchApp(appId)     // Start an app
pauseApp(appId)      // Put app in background
resumeApp(appId)     // Bring app back to front
terminateApp(appId)  // Close app completely
```

### 2. SystemContext.js
Connects my AppManager to React so other components can use it.

### 3. SimpleDemo.jsx
A working demo that shows the lifecycle management in action.

## How It Works

### Example: User launches Calculator

1. **User taps Calculator icon**
2. **My code runs:** `launchApp('calculator')`
3. **System checks:**
   - Is it already running? → Resume it
   - Is another app running? → Pause that app first
4. **Creates app process:**
   - State: RUNNING
   - Allocates memory (10MB)
   - Sets as active app
5. **Calculator opens!**

### Example: User switches to Notes

1. **User taps Notes icon**
2. **My code runs:** `launchApp('notes')`
3. **System automatically:**
   - Pauses Calculator (state → PAUSED)
   - Launches Notes (state → RUNNING)
4. **Calculator stays in memory, Notes is now active**

### Example: User closes Notes

1. **User clicks × button**
2. **My code runs:** `terminateApp('notes')`
3. **System:**
   - Frees memory (15MB returned)
   - Removes Notes from running apps
   - State → TERMINATED
4. **Returns to home screen**

## Memory Management

- **Total System Memory:** 2048 MB (2GB)
- **Per App:**
  - Calculator: 10 MB
  - Notes: 15 MB
  - Settings: 20 MB
  - Files: 25 MB

My system tracks how much memory is being used and frees it when apps close.

## Integration with Team

### Works with Herbert (UI):
- His button clicks → My `launchApp()` function
- My state changes → His UI updates

### Works with Obed (Permissions):
- Before launching app → Check permissions
- Store permissions in app registry

### Works with Jonas (Connectivity):
- Apps can check WiFi status through system
- Network-dependent apps

### Works with James (Battery):
- Running apps consume battery
- He tracks my running apps list

## Testing

**To test my system:**
1. Open the demo
2. Click app icons - they launch
3. Click another app - first app pauses
4. Click × button - app closes
5. Check memory usage updates

## OS Concepts Demonstrated

1. **Process Management** - Creating and destroying processes
2. **State Management** - Apps transition between states
3. **Memory Management** - Allocating and freeing memory
4. **Context Switching** - Switching between apps
5. **Resource Tracking** - Monitoring system resources

## Files Submitted

1. **AppManager.js** - Main lifecycle management code
2. **SystemContext.js** - React integration
3. **SimpleDemo.jsx** - Working demonstration
4. **This Documentation** - Explanation of my work

## Presentation Points

**What to say:**
1. "I built the Application Lifecycle Management system"
2. "It controls how apps launch, run, pause, and close"
3. "Apps go through 5 states: INSTALLED → RUNNING → PAUSED → STOPPED → TERMINATED"
4. "My system manages memory and multitasking automatically"
5. **[Show demo]** "Watch what happens when I launch apps..."

**Total Time:** 5-7 minutes

---

**Developer:** Mabel  
**Role:** Application Lifecycle Management  
**Date:** January 2026  
**Status:** Complete ✅
