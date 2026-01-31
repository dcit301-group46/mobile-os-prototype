/**
 * SystemContext.jsx
 * Connects AppManager to React
 * * Developer: Mabel
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import appManager from './AppManager';

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
  const [runningApps, setRunningApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [systemStatus, setSystemStatus] = useState({
    runningApps: 0,
    activeAppId: null,
    usedMemory: 0,
    totalMemory: 2048,
    freeMemory: 2048
  });

  // Listen for app lifecycle changes from the AppManager
  useEffect(() => {
    const handleChange = (event, app) => {
      console.log(`[SystemContext] ${event} event:`, app);
      setRunningApps(appManager.getRunningApps());
      setActiveApp(appManager.getActiveApp());
      setSystemStatus(appManager.getSystemStatus());
    };

    appManager.addListener(handleChange);

    return () => {
      appManager.removeListener(handleChange);
    };
  }, []);

  // Functions to control the OS states
  const value = {
    // 1. Launch a new process (NEW -> RUNNING)
    launchApp: (appId) => appManager.launchApp(appId),
    
    // 2. Resume a background process (PAUSED -> RUNNING)
    resumeApp: (appId) => appManager.resumeApp(appId),
    
    // 3. Terminate and free memory (RUNNING/PAUSED -> TERMINATED)
    terminateApp: (appId) => appManager.terminateApp(appId),
    
    // 4. The Home Button Logic (RUNNING -> PAUSED)
    goHome: () => {
      const currentActive = appManager.getActiveApp();
      if (currentActive) {
        appManager.pauseApp(currentActive.id);
      }
    },
    
    // Current System State
    runningApps,
    activeApp,
    systemStatus
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

// Custom hook for easy access in components
export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within SystemProvider');
  }
  return context;
};

export default SystemContext;