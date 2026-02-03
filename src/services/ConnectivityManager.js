import { useCallback } from 'react'
import { useSystem } from '../system/SystemContext'

/**
 * ConnectivityManager - Network state and connectivity simulation
 * Memory efficient: Uses SystemContext, no additional state
 * Security: Validates connectivity states
 */
const CONNECTIVITY_TYPES = {
  NONE: 'none',
  WIFI: 'wifi',
  CELLULAR: 'cellular',
  BOTH: 'both'
}

export const useConnectivityManager = () => {
  const { systemState, toggleWifi, toggleCellular, setSystemState } = useSystem()

  const getConnectionType = useCallback(() => {
    const { wifi, cellular, airplaneMode } = systemState.connectivity

    if (airplaneMode) return CONNECTIVITY_TYPES.NONE
    if (wifi && cellular) return CONNECTIVITY_TYPES.BOTH
    if (wifi) return CONNECTIVITY_TYPES.WIFI
    if (cellular) return CONNECTIVITY_TYPES.CELLULAR
    return CONNECTIVITY_TYPES.NONE
  }, [systemState.connectivity])

  const isConnected = useCallback(() => {
    return getConnectionType() !== CONNECTIVITY_TYPES.NONE
  }, [getConnectionType])

  const toggleAirplaneMode = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      connectivity: {
        ...prev.connectivity,
        airplaneMode: !prev.connectivity.airplaneMode,
        wifi: prev.connectivity.airplaneMode ? prev.connectivity.wifi : false,
        cellular: prev.connectivity.airplaneMode ? prev.connectivity.cellular : false
      }
    }))
  }, [setSystemState])

  const enableWifi = useCallback(() => {
    if (!systemState.connectivity.wifi && !systemState.connectivity.airplaneMode) {
      toggleWifi()
    }
  }, [systemState.connectivity, toggleWifi])

  const disableWifi = useCallback(() => {
    if (systemState.connectivity.wifi) {
      toggleWifi()
    }
  }, [systemState.connectivity, toggleWifi])

  const enableCellular = useCallback(() => {
    if (!systemState.connectivity.cellular && !systemState.connectivity.airplaneMode) {
      toggleCellular()
    }
  }, [systemState.connectivity, toggleCellular])

  const disableCellular = useCallback(() => {
    if (systemState.connectivity.cellular) {
      toggleCellular()
    }
  }, [systemState.connectivity, toggleCellular])

  const getSignalStrength = useCallback(() => {
    // Simulate signal strength (in real implementation would be based on actual network)
    const connectionType = getConnectionType()
    
    if (connectionType === CONNECTIVITY_TYPES.NONE) return 0
    if (connectionType === CONNECTIVITY_TYPES.WIFI) return Math.floor(Math.random() * 2) + 3 // 3-4 bars
    if (connectionType === CONNECTIVITY_TYPES.CELLULAR) return Math.floor(Math.random() * 3) + 2 // 2-4 bars
    
    return 4 // Both connected = full signal
  }, [getConnectionType])

  return {
    wifi: systemState.connectivity.wifi,
    cellular: systemState.connectivity.cellular,
    airplaneMode: systemState.connectivity.airplaneMode,
    connectionType: getConnectionType(),
    isConnected: isConnected(),
    signalStrength: getSignalStrength(),
    
    // Actions
    toggleWifi,
    toggleCellular,
    toggleAirplaneMode,
    enableWifi,
    disableWifi,
    enableCellular,
    disableCellular
  }
}

export default useConnectivityManager
