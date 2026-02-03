import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faXmark, 
  faCog, 
  faWifi, 
  faSignal, 
  faBatteryFull,
  faMobileAlt,
  faPlane,
  faShieldAlt,
  faInfoCircle,
  faHdd,
  faMicrochip,
  faMemory,
  faCamera,
  faLocationDot,
  faBell,
  faGlobe,
  faMicrophone,
  faAddressBook,
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
  faCalculator,
  faFileAlt,
  faFolder,
  faChartBar,
  faCircle,
  faBolt,
  faChartLine,
  faLightbulb,
  faClock,
  faArrowUp,
  faArrowDown,
  faLock,
  faNetworkWired
} from '@fortawesome/free-solid-svg-icons'
import { useSystem } from '../../system/SystemContext'
import { useConnectivityManager } from '../../services/ConnectivityManager'
import { useBatteryManager } from '../../services/BatteryManager'
import { useAppManager } from '../../system/AppManager'
import { usePermissionManager } from '../../services/PermissionManager'
import './Settings.css'

/**
 * Settings Application - System control center
 * Provides access to connectivity, battery, apps, and permissions
 */
const Settings = () => {
  const { closeApp, systemState } = useSystem()
  const { wifi, cellular, airplaneMode, toggleWifi, toggleCellular, toggleAirplaneMode } = useConnectivityManager()
  const { batteryLevel, isCharging, powerSaveMode } = useBatteryManager()
  const { runningApps, memoryUsage, maxMemory, terminateApp } = useAppManager()
  const { getAppPermissions, revokePermission, PERMISSION_TYPES } = usePermissionManager()
  
  const [activeSection, setActiveSection] = useState('connectivity')

  return (
    <div className="app-window settings-app">
      <div className="app-header">
        <span className="app-title">Settings</span>
        <button className="app-close" onClick={() => closeApp('settings')}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <div className="app-body">
        <div className="settings-nav">
          <button 
            className={activeSection === 'connectivity' ? 'active' : ''}
            onClick={() => setActiveSection('connectivity')}
          >
            <FontAwesomeIcon icon={faWifi} />
            Connectivity
          </button>
          <button 
            className={activeSection === 'battery' ? 'active' : ''}
            onClick={() => setActiveSection('battery')}
          >
            <FontAwesomeIcon icon={faBatteryFull} />
            Battery
          </button>
          <button 
            className={activeSection === 'apps' ? 'active' : ''}
            onClick={() => setActiveSection('apps')}
          >
            <FontAwesomeIcon icon={faMobileAlt} />
            Apps
          </button>
          <button 
            className={activeSection === 'permissions' ? 'active' : ''}
            onClick={() => setActiveSection('permissions')}
          >
            <FontAwesomeIcon icon={faShieldAlt} />
            Permissions
          </button>
          <button 
            className={activeSection === 'about' ? 'active' : ''}
            onClick={() => setActiveSection('about')}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            About
          </button>
        </div>

        <div className="settings-content">
          {activeSection === 'connectivity' && (
            <ConnectivitySection 
              wifi={wifi}
              cellular={cellular}
              airplaneMode={airplaneMode}
              toggleWifi={toggleWifi}
              toggleCellular={toggleCellular}
              toggleAirplaneMode={toggleAirplaneMode}
            />
          )}

          {activeSection === 'battery' && (
            <BatterySection 
              batteryLevel={batteryLevel}
              isCharging={isCharging}
              powerSaveMode={powerSaveMode}
            />
          )}

          {activeSection === 'apps' && (
            <AppsSection 
              runningApps={runningApps}
              installedApps={systemState.installedApps}
              memoryUsage={memoryUsage}
              maxMemory={maxMemory}
              terminateApp={terminateApp}
            />
          )}

          {activeSection === 'permissions' && (
            <PermissionsSection 
              installedApps={systemState.installedApps}
              getAppPermissions={getAppPermissions}
              revokePermission={revokePermission}
              permissionTypes={PERMISSION_TYPES}
            />
          )}

          {activeSection === 'about' && <AboutSection />}
        </div>
      </div>
    </div>
  )
}

