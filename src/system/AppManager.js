import { useCallback } from 'react'
import { useSystem } from './SystemContext'

/**
 * AppManager - Application lifecycle and state management
 * Memory efficient: Uses SystemContext, tracks memory usage
 * Security: Validates app operations, enforces permissions
 */
const APP_STATES = {
  INSTALLED: 'installed',
  RUNNING: 'running',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  TERMINATED: 'terminated'
}

const MAX_MEMORY_MB = 512 // Maximum memory for all apps
const MAX_RUNNING_APPS = 5

export const useAppManager = () => {
  const { systemState, launchApp, closeApp, setSystemState } = useSystem()

  // Calculate total memory usage
  const getTotalMemoryUsage = useCallback(() => {
    return systemState.runningApps.reduce((total, app) => {
      return total + (app.memoryUsage || 0)
    }, 0)
  }, [systemState.runningApps])

  // Check if app can be launched
  const canLaunchApp = useCallback((appId) => {
    const app = systemState.installedApps.find(a => a.id === appId)
    if (!app) return { allowed: false, reason: 'App not found' }

    // Check if already running
    const isRunning = systemState.runningApps.some(a => a.id === appId)
    if (isRunning) {
      return { allowed: true, reason: 'Already running' }
    }

    // Check max running apps
    if (systemState.runningApps.length >= MAX_RUNNING_APPS) {
      return { allowed: false, reason: 'Too many apps running' }
    }

    // Check memory availability
    const currentMemory = getTotalMemoryUsage()
    const requiredMemory = app.memoryUsage || 0
    if (currentMemory + requiredMemory > MAX_MEMORY_MB) {
      return { allowed: false, reason: 'Insufficient memory' }
    }

    return { allowed: true, reason: 'OK' }
  }, [systemState.installedApps, systemState.runningApps, getTotalMemoryUsage])

  // Launch app with validation
  const handleLaunchApp = useCallback((appId) => {
    const check = canLaunchApp(appId)
    
    if (!check.allowed) {
      console.warn(`[AppManager] Cannot launch ${appId}: ${check.reason}`)
      return false
    }

    launchApp(appId)
    console.log(`[AppManager] Launched ${appId}`)
    return true
  }, [canLaunchApp, launchApp])

  // Pause app (send to background)
  const pauseApp = useCallback((appId) => {
    setSystemState(prev => ({
      ...prev,
      runningApps: prev.runningApps.map(app =>
        app.id === appId ? { ...app, state: APP_STATES.PAUSED } : app
      )
    }))
    console.log(`[AppManager] Paused ${appId}`)
  }, [setSystemState])

  // Resume app
  const resumeApp = useCallback((appId) => {
    setSystemState(prev => ({
      ...prev,
      runningApps: prev.runningApps.map(app =>
        app.id === appId ? { ...app, state: APP_STATES.RUNNING } : app
      ),
      system: {
        ...prev.system,
        activeApp: appId
      }
    }))
    console.log(`[AppManager] Resumed ${appId}`)
  }, [setSystemState])

  // Stop app (but keep in memory)
  const stopApp = useCallback((appId) => {
    setSystemState(prev => ({
      ...prev,
      runningApps: prev.runningApps.map(app =>
        app.id === appId ? { ...app, state: APP_STATES.STOPPED } : app
      )
    }))
    console.log(`[AppManager] Stopped ${appId}`)
  }, [setSystemState])

  // Terminate app (remove from memory)
  const terminateApp = useCallback((appId) => {
    closeApp(appId)
    console.log(`[AppManager] Terminated ${appId}`)
  }, [closeApp])

  // Get app state
  const getAppState = useCallback((appId) => {
    const runningApp = systemState.runningApps.find(a => a.id === appId)
    if (!runningApp) return APP_STATES.INSTALLED
    return runningApp.state || APP_STATES.RUNNING
  }, [systemState.runningApps])

  // Kill background apps to free memory
  const freeMemory = useCallback((targetMemoryMB) => {
    const currentMemory = getTotalMemoryUsage()
    if (currentMemory <= targetMemoryMB) return

    // Sort by last active time (oldest first)
    const sortedApps = [...systemState.runningApps].sort((a, b) => {
      const aActive = systemState.system.activeApp === a.id
      const bActive = systemState.system.activeApp === b.id
      if (aActive) return 1  // Keep active app
      if (bActive) return -1
      return (a.startTime || 0) - (b.startTime || 0)
    })

    let freedMemory = 0
    const appsToKill = []

    for (const app of sortedApps) {
      if (currentMemory - freedMemory <= targetMemoryMB) break
      if (systemState.system.activeApp === app.id) continue // Don't kill active app

      appsToKill.push(app.id)
      freedMemory += app.memoryUsage || 0
    }

    appsToKill.forEach(terminateApp)
    console.log(`[AppManager] Freed ${freedMemory}MB by terminating ${appsToKill.length} apps`)
  }, [getTotalMemoryUsage, systemState.runningApps, systemState.system.activeApp, terminateApp])

  return {
    APP_STATES,
    
    // State queries
    runningApps: systemState.runningApps,
    activeApp: systemState.system.activeApp,
    memoryUsage: getTotalMemoryUsage(),
    maxMemory: MAX_MEMORY_MB,
    
    // App operations
    launchApp: handleLaunchApp,
    pauseApp,
    resumeApp,
    stopApp,
    terminateApp,
    getAppState,
    canLaunchApp,
    freeMemory
  }
}

export default useAppManager
