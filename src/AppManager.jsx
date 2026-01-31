/**
 * AppManager.js
 * Simple Application Lifecycle Management
 * 
 * Developer: Mabel
 * Purpose: Manage how apps launch, run, pause, and close
 */

// App States - The 5 states every app can be in
export const APP_STATES = {
  INSTALLED: 'INSTALLED',   // App exists but not running
  RUNNING: 'RUNNING',       // App is active on screen
  PAUSED: 'PAUSED',        // App is in background
  STOPPED: 'STOPPED',      // App stopped but can resume
  TERMINATED: 'TERMINATED' // App completely closed
};

// List of all apps in the system
export const APPS = [
  { id: 'calculator', name: 'Calculator', icon: '🧮', memory: 10 },
  { id: 'notes', name: 'Notes', icon: '📝', memory: 15 },
  { id: 'settings', name: 'Settings', icon: '⚙️', memory: 20 },
  { id: 'files', name: 'Files', icon: '📁', memory: 25 }
];

class AppManager {
  constructor() {
    this.runningApps = [];      // Apps currently running
    this.activeAppId = null;     // Current active app
    this.totalMemory = 2048;     // 2GB total
    this.usedMemory = 0;         // Memory being used
    this.listeners = [];         // Who to notify when things change
  }

  /**
   * LAUNCH - Start an app
   */
  launchApp(appId) {
    console.log(`[AppManager] Launching ${appId}`);
    
    const appInfo = APPS.find(a => a.id === appId);
    if (!appInfo) {
      console.error(`App ${appId} not found`);
      return { success: false };
    }

    // Check if already running
    const existing = this.runningApps.find(a => a.id === appId);
    if (existing) {
      console.log(`${appId} already running, bringing to front`);
      return this.resumeApp(appId);
    }

    // Pause current app if any
    if (this.activeAppId) {
      this.pauseApp(this.activeAppId);
    }

    // Create the app process
    const app = {
      id: appId,
      name: appInfo.name,
      icon: appInfo.icon,
      state: APP_STATES.RUNNING,
      memory: appInfo.memory,
      launchTime: Date.now()
    };

    this.runningApps.push(app);
    this.activeAppId = appId;
    this.usedMemory += appInfo.memory;

    console.log(`[AppManager] ${appId} is now RUNNING`);
    this.notifyListeners('launch', app);
    
    return { success: true, app };
  }

  /**
   * PAUSE - Put app in background
   */
  pauseApp(appId) {
    console.log(`[AppManager] Pausing ${appId}`);
    
    const app = this.runningApps.find(a => a.id === appId);
    if (!app) return { success: false };

    app.state = APP_STATES.PAUSED;
    console.log(`[AppManager] ${appId} is now PAUSED`);
    this.notifyListeners('pause', app);
    
    return { success: true, app };
  }

  /**
   * RESUME - Bring app back to front
   */
  resumeApp(appId) {
    console.log(`[AppManager] Resuming ${appId}`);
    
    const app = this.runningApps.find(a => a.id === appId);
    if (!app) return { success: false };

    // Pause current active app
    if (this.activeAppId && this.activeAppId !== appId) {
      this.pauseApp(this.activeAppId);
    }

    app.state = APP_STATES.RUNNING;
    this.activeAppId = appId;
    
    console.log(`[AppManager] ${appId} is now RUNNING`);
    this.notifyListeners('resume', app);
    
    return { success: true, app };
  }

  /**
   * TERMINATE - Close app completely
   */
  terminateApp(appId) {
    console.log(`[AppManager] Terminating ${appId}`);
    
    const app = this.runningApps.find(a => a.id === appId);
    if (!app) return { success: false };

    // Free memory
    this.usedMemory -= app.memory;
    
    // Remove from running apps
    this.runningApps = this.runningApps.filter(a => a.id !== appId);
    
    // Clear active app if it's this one
    if (this.activeAppId === appId) {
      this.activeAppId = null;
    }

    console.log(`[AppManager] ${appId} TERMINATED`);
    this.notifyListeners('terminate', { ...app, state: APP_STATES.TERMINATED });
    
    return { success: true };
  }

  /**
   * GET INFO - Get current system status
   */
  getRunningApps() {
    return this.runningApps;
  }

  getActiveApp() {
    if (!this.activeAppId) return null;
    return this.runningApps.find(a => a.id === this.activeAppId);
  }

  getSystemStatus() {
    return {
      runningApps: this.runningApps.length,
      activeAppId: this.activeAppId,
      usedMemory: this.usedMemory,
      totalMemory: this.totalMemory,
      freeMemory: this.totalMemory - this.usedMemory
    };
  }

  /**
   * LISTENERS - Notify others when things change
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  notifyListeners(event, app) {
    this.listeners.forEach(callback => {
      try {
        callback(event, app);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }
}

// Create single instance
const appManager = new AppManager();

export default appManager;