// Connectivity Section Component
const ConnectivitySection = ({ wifi, cellular, airplaneMode, toggleWifi, toggleCellular, toggleAirplaneMode }) => {
  const { signalStrength, connectionType } = useConnectivityManager()
  
  // Simulate network data
  const wifiNetwork = {
    name: 'MyNetwork',
    security: 'WPA2',
    frequency: '5 GHz',
    ipAddress: '192.168.1.42',
    speed: 'Fast'
  }

  const cellularData = {
    carrier: 'Mobile Carrier',
    type: '5G',
    dataUsed: '2.3 GB',
    dataLimit: '10 GB'
  }

  const getSignalQuality = () => {
    if (signalStrength >= 3) return 'Excellent'
    if (signalStrength >= 2) return 'Good'
    if (signalStrength >= 1) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="settings-section">
      <h2>Wireless & Networks</h2>
      
      {/* Airplane Mode */}
      <div className="connectivity-card">
        <div className="connectivity-card-header">
          <div className="setting-icon airplane-mode">
            <FontAwesomeIcon icon={faPlane} />
          </div>
          <div className="connectivity-title">
            <h3>Airplane Mode</h3>
            <p>{airplaneMode ? 'All wireless connections disabled' : 'Wireless connections enabled'}</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={airplaneMode} onChange={toggleAirplaneMode} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* WiFi Section */}
      <div className="section-header-text">WI-FI</div>
      <div className="connectivity-card">
        <div className="connectivity-card-header">
          <div className={`setting-icon wifi-icon ${wifi && !airplaneMode ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faWifi} />
          </div>
          <div className="connectivity-title">
            <h3>WiFi</h3>
            <p>{airplaneMode ? 'Disabled by Airplane Mode' : wifi ? wifiNetwork.name : 'Not Connected'}</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={wifi} 
              onChange={toggleWifi} 
              disabled={airplaneMode} 
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {wifi && !airplaneMode && (
          <div className="network-details">
            <div className="network-status">
              <div className="status-item">
                <FontAwesomeIcon icon={faSignal} />
                <div className="status-info">
                  <span className="status-label">Signal</span>
                  <span className="status-value">{getSignalQuality()}</span>
                </div>
              </div>
              <div className="signal-indicator">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`signal-bar ${i < signalStrength ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className="network-info-grid">
              <div className="network-info-item">
                <FontAwesomeIcon icon={faLock} />
                <div>
                  <span className="info-label">Security</span>
                  <span className="info-value">{wifiNetwork.security}</span>
                </div>
              </div>
              <div className="network-info-item">
                <FontAwesomeIcon icon={faNetworkWired} />
                <div>
                  <span className="info-label">Frequency</span>
                  <span className="info-value">{wifiNetwork.frequency}</span>
                </div>
              </div>
              <div className="network-info-item">
                <FontAwesomeIcon icon={faGlobe} />
                <div>
                  <span className="info-label">IP Address</span>
                  <span className="info-value">{wifiNetwork.ipAddress}</span>
                </div>
              </div>
              <div className="network-info-item">
                <FontAwesomeIcon icon={faChartBar} />
                <div>
                  <span className="info-label">Speed</span>
                  <span className="info-value">{wifiNetwork.speed}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cellular Section */}
      <div className="section-header-text">CELLULAR</div>
      <div className="connectivity-card">
        <div className="connectivity-card-header">
          <div className={`setting-icon cellular-icon ${cellular && !airplaneMode ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faSignal} />
          </div>
          <div className="connectivity-title">
            <h3>Cellular Data</h3>
            <p>{airplaneMode ? 'Disabled by Airplane Mode' : cellular ? cellularData.carrier : 'Not Connected'}</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={cellular} 
              onChange={toggleCellular} 
              disabled={airplaneMode} 
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {cellular && !airplaneMode && (
          <div className="network-details">
            <div className="network-status">
              <div className="status-item">
                <FontAwesomeIcon icon={faSignal} />
                <div className="status-info">
                  <span className="status-label">Connection</span>
                  <span className="status-value">{cellularData.type}</span>
                </div>
              </div>
              <div className="signal-indicator">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`signal-bar cellular ${i < signalStrength ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Data Usage */}
            <div className="data-usage-widget">
              <div className="data-usage-header">
                <span>Data Usage This Month</span>
                <span className="data-usage-amount">{cellularData.dataUsed} / {cellularData.dataLimit}</span>
              </div>
              <div className="data-usage-bar">
                <div 
                  className="data-usage-fill"
                  style={{ 
                    width: `${(parseFloat(cellularData.dataUsed) / parseFloat(cellularData.dataLimit)) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="data-breakdown">
                <div className="data-item">
                  <FontAwesomeIcon icon={faArrowUp} />
                  <span>Uploaded: 450 MB</span>
                </div>
                <div className="data-item">
                  <FontAwesomeIcon icon={faArrowDown} />
                  <span>Downloaded: 1.85 GB</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connection Status */}
      {(wifi || cellular) && !airplaneMode && (
        <>
          <div className="section-header-text">CONNECTION STATUS</div>
          <div className="about-info">
            <div className="info-item">
              <div className="info-icon-label">
                <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#34C759' }} />
                <span>Status</span>
              </div>
              <span className="info-value">Connected</span>
            </div>
            <div className="info-item">
              <div className="info-icon-label">
                <FontAwesomeIcon icon={faNetworkWired} style={{ color: '#007AFF' }} />
                <span>Connection Type</span>
              </div>
              <span className="info-value">
                {connectionType === 'both' 
                  ? 'WiFi + Cellular' 
                  : connectionType === 'wifi'
                  ? 'WiFi'
                  : 'Cellular'}
              </span>
            </div>
            <div className="info-item">
              <div className="info-icon-label">
                <FontAwesomeIcon icon={faGlobe} style={{ color: '#FF9500' }} />
                <span>Internet Access</span>
              </div>
              <span className="info-value">Available</span>
            </div>
          </div>
        </>
      )}

      {/* Network Tips */}
      {airplaneMode && (
        <div className="battery-tip-box warning">
          <FontAwesomeIcon icon={faExclamationCircle} />
          <div>
            <strong>Airplane Mode is On</strong>
            <p>All wireless connections including WiFi, Cellular, and Bluetooth are disabled.</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Battery Section Component
const BatterySection = ({ batteryLevel, isCharging, powerSaveMode }) => {
  const getBatteryColor = () => {
    if (batteryLevel <= 20) return '#FF3B30'
    if (batteryLevel <= 50) return '#FF9500'
    return '#34C759'
  }

  const getTimeRemaining = () => {
    if (isCharging) {
      const timeToFull = ((100 - batteryLevel) / 0.2) / 60 // Minutes to full charge
      const hours = Math.floor(timeToFull / 60)
      const mins = Math.floor(timeToFull % 60)
      if (hours > 0) return `${hours}h ${mins}m until full`
      return `${mins}m until full`
    }
    const hours = Math.floor((batteryLevel / 5) * 60 / 60)
    const minutes = Math.floor(((batteryLevel / 5) * 60) % 60)
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const getBatteryHealth = () => {
    // Simulate battery health based on charge cycles (in real app would be from hardware)
    return 100
  }

  const getChargeCycles = () => {
    // Simulate charge cycles
    return 12
  }

  // Simulate 24-hour battery usage history
  const batteryHistory = [
    100, 98, 95, 92, 88, 85, 80, 76, 72, 68, 65, 62,
    58, 55, 52, 50, 48, 46, 44, 42, 40, 38, 36, batteryLevel
  ]

  return (
    <div className="settings-section">
      <h2>Battery & Power</h2>
      
      {/* Battery Status Card */}
      <div className="battery-status-card">
        <div className="battery-main-display">
          <div className="battery-icon-visual">
            <div className="battery-shell" style={{ borderColor: getBatteryColor() }}>
              <div 
                className="battery-level-fill" 
                style={{ 
                  height: `${batteryLevel}%`,
                  background: getBatteryColor()
                }}
              ></div>
              {isCharging && (
                <div className="charging-bolt-overlay">
                  <FontAwesomeIcon icon={faBolt} />
                </div>
              )}
            </div>
            <div className="battery-tip"></div>
          </div>
          <div className="battery-status-info">
            <div className="battery-percentage-large" style={{ color: getBatteryColor() }}>
              {Math.round(batteryLevel)}%
            </div>
            <div className="battery-status-text">{getTimeRemaining()}</div>
            {isCharging && (
              <div className="charging-badge">
                <FontAwesomeIcon icon={faBolt} />
                Charging
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Usage Graph */}
      <div className="section-header-text">24-HOUR USAGE</div>
      <div className="battery-usage-graph">
        <div className="usage-graph-header">
          <FontAwesomeIcon icon={faChartLine} />
          <span>Battery Level Over Time</span>
        </div>
        <div className="graph-container">
          <div className="graph-y-axis">
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
          </div>
          <div className="graph-area">
            <svg viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="batteryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: getBatteryColor(), stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: getBatteryColor(), stopOpacity: 0.05 }} />
                </linearGradient>
              </defs>
              <path
                d={`M 0 ${100 - batteryHistory[0]} ${batteryHistory.map((level, i) => `L ${(i / (batteryHistory.length - 1)) * 300} ${100 - level}`).join(' ')} L 300 100 L 0 100 Z`}
                fill="url(#batteryGradient)"
              />
              <polyline
                points={batteryHistory.map((level, i) => `${(i / (batteryHistory.length - 1)) * 300},${100 - level}`).join(' ')}
                fill="none"
                stroke={getBatteryColor()}
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="graph-x-axis">
            <span>24h ago</span>
            <span>12h ago</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      {/* Power Settings */}
      <div className="section-header-text">POWER MANAGEMENT</div>
      <div className="about-info">
        <div className="info-item">
          <div className="info-icon-label">
            <div className="power-icon low-power">
              <FontAwesomeIcon icon={faBatteryFull} />
            </div>
            <div className="power-label-content">
              <span>Low Power Mode</span>
              <span className="power-description">
                {powerSaveMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={powerSaveMode} 
              disabled={true}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {powerSaveMode && (
        <div className="battery-tip-box warning">
          <FontAwesomeIcon icon={faExclamationCircle} />
          <div>
            <strong>Low Power Mode Active</strong>
            <p>Automatically enabled at 20%. Some features limited to extend battery life.</p>
          </div>
        </div>
      )}

      {/* Battery Health */}
      <div className="section-header-text">BATTERY HEALTH</div>
      <div className="battery-health-card">
        <div className="health-header">
          <div className="health-percentage">{getBatteryHealth()}%</div>
          <div className="health-status">
            <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#34C759' }} />
            Maximum Capacity
          </div>
        </div>
        <div className="health-details">
          <div className="health-row">
            <span>Charge Cycles</span>
            <span>{getChargeCycles()}</span>
          </div>
          <div className="health-row">
            <span>Condition</span>
            <span className="health-good">Excellent</span>
          </div>
          <div className="health-row">
            <span>Optimized Charging</span>
            <span>Enabled</span>
          </div>
        </div>
      </div>

      {/* Power Usage by App */}
      <div className="section-header-text">POWER USAGE BY APP</div>
      <div className="power-usage-list">
        <div className="power-usage-item">
          <div className="usage-app-info">
            <div className="app-icon-small" style={{ backgroundColor: '#8E8E93' }}>
              <FontAwesomeIcon icon={faCog} />
            </div>
            <div className="usage-details">
              <span className="usage-app-name">Settings</span>
              <span className="usage-time">2h 15m</span>
            </div>
          </div>
          <div className="usage-percent">12%</div>
        </div>
        <div className="power-usage-item">
          <div className="usage-app-info">
            <div className="app-icon-small" style={{ backgroundColor: '#FFCC00' }}>
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
            <div className="usage-details">
              <span className="usage-app-name">Notes</span>
              <span className="usage-time">1h 30m</span>
            </div>
          </div>
          <div className="usage-percent">8%</div>
        </div>
        <div className="power-usage-item">
          <div className="usage-app-info">
            <div className="app-icon-small" style={{ backgroundColor: '#FF9500' }}>
              <FontAwesomeIcon icon={faCalculator} />
            </div>
            <div className="usage-details">
              <span className="usage-app-name">Calculator</span>
              <span className="usage-time">45m</span>
            </div>
          </div>
          <div className="usage-percent">5%</div>
        </div>
      </div>

      {/* Battery Tips */}
      <div className="section-header-text">BATTERY TIPS</div>
      <div className="battery-tip-box info">
        <FontAwesomeIcon icon={faLightbulb} />
        <div>
          <strong>Optimize Battery Life</strong>
          <ul>
            <li>Enable Low Power Mode when battery is low</li>
            <li>Reduce screen brightness for longer usage</li>
            <li>Close unused apps to save power</li>
            <li>Disable WiFi and Cellular when not needed</li>
          </ul>
        </div>
      </div>

      {/* Charging Information */}
      <div className="section-header-text">CHARGING INFORMATION</div>
      <div className="about-info">
        <div className="info-item">
          <div className="info-icon-label">
            <FontAwesomeIcon icon={faClock} style={{ color: '#007AFF' }} />
            <span>Last Charged</span>
          </div>
          <span className="info-value">Today</span>
        </div>
        <div className="info-item">
          <div className="info-icon-label">
            <FontAwesomeIcon icon={faBolt} style={{ color: '#FF9500' }} />
            <span>Charging Speed</span>
          </div>
          <span className="info-value">{isCharging ? 'Standard' : 'Not Charging'}</span>
        </div>
        <div className="info-item">
          <div className="info-icon-label">
            <FontAwesomeIcon icon={faChartBar} style={{ color: '#34C759' }} />
            <span>Average Usage</span>
          </div>
          <span className="info-value">5h 30m/day</span>
        </div>
      </div>
    </div>
  )
}

// Apps Section Component
const AppsSection = ({ runningApps, installedApps, memoryUsage, maxMemory, terminateApp }) => {
  const [selectedApp, setSelectedApp] = useState(null)
  const [viewMode, setViewMode] = useState('running') // 'running' or 'installed'

  // App icon mapping
  const getAppIcon = (appName) => {
    const icons = {
      'Settings': faCog,
      'Calculator': faCalculator,
      'Notes': faFileAlt,
      'File Manager': faFolder
    }
    return icons[appName] || faMobileAlt
  }

  const getAppColor = (appName) => {
    const colors = {
      'Settings': '#8E8E93',
      'Calculator': '#FF9500',
      'Notes': '#FFCC00',
      'File Manager': '#007AFF'
    }
    return colors[appName] || '#5856D6'
  }

  // Calculate memory stats
  const totalRunningMemory = runningApps.reduce((sum, app) => sum + app.memoryUsage, 0)
  const memoryPercent = (memoryUsage / maxMemory) * 100
  const availableMemory = maxMemory - memoryUsage

  // Group apps by category
  const appsByCategory = installedApps.reduce((acc, app) => {
    if (!acc[app.category]) acc[app.category] = []
    acc[app.category].push(app)
    return acc
  }, {})

  return (
    <div className="settings-section">
      <h2>Apps & Storage</h2>

      {/* Memory Overview */}
      <div className="memory-overview">
        <div className="memory-widget">
          <div className="memory-icon">
            <FontAwesomeIcon icon={faMemory} />
          </div>
          <div className="memory-details">
            <div className="memory-label">Memory Usage</div>
            <div className="memory-value">{memoryUsage} MB / {maxMemory} MB</div>
          </div>
        </div>
        <div className="memory-bar-container">
          <div className="memory-bar">
            <div 
              className="memory-fill" 
              style={{ 
                width: `${memoryPercent}%`,
                background: memoryPercent > 80 ? '#FF3B30' : memoryPercent > 60 ? '#FF9500' : '#34C759'
              }}
            ></div>
          </div>
          <div className="memory-status">
            <span className="available">{availableMemory} MB available</span>
            <span className="percent">{memoryPercent.toFixed(1)}% used</span>
          </div>
        </div>
      </div>

      {/* Memory Breakdown */}
      <div className="section-header-text">MEMORY BREAKDOWN</div>
      <div className="about-info">
        <div className="info-item">
          <div className="info-icon-label">
            <FontAwesomeIcon icon={faMobileAlt} style={{ color: '#007AFF' }} />
            <span>Running Apps</span>
          </div>
          <span className="info-value">{totalRunningMemory} MB</span>
        </div>
        <div className="info-item">
          <div className="info-icon-label">
            <FontAwesomeIcon icon={faMicrochip} style={{ color: '#34C759' }} />
            <span>System</span>
          </div>
          <span className="info-value">{memoryUsage - totalRunningMemory} MB</span>
        </div>
        <div className="info-item">
          <div className="info-icon-label">
            <FontAwesomeIcon icon={faChartBar} style={{ color: '#8E8E93' }} />
            <span>Available</span>
          </div>
          <span className="info-value">{availableMemory} MB</span>
        </div>
      </div>

      {/* View Mode Toggle */}
      {!selectedApp && (
        <div className="view-mode-toggle" style={{ marginTop: '20px' }}>
          <button 
            className={viewMode === 'running' ? 'active' : ''}
            onClick={() => setViewMode('running')}
          >
            Running ({runningApps.length})
          </button>
          <button 
            className={viewMode === 'installed' ? 'active' : ''}
            onClick={() => setViewMode('installed')}
          >
            Installed ({installedApps.length})
          </button>
        </div>
      )}

      {/* Running Apps View */}
      {viewMode === 'running' && !selectedApp && (
        <>
          {runningApps.length === 0 ? (
            <div className="empty-state-card">
              <FontAwesomeIcon icon={faMobileAlt} />
              <p>No apps currently running</p>
            </div>
          ) : (
            <>
              <div className="section-header-text">ACTIVE APPLICATIONS</div>
              <div className="app-list-enhanced">
                {runningApps.map(app => (
                  <div key={app.id} className="app-card">
                    <div 
                      className="app-card-content"
                      onClick={() => setSelectedApp(app)}
                    >
                      <div 
                        className="app-icon" 
                        style={{ backgroundColor: getAppColor(app.name) }}
                      >
                        <FontAwesomeIcon icon={getAppIcon(app.name)} />
                      </div>
                      <div className="app-details">
                        <div className="app-name">{app.name}</div>
                        <div className="app-status">
                          <FontAwesomeIcon icon={faCircle} className="status-dot running" />
                          Running
                        </div>
                        <div className="app-memory-usage">
                          <div className="memory-bar-small">
                            <div 
                              className="memory-fill-small"
                              style={{ 
                                width: `${(app.memoryUsage / maxMemory) * 100}%`,
                                background: '#007AFF'
                              }}
                            ></div>
                          </div>
                          <span>{app.memoryUsage} MB</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn-stop-app" 
                      onClick={() => terminateApp(app.id)}
                    >
                      Force Stop
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Installed Apps View */}
      {viewMode === 'installed' && !selectedApp && (
        <>
          {Object.entries(appsByCategory).map(([category, apps]) => (
            <div key={category}>
              <div className="section-header-text">{category.toUpperCase()}</div>
              <div className="about-info">
                {apps.map(app => {
                  const isRunning = runningApps.some(r => r.id === app.id)
                  return (
                    <div 
                      key={app.id} 
                      className="info-item clickable-row"
                      onClick={() => setSelectedApp(app)}
                    >
                      <div className="app-row-content">
                        <div 
                          className="app-icon-small" 
                          style={{ backgroundColor: getAppColor(app.name) }}
                        >
                          <FontAwesomeIcon icon={getAppIcon(app.name)} />
                        </div>
                        <div className="app-info">
                          <div className="app-name">{app.name}</div>
                          <div className="app-meta">
                            {app.memoryUsage} MB
                            {isRunning && (
                              <>
                                <span className="separator">•</span>
                                <span className="running-indicator">
                                  <FontAwesomeIcon icon={faCircle} className="status-dot running" />
                                  Running
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="chevron">›</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}

      {/* App Details View */}
      {selectedApp && (
        <div className="app-detail-view">
          <button className="back-button" onClick={() => setSelectedApp(null)}>
            ‹ Back
          </button>

          <div className="app-detail-header-card">
            <div 
              className="app-icon-large" 
              style={{ backgroundColor: getAppColor(selectedApp.name) }}
            >
              <FontAwesomeIcon icon={getAppIcon(selectedApp.name)} />
            </div>
            <h3>{selectedApp.name}</h3>
            <p className="app-category">{selectedApp.category}</p>
            {runningApps.some(r => r.id === selectedApp.id) && (
              <div className="app-status-badge running">
                <FontAwesomeIcon icon={faCircle} />
                Running
              </div>
            )}
          </div>

          <div className="section-header-text">APP INFORMATION</div>
          <div className="about-info">
            <div className="info-item">
              <span className="info-label">Size</span>
              <span className="info-value">{selectedApp.memoryUsage} MB</span>
            </div>
            <div className="info-item">
              <span className="info-label">Category</span>
              <span className="info-value">{selectedApp.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Version</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value">
                {runningApps.some(r => r.id === selectedApp.id) ? 'Running' : 'Not Running'}
              </span>
            </div>
          </div>

          {runningApps.some(r => r.id === selectedApp.id) && (
            <>
              <div className="section-header-text">MEMORY USAGE</div>
              <div className="memory-detail-card">
                <div className="memory-detail-row">
                  <span>Current Usage</span>
                  <span className="memory-value-large">{selectedApp.memoryUsage} MB</span>
                </div>
                <div className="memory-bar">
                  <div 
                    className="memory-fill"
                    style={{ 
                      width: `${(selectedApp.memoryUsage / maxMemory) * 100}%`,
                      background: '#007AFF'
                    }}
                  ></div>
                </div>
                <div className="memory-percentage">
                  {((selectedApp.memoryUsage / maxMemory) * 100).toFixed(1)}% of total memory
                </div>
              </div>

              <button 
                className="btn-force-stop"
                onClick={() => {
                  terminateApp(selectedApp.id)
                  setSelectedApp(null)
                }}
              >
                Force Stop Application
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Permissions Section Component
const PermissionsSection = ({ installedApps, getAppPermissions, revokePermission, permissionTypes }) => {
  const [selectedApp, setSelectedApp] = useState(null)
  const [viewMode, setViewMode] = useState('apps') // 'apps' or 'permissions'

  // Permission metadata
  const permissionMeta = {
    camera: {
      icon: faCamera,
      color: '#FF3B30',
      description: 'Access device camera for photos and videos'
    },
    location: {
      icon: faLocationDot,
      color: '#007AFF',
      description: 'Access device location services'
    },
    storage: {
      icon: faHdd,
      color: '#FF9500',
      description: 'Read and write to device storage'
    },
    internet: {
      icon: faGlobe,
      color: '#34C759',
      description: 'Access network and internet connection'
    },
    microphone: {
      icon: faMicrophone,
      color: '#FF2D55',
      description: 'Access device microphone for audio recording'
    },
    contacts: {
      icon: faAddressBook,
      color: '#5856D6',
      description: 'Access and manage contacts'
    },
    notifications: {
      icon: faBell,
      color: '#FF9500',
      description: 'Display notifications and alerts'
    }
  }

  // Calculate permission statistics
  const permissionStats = Object.values(permissionTypes).map(permission => {
    let grantedCount = 0
    let deniedCount = 0
    let requestedCount = 0

    installedApps.forEach(app => {
      const perms = getAppPermissions(app.id)
      if (perms[permission] === 'granted') grantedCount++
      else if (perms[permission] === 'denied') deniedCount++
      if (perms[permission]) requestedCount++
    })

    return {
      permission,
      grantedCount,
      deniedCount,
      requestedCount
    }
  }).filter(stat => stat.requestedCount > 0)

  return (
    <div className="settings-section">
      <h2>Privacy & Permissions</h2>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button 
          className={viewMode === 'apps' ? 'active' : ''}
          onClick={() => { setViewMode('apps'); setSelectedApp(null); }}
        >
          By App
        </button>
        <button 
          className={viewMode === 'permissions' ? 'active' : ''}
          onClick={() => { setViewMode('permissions'); setSelectedApp(null); }}
        >
          By Permission
        </button>
      </div>

      {/* Overview Statistics */}
      {!selectedApp && (
        <div className="permission-overview">
          <div className="overview-card">
            <div className="overview-number">{installedApps.length}</div>
            <div className="overview-label">Total Apps</div>
          </div>
          <div className="overview-card">
            <div className="overview-number">
              {installedApps.filter(app => 
                Object.keys(getAppPermissions(app.id)).length > 0
              ).length}
            </div>
            <div className="overview-label">With Permissions</div>
          </div>
          <div className="overview-card">
            <div className="overview-number">{permissionStats.length}</div>
            <div className="overview-label">Permission Types</div>
          </div>
        </div>
      )}

      {/* By App View */}
      {viewMode === 'apps' && !selectedApp && (
        <>
          <div className="section-header-text">APPS</div>
          <div className="about-info">
            {installedApps.map(app => {
              const permissions = getAppPermissions(app.id)
              const grantedCount = Object.keys(permissions).filter(p => permissions[p] === 'granted').length
              const totalCount = Object.keys(permissions).length
              
              return (
                <div 
                  key={app.id} 
                  className="info-item clickable-row"
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="app-info">
                    <span className="info-label">{app.name}</span>
                    <span className="app-permissions-count">
                      {totalCount === 0 ? 'No permissions' : `${grantedCount}/${totalCount} granted`}
                    </span>
                  </div>
                  <span className="chevron">›</span>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* By Permission View */}
      {viewMode === 'permissions' && !selectedApp && (
        <>
          <div className="section-header-text">PERMISSION CATEGORIES</div>
          <div className="permission-categories">
            {permissionStats.map(stat => {
              const meta = permissionMeta[stat.permission] || {
                icon: faShieldAlt,
                color: '#8E8E93',
                description: 'Permission access control'
              }

              return (
                <div key={stat.permission} className="permission-category">
                  <div className="permission-category-header">
                    <div className="permission-icon" style={{ backgroundColor: meta.color }}>
                      <FontAwesomeIcon icon={meta.icon} />
                    </div>
                    <div className="permission-category-info">
                      <div className="permission-category-name">
                        {stat.permission.charAt(0).toUpperCase() + stat.permission.slice(1)}
                      </div>
                      <div className="permission-category-desc">{meta.description}</div>
                    </div>
                  </div>
                  <div className="permission-stats">
                    <div className="stat-item granted">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>{stat.grantedCount} granted</span>
                    </div>
                    {stat.deniedCount > 0 && (
                      <div className="stat-item denied">
                        <FontAwesomeIcon icon={faTimesCircle} />
                        <span>{stat.deniedCount} denied</span>
                      </div>
                    )}
                  </div>
                  <div className="permission-app-list">
                    {installedApps.map(app => {
                      const perms = getAppPermissions(app.id)
                      const status = perms[stat.permission]
                      if (!status) return null

                      return (
                        <div key={app.id} className="permission-app-row">
                          <span className="app-name">{app.name}</span>
                          <div className="permission-control">
                            <span className={`status-badge ${status}`}>
                              {status === 'granted' ? 'Allowed' : 'Denied'}
                            </span>
                            {status === 'granted' && (
                              <button 
                                className="btn-toggle-permission"
                                onClick={() => revokePermission(app.id, stat.permission)}
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* App Details View */}
      {selectedApp && (
        <div className="permission-details">
          <button className="back-button" onClick={() => setSelectedApp(null)}>
            ‹ Back
          </button>
          
          <div className="app-detail-header">
            <h3>{selectedApp.name}</h3>
            <p className="app-category">{selectedApp.category}</p>
          </div>

          {Object.keys(getAppPermissions(selectedApp.id)).length > 0 ? (
            <>
              <div className="section-header-text">REQUESTED PERMISSIONS</div>
              <div className="permission-list-detailed">
                {Object.values(permissionTypes).map(permission => {
                  const permissions = getAppPermissions(selectedApp.id)
                  const status = permissions[permission]
                  
                  if (!status) return null

                  const meta = permissionMeta[permission] || {
                    icon: faShieldAlt,
                    color: '#8E8E93',
                    description: 'Permission access control'
                  }
                  
                  return (
                    <div key={permission} className="permission-detail-item">
                      <div className="permission-item-header">
                        <div className="permission-icon small" style={{ backgroundColor: meta.color }}>
                          <FontAwesomeIcon icon={meta.icon} />
                        </div>
                        <div className="permission-detail-info">
                          <div className="permission-detail-name">
                            {permission.charAt(0).toUpperCase() + permission.slice(1)}
                          </div>
                          <div className="permission-detail-desc">{meta.description}</div>
                        </div>
                      </div>
                      <div className="permission-action">
                        <span className={`status-indicator ${status}`}>
                          <FontAwesomeIcon 
                            icon={status === 'granted' ? faCheckCircle : status === 'denied' ? faTimesCircle : faExclamationCircle} 
                          />
                        </span>
                        {status === 'granted' && (
                          <button 
                            className="btn-revoke-small"
                            onClick={() => revokePermission(selectedApp.id, permission)}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="empty-state">
              <FontAwesomeIcon icon={faShieldAlt} />
              <br />No permissions requested
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// About Section Component
const AboutSection = () => {
  const totalStorage = 512 // MB
  const usedStorage = 178 // MB (simulated)
  const availableStorage = totalStorage - usedStorage
  const storagePercent = (usedStorage / totalStorage) * 100

  return (
    <div className="settings-section">
      <h2>About</h2>
      
      {/* Device Header */}
      <div className="about-header">
        <div className="device-icon">
          <FontAwesomeIcon icon={faMobileAlt} />
        </div>
        <div className="device-title">
          <h3>iPhone 17 Pro Max</h3>
          <p>Mobile OS Prototype</p>
        </div>
      </div>

      {/* Storage Widget */}
      <div className="storage-widget">
        <div className="storage-header">
          <FontAwesomeIcon icon={faHdd} />
          <span>Storage</span>
        </div>
        <div className="storage-bar">
          <div 
            className="storage-used" 
            style={{ width: `${storagePercent}%` }}
          ></div>
        </div>
        <div className="storage-info">
          <span>{usedStorage} MB used of {totalStorage} MB</span>
          <span className="storage-available">{availableStorage} MB available</span>
        </div>
      </div>

      {/* System Information */}
      <div className="about-section-header">SYSTEM INFORMATION</div>
      <div className="about-info">
        <div className="info-item">
          <span className="info-label">OS Version</span>
          <span className="info-value">1.0.0</span>
        </div>
        <div className="info-item">
          <span className="info-label">Build Number</span>
          <span className="info-value">2026.02.03</span>
        </div>
        <div className="info-item">
          <span className="info-label">Model Number</span>
          <span className="info-value">IP17PM-2026</span>
        </div>
        <div className="info-item">
          <span className="info-label">Screen</span>
          <span className="info-value">430 × 932 px</span>
        </div>
      </div>

      {/* Hardware Specifications */}
      <div className="about-section-header">HARDWARE</div>
      <div className="about-info">
        <div className="info-item">
          <div className="info-icon-label">
            <FontAwesomeIcon icon={faMicrochip} />
            <span>Processor</span>
          </div>
          <span className="info-value">A20 Bionic</span>
        </div>
        <div className="info-item">
          <div className="info-icon-label">
            <FontAwesomeIcon icon={faMemory} />
            <span>Memory</span>
          </div>
          <span className="info-value">512 MB</span>
        </div>
        <div className="info-item">
          <div className="info-icon-label">
            <FontAwesomeIcon icon={faHdd} />
            <span>Storage</span>
          </div>
          <span className="info-value">512 MB</span>
        </div>
      </div>

      {/* Project Information */}
      <div className="about-section-header">PROJECT</div>
      <div className="about-info">
        <div className="info-item">
          <span className="info-label">Course</span>
          <span className="info-value">DCIT 301</span>
        </div>
        <div className="info-item">
          <span className="info-label">Group</span>
          <span className="info-value">Group 46</span>
        </div>
        <div className="info-item">
          <span className="info-label">Team</span>
          <span className="info-value">7 Members</span>
        </div>
      </div>

      {/* Team Credits */}
      <div className="about-section-header">DEVELOPMENT TEAM</div>
      <div className="team-credits">
        <div className="team-member">
          <span className="member-name">Calyx</span>
          <span className="member-role">Lead Developer</span>
        </div>
        <div className="team-member">
          <span className="member-name">Mabel</span>
          <span className="member-role">App Lifecycle</span>
        </div>
        <div className="team-member">
          <span className="member-name">Obed</span>
          <span className="member-role">Permission System</span>
        </div>
        <div className="team-member">
          <span className="member-name">Jonas</span>
          <span className="member-role">Connectivity</span>
        </div>
        <div className="team-member">
          <span className="member-name">James</span>
          <span className="member-role">Battery Manager</span>
        </div>
        <div className="team-member">
          <span className="member-name">Asaph</span>
          <span className="member-role">Applications</span>
        </div>
        <div className="team-member">
          <span className="member-name">Herbert</span>
          <span className="member-role">UI/UX Design</span>
        </div>
        <div className="team-member">
          <span className="member-name">Joy</span>
          <span className="member-role">Testing & QA</span>
        </div>
      </div>

      {/* Legal */}
      <div className="about-footer">
        <p className="legal-text">
          This is a prototype mobile operating system created for educational purposes.
        </p>
        <p className="legal-text">
          University of Ghana • Computer Science Department
        </p>
        <p className="legal-text copyright">
          © 2026 Group 46. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Settings
