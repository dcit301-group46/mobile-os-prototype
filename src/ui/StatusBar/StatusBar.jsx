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
import { useSystem } from '../../system/SystemContext'
import { useBatteryManager } from '../../services/BatteryManager'
import { useConnectivityManager } from '../../services/ConnectivityManager'
import './StatusBar.css'

/**
 * StatusBar - System status indicators
 * Memory efficient: No local state, reads from system context
 * Security: Read-only display component
 */
const StatusBar = () => {
  const { systemState } = useSystem()
  const { batteryLevel, isCharging } = useBatteryManager()
  const { wifi, cellular, signalStrength } = useConnectivityManager()

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return faBatteryFull
    if (batteryLevel > 50) return faBatteryThreeQuarters
    if (batteryLevel > 25) return faBatteryHalf
    if (batteryLevel > 10) return faBatteryQuarter
    return faBatteryEmpty
  }

  const getBatteryClass = () => {
    if (batteryLevel <= 10) return 'critical'
    if (batteryLevel <= 20) return 'low'
    return 'normal'
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="time">{formatTime(systemState.system.time)}</span>
      </div>

      <div className="status-right">
        {/* Connectivity indicators */}
        {wifi && (
          <div className="status-icon" title="WiFi Connected">
            <FontAwesomeIcon icon={faWifi} />
          </div>
        )}
        
        {cellular && (
          <div className="status-icon" title={`Signal: ${signalStrength} bars`}>
            <FontAwesomeIcon icon={faSignal} />
          </div>
        )}

        {/* Battery indicator */}
        <div className={`status-icon battery ${getBatteryClass()}`} title={`Battery: ${Math.round(batteryLevel)}%`}>
          {isCharging && (
            <FontAwesomeIcon icon={faBolt} className="charging-icon" />
          )}
          <FontAwesomeIcon icon={getBatteryIcon()} />
          <span className="battery-percent">{Math.round(batteryLevel)}%</span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar
