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
  faInfoCircle
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
const ConnectivitySection = ({ wifi, cellular, airplaneMode, toggleWifi, toggleCellular, toggleAirplaneMode }) => (
  <div className="settings-section">
    <h2>Connectivity</h2>
    
    <div className="setting-group">
      <div className="setting-row">
        <div className="setting-label">
          <FontAwesomeIcon icon={faPlane} />
          <span>Airplane Mode</span>
        </div>
        <label className="toggle-switch">
          <input type="checkbox" checked={airplaneMode} onChange={toggleAirplaneMode} />
          <span className="toggle-slider"></span>
        </label>
      </div>
      <p className="setting-description">Disables all wireless connections</p>
    </div>

    <div className="setting-group">
      <div className="setting-row">
        <div className="setting-label">
          <FontAwesomeIcon icon={faWifi} />
          <span>WiFi</span>
        </div>
        <label className="toggle-switch">
          <input type="checkbox" checked={wifi} onChange={toggleWifi} disabled={airplaneMode} />
          <span className="toggle-slider"></span>
        </label>
      </div>
      <p className="setting-description">
        {airplaneMode ? 'Disabled in Airplane Mode' : wifi ? 'Connected' : 'Disconnected'}
      </p>
    </div>

    <div className="setting-group">
      <div className="setting-row">
        <div className="setting-label">
          <FontAwesomeIcon icon={faSignal} />
          <span>Cellular Data</span>
        </div>
        <label className="toggle-switch">
          <input type="checkbox" checked={cellular} onChange={toggleCellular} disabled={airplaneMode} />
          <span className="toggle-slider"></span>
        </label>
      </div>
      <p className="setting-description">
        {airplaneMode ? 'Disabled in Airplane Mode' : cellular ? 'Connected' : 'Disconnected'}
      </p>
    </div>
  </div>
)

// Battery Section Component
const BatterySection = ({ batteryLevel, isCharging, powerSaveMode }) => (
  <div className="settings-section">
    <h2>Battery</h2>
    
    <div className="battery-display">
      <div className="battery-level-bar">
        <div 
          className="battery-level-fill" 
          style={{ 
            width: `${batteryLevel}%`,
            background: batteryLevel <= 20 ? '#FF3B30' : batteryLevel <= 50 ? '#FF9500' : '#34C759'
          }}
        ></div>
      </div>
      <div className="battery-info">
        <h3>{Math.round(batteryLevel)}%</h3>
        <p>{isCharging ? 'Charging' : 'Not Charging'}</p>
      </div>
    </div>

    <div className="setting-group">
      <div className="setting-row">
        <div className="setting-label">
          <span>Power Save Mode</span>
        </div>
        <span className={`status-badge ${powerSaveMode ? 'active' : ''}`}>
          {powerSaveMode ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      <p className="setting-description">
        {powerSaveMode ? 'Automatically enabled at 20%' : 'Reduces power consumption when battery is low'}
      </p>
    </div>

    <div className="battery-stats">
      <div className="stat-item">
        <span className="stat-label">Status</span>
        <span className="stat-value">{isCharging ? 'Charging' : 'On Battery'}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Health</span>
        <span className="stat-value">Good</span>
      </div>
    </div>
  </div>
)

// Apps Section Component
const AppsSection = ({ runningApps, installedApps, memoryUsage, maxMemory, terminateApp }) => (
  <div className="settings-section">
    <h2>Apps & Memory</h2>
    
    <div className="memory-display">
      <div className="memory-header">
        <span>Memory Usage</span>
        <span>{memoryUsage}MB / {maxMemory}MB</span>
      </div>
      <div className="memory-bar">
        <div 
          className="memory-fill" 
          style={{ 
            width: `${(memoryUsage / maxMemory) * 100}%`,
            background: (memoryUsage / maxMemory) > 0.8 ? '#FF3B30' : '#007AFF'
          }}
        ></div>
      </div>
    </div>

    <h3>Running Apps ({runningApps.length})</h3>
    <div className="app-list">
      {runningApps.length === 0 ? (
        <p className="empty-state">No apps running</p>
      ) : (
        runningApps.map(app => (
          <div key={app.id} className="app-item">
            <div className="app-info">
              <span className="app-name">{app.name}</span>
              <span className="app-memory">{app.memoryUsage}MB</span>
            </div>
            <button 
              className="btn-stop" 
              onClick={() => terminateApp(app.id)}
            >
              Stop
            </button>
          </div>
        ))
      )}
    </div>

    <h3>Installed Apps ({installedApps.length})</h3>
    <div className="app-list">
      {installedApps.map(app => (
        <div key={app.id} className="app-item">
          <div className="app-info">
            <span className="app-name">{app.name}</span>
            <span className="app-category">{app.category}</span>
          </div>
          <span className="app-size">{app.memoryUsage}MB</span>
        </div>
      ))}
    </div>
  </div>
)

// Permissions Section Component
const PermissionsSection = ({ installedApps, getAppPermissions, revokePermission, permissionTypes }) => {
  const [selectedApp, setSelectedApp] = useState(null)

  return (
    <div className="settings-section">
      <h2>App Permissions</h2>
      
      {!selectedApp ? (
        <div className="app-list">
          {installedApps.map(app => {
            const permissions = getAppPermissions(app.id)
            const permissionCount = Object.keys(permissions).filter(p => permissions[p] === 'granted').length
            
            return (
              <div 
                key={app.id} 
                className="app-item clickable"
                onClick={() => setSelectedApp(app)}
              >
                <div className="app-info">
                  <span className="app-name">{app.name}</span>
                  <span className="app-permissions">{permissionCount} permissions</span>
                </div>
                <span className="chevron">›</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="permission-details">
          <button className="back-button" onClick={() => setSelectedApp(null)}>
            ‹ Back
          </button>
          <h3>{selectedApp.name}</h3>
          
          <div className="permission-list">
            {Object.values(permissionTypes).map(permission => {
              const permissions = getAppPermissions(selectedApp.id)
              const status = permissions[permission] || 'not requested'
              
              if (status === 'not requested') return null
              
              return (
                <div key={permission} className="permission-item">
                  <div className="permission-info">
                    <span className="permission-name">{permission.toUpperCase()}</span>
                    <span className={`permission-status ${status}`}>{status}</span>
                  </div>
                  {status === 'granted' && (
                    <button 
                      className="btn-revoke"
                      onClick={() => revokePermission(selectedApp.id, permission)}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          
          {Object.keys(getAppPermissions(selectedApp.id)).length === 0 && (
            <p className="empty-state">No permissions requested</p>
          )}
        </div>
      )}
    </div>
  )
}

// About Section Component
const AboutSection = () => (
  <div className="settings-section">
    <h2>About</h2>
    
    <div className="about-info">
      <div className="info-item">
        <span className="info-label">Device Name</span>
        <span className="info-value">Mobile OS Prototype</span>
      </div>
      <div className="info-item">
        <span className="info-label">OS Version</span>
        <span className="info-value">1.0.0</span>
      </div>
      <div className="info-item">
        <span className="info-label">Model</span>
        <span className="info-value">iPhone 17 Pro Max</span>
      </div>
      <div className="info-item">
        <span className="info-label">Screen Size</span>
        <span className="info-value">430 × 932 px</span>
      </div>
      <div className="info-item">
        <span className="info-label">Project</span>
        <span className="info-value">DCIT 301 - Group 46</span>
      </div>
      <div className="info-item">
        <span className="info-label">Build Date</span>
        <span className="info-value">{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  </div>
)

export default Settings
