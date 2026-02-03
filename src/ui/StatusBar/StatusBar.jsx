import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWifi, 
  faSignal, 
  faBatteryFull, 
  faBatteryThreeQuarters,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryEmpty,
  faBolt
} from '@fortawesome/free-solid-svg-icons'
import { useBatteryManager } from '../../services/BatteryManager'
import { useConnectivityManager } from '../../services/ConnectivityManager'
import './StatusBar.css'

/**
 * StatusBar - System status indicators
 * Memory efficient: Minimal local state, live updates
 * Security: Read-only display component
 */
const StatusBar = ({ darkMode = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { batteryLevel, isCharging } = useBatteryManager()
  const { wifi, cellular, signalStrength } = useConnectivityManager()

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return faBatteryFull
    if (batteryLevel > 50) return faBatteryThreeQuarters
    if (batteryLevel > 25) return faBatteryHalf
    if (batteryLevel > 10) return faBatteryQuarter
    return faBatteryEmpty
  }

  const getBatteryColor = () => {
    if (batteryLevel <= 10) return '#FF3B30'
    if (batteryLevel <= 20) return '#FF9500'
    return darkMode ? '#FFFFFF' : '#000000'
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className={`status-bar ${darkMode ? 'dark' : ''}`}>
      <div className="status-left">
        <span className="time">{formatTime(currentTime)}</span>
      </div>

      <div className="status-right">
        {/* Connectivity indicators */}
        {wifi && (
          <div className="status-icon connectivity" title="WiFi Connected">
            <FontAwesomeIcon icon={faWifi} />
          </div>
        )}
        
        {cellular && (
          <div className="status-icon connectivity" title={`Signal: ${signalStrength} bars`}>
            <FontAwesomeIcon icon={faSignal} />
          </div>
        )}

        {/* Battery indicator */}
        <div className="battery-container" title={`Battery: ${Math.round(batteryLevel)}%`}>
          {isCharging && (
            <FontAwesomeIcon icon={faBolt} className="charging-icon" />
          )}
          <FontAwesomeIcon 
            icon={getBatteryIcon()} 
            className="battery-icon"
            style={{ color: getBatteryColor() }}
          />
          <span className="battery-percent" style={{ color: getBatteryColor() }}>
            {Math.round(batteryLevel)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar
