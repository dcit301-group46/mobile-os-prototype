import { useEffect, useCallback } from 'react'
import { useSystem } from '../system/SystemContext'

/**
 * BatteryManager - Power consumption tracking and optimization
 * Memory efficient: Minimal state, uses SystemContext
 * Security: Validates battery level bounds
 */
const BATTERY_DRAIN_RATES = {
  screenOn: 0.05,        // 0.05% per second when screen on
  screenOff: 0.01,       // 0.01% per second when locked
  appRunning: 0.02,      // 0.02% per app running
  wifiOn: 0.01,          // 0.01% when wifi active
  cellularOn: 0.015,     // 0.015% when cellular active
  charging: -0.2         // -0.2% means +0.2% when charging
}

const LOW_BATTERY_THRESHOLD = 20
const CRITICAL_BATTERY_THRESHOLD = 10

export const useBatteryManager = () => {
  const { systemState, updateBatteryLevel } = useSystem()

  // Calculate total drain rate based on system state
  const calculateDrainRate = useCallback(() => {
    let drainRate = 0

    // Charging overrides drain
    if (systemState.battery.isCharging) {
      return BATTERY_DRAIN_RATES.charging
    }

    // Screen state
    drainRate += systemState.isLocked 
      ? BATTERY_DRAIN_RATES.screenOff 
      : BATTERY_DRAIN_RATES.screenOn

    // Running apps
    drainRate += systemState.runningApps.length * BATTERY_DRAIN_RATES.appRunning

    // Connectivity
    if (systemState.connectivity.wifi) {
      drainRate += BATTERY_DRAIN_RATES.wifiOn
    }
    if (systemState.connectivity.cellular) {
      drainRate += BATTERY_DRAIN_RATES.cellularOn
    }

    // Power save mode reduces drain by 50%
    if (systemState.battery.powerSaveMode) {
      drainRate *= 0.5
    }

    return drainRate
  }, [systemState])

  // Battery drain simulation
  useEffect(() => {
    if (!systemState.isBooted) return

    const interval = setInterval(() => {
      const drainRate = calculateDrainRate()
      const currentLevel = systemState.battery.level
      
      // Calculate new level
      const newLevel = currentLevel - drainRate

      // Bounds checking
      const boundedLevel = Math.max(0, Math.min(100, newLevel))

      // Update battery level
      if (boundedLevel !== currentLevel) {
        updateBatteryLevel(boundedLevel)
      }

      // Battery warnings (would trigger alerts in real implementation)
      if (boundedLevel <= CRITICAL_BATTERY_THRESHOLD && currentLevel > CRITICAL_BATTERY_THRESHOLD) {
        console.warn('[BatteryManager] Critical battery level:', boundedLevel.toFixed(1) + '%')
      } else if (boundedLevel <= LOW_BATTERY_THRESHOLD && currentLevel > LOW_BATTERY_THRESHOLD) {
        console.warn('[BatteryManager] Low battery:', boundedLevel.toFixed(1) + '%')
      }

      // System shutdown at 0%
      if (boundedLevel === 0) {
        console.error('[BatteryManager] Battery depleted - system shutdown')
      }
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [systemState.isBooted, calculateDrainRate, systemState.battery.level, updateBatteryLevel])

  const toggleCharging = useCallback(() => {
    const newChargingState = !systemState.battery.isCharging
    // Update charging state via SystemContext
    updateBatteryLevel(systemState.battery.level) // Trigger update
  }, [systemState.battery.isCharging, systemState.battery.level, updateBatteryLevel])

  const getBatteryStatus = useCallback(() => {
    const level = systemState.battery.level
    
    if (systemState.battery.isCharging) return 'charging'
    if (level <= CRITICAL_BATTERY_THRESHOLD) return 'critical'
    if (level <= LOW_BATTERY_THRESHOLD) return 'low'
    return 'normal'
  }, [systemState.battery])

  return {
    batteryLevel: systemState.battery.level,
    isCharging: systemState.battery.isCharging,
    powerSaveMode: systemState.battery.powerSaveMode,
    batteryStatus: getBatteryStatus(),
    toggleCharging
  }
}

export default useBatteryManager
