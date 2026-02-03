import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SystemContext = createContext(null)

const INITIAL_STATE = {
  isBooted: false,
  isLocked: true,
  currentScreen: 'lock',
  
  apps: [],
  runningApps: [],
  installedApps: [],
  
  permissions: {},
  
  connectivity: {
    wifi: false,
    cellular: false,
    airplaneMode: false
  },
  
  battery: {
    level: 100,
    isCharging: false,
    powerSaveMode: false,
    lastUpdate: Date.now()
  },
  
  system: {
    time: new Date(),
    notifications: [],
    activeApp: null
  }
}

export const SystemProvider = ({ children }) => {
  const [systemState, setSystemState] = useState(() => {
    // Attempt to restore state from localStorage
    try {
      const saved = localStorage.getItem('mobile-os-state')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Calculate battery restoration
        let batteryLevel = parsed.battery?.level || 85
        
        // If battery was at 0 or very low, reset to reasonable level
        if (batteryLevel < 5) {
          batteryLevel = 85
        }
        
        // If last update was more than 1 hour ago, assume device was "charged"
        const lastUpdate = parsed.battery?.lastUpdate || Date.now()
        const timeSinceUpdate = Date.now() - lastUpdate
        if (timeSinceUpdate > 3600000) { // 1 hour
          batteryLevel = Math.min(100, batteryLevel + 15)
        }
        
        return {
          ...INITIAL_STATE,
          ...parsed,
          isBooted: false, // Always start unbooted
          battery: {
            level: batteryLevel,
            isCharging: false,
            powerSaveMode: batteryLevel <= 20,
            lastUpdate: Date.now()
          },
          system: {
            ...INITIAL_STATE.system,
            time: new Date()
          }
        }
      }
    } catch (error) {
      console.warn('Failed to restore system state:', error)
    }
    return INITIAL_STATE
  })

  // Persist critical state to localStorage
  useEffect(() => {
    const stateToPersist = {
      permissions: systemState.permissions,
      connectivity: systemState.connectivity,
      battery: {
        ...systemState.battery,
        lastUpdate: Date.now()
      },
      installedApps: systemState.installedApps
    }
    
    try {
      localStorage.setItem('mobile-os-state', JSON.stringify(stateToPersist))
    } catch (error) {
      console.warn('Failed to persist system state:', error)
    }
  }, [systemState.permissions, systemState.connectivity, systemState.battery, systemState.installedApps])

  // System time update
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemState(prev => ({
        ...prev,
        system: {
          ...prev.system,
          time: new Date()
        }
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Boot system
  const bootSystem = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      isBooted: true
    }))
  }, [])

  // Unlock screen
  const unlockScreen = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      isLocked: false,
      currentScreen: 'home'
    }))
  }, [])

  // Lock screen
  const lockScreen = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      isLocked: true,
      currentScreen: 'lock'
    }))
  }, [])

  // Update battery level
  const updateBatteryLevel = useCallback((level) => {
    setSystemState(prev => ({
      ...prev,
      battery: {
        ...prev.battery,
        level: Math.max(0, Math.min(100, level)),
        powerSaveMode: level <= 20,
        lastUpdate: Date.now()
      }
    }))
  }, [])

  // Toggle connectivity
  const toggleWifi = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      connectivity: {
        ...prev.connectivity,
        wifi: !prev.connectivity.wifi
      }
    }))
  }, [])

  const toggleCellular = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      connectivity: {
        ...prev.connectivity,
        cellular: !prev.connectivity.cellular
      }
    }))
  }, [])

  // Toggle charging
  const toggleCharging = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      battery: {
        ...prev.battery,
        isCharging: !prev.battery.isCharging
      }
    }))
  }, [])

  // Grant permission
  const grantPermission = useCallback((appId, permissionType) => {
    setSystemState(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [appId]: {
          ...prev.permissions[appId],
          [permissionType]: 'granted'
        }
      }
    }))
  }, [])

  // Deny permission
  const denyPermission = useCallback((appId, permissionType) => {
    setSystemState(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [appId]: {
          ...prev.permissions[appId],
          [permissionType]: 'denied'
        }
      }
    }))
  }, [])

  // Launch app
  const launchApp = useCallback((appId) => {
    setSystemState(prev => {
      const isAlreadyRunning = prev.runningApps.some(app => app.id === appId)
      
      if (isAlreadyRunning) {
        return {
          ...prev,
          system: {
            ...prev.system,
            activeApp: appId
          }
        }
      }

      const app = prev.installedApps.find(a => a.id === appId)
      if (!app) return prev

      return {
        ...prev,
        runningApps: [...prev.runningApps, { ...app, state: 'running', startTime: Date.now() }],
        system: {
          ...prev.system,
          activeApp: appId
        }
      }
    })
  }, [])

  // Close app
  const closeApp = useCallback((appId) => {
    setSystemState(prev => ({
      ...prev,
      runningApps: prev.runningApps.filter(app => app.id !== appId),
      system: {
        ...prev.system,
        activeApp: prev.system.activeApp === appId ? null : prev.system.activeApp
      }
    }))
  }, [])

  // Register installed app
  const registerApp = useCallback((app) => {
    setSystemState(prev => {
      const exists = prev.installedApps.some(a => a.id === app.id)
      if (exists) return prev

      return {
        ...prev,
        installedApps: [...prev.installedApps, app]
      }
    })
  }, [])

  const value = {
    systemState,
    setSystemState,
    
    // System actions
    bootSystem,
    unlockScreen,
    lockScreen,
    
    // Battery actions
    updateBatteryLevel,
    toggleCharging,
    
    // Connectivity actions
    toggleWifi,
    toggleCellular,
    
    // Permission actions
    grantPermission,
    denyPermission,
    
    // App actions
    launchApp,
    closeApp,
    registerApp
  }

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  )
}

export const useSystem = () => {
  const context = useContext(SystemContext)
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider')
  }
  return context
}

export default SystemContext
