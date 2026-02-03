import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCog, 
  faCalculator, 
  faStickyNote, 
  faFolder,
  faCircle
} from '@fortawesome/free-solid-svg-icons'
import { useSystem } from '../../system/SystemContext'
import StatusBar from '../StatusBar/StatusBar'
import Calculator from '../../apps/Calculator/Calculator'
import Settings from '../../apps/Settings/Settings'
import Notes from '../../apps/Notes/Notes'
import FileManager from '../../apps/FileManager/FileManager'
import './HomeScreen.css'

/**
 * HomeScreen - Main app launcher interface
 * Memory efficient: Reads app list from system context
 * Security: Only displays installed apps
 * Double-tap anywhere to lock screen
 */
const HomeScreen = () => {
  const { systemState, launchApp, lockScreen } = useSystem()
  const [currentPage, setCurrentPage] = useState(0)
  const lastTapRef = useRef(0)

  const renderApp = (appId) => {
    switch (appId) {
      case 'settings':
        return <Settings key={appId} />
      case 'calculator':
        return <Calculator key={appId} />
      case 'notes':
        return <Notes key={appId} />
      case 'files':
        return <FileManager key={appId} />
      default:
        return null
    }
  }

  const getIconComponent = (app) => {
    const iconMap = {
      'cog': faCog,
      'calculator': faCalculator,
      'sticky-note': faStickyNote,
      'folder': faFolder
    }

    const icon = iconMap[app.icon] || faCog
    return <FontAwesomeIcon icon={icon} />
  }

  const getAppColor = (appName) => {
    const colors = {
      'Settings': '#8E8E93',
      'Calculator': '#FF9500',
      'Notes': '#FFCC00',
      'File Manager': '#007AFF'
    }
    return colors[appName] || '#007AFF'
  }

  const handleAppClick = (appId) => {
    launchApp(appId)
  }

  // Double-tap to lock screen
  const handleDoubleTap = (e) => {
    // Prevent if clicking on an app icon
    if (e.target.closest('.app-icon-container') || e.target.closest('.dock-app')) {
      return
    }

    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      lockScreen()
    }

    lastTapRef.current = now
  }

  // Get running app count for badge
  const runningCount = systemState.runningApps.length

  return (
    <div className="home-screen" onClick={handleDoubleTap}>
      <StatusBar />
      
      <div className="home-content">
        {/* Time Widget */}
        <div className="home-time-widget">
          <div className="home-time">
            {new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: false
            })}
          </div>
          <div className="home-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* App Grid */}
        <div className="app-grid">
          {systemState.installedApps.map(app => {
            const isRunning = systemState.runningApps.some(r => r.id === app.id)
            return (
              <div
                key={app.id}
                className="app-icon-container"
                onClick={() => handleAppClick(app.id)}
              >
                <div 
                  className="app-icon"
                  style={{ backgroundColor: getAppColor(app.name) }}
                >
                  {getIconComponent(app)}
                  {isRunning && <div className="app-running-indicator"></div>}
                </div>
                <div className="app-name">{app.name}</div>
              </div>
            )
          })}
        </div>

        {/* Page Indicators */}
        <div className="page-indicators">
          <FontAwesomeIcon icon={faCircle} className="page-dot active" />
        </div>
      </div>

      {/* Dock */}
      <div className="home-dock">
        <div className="dock-container">
          <div className="dock-apps">
            {/* Most used apps in dock */}
            {systemState.installedApps.slice(0, 3).map(app => (
              <div
                key={`dock-${app.id}`}
                className="dock-app"
                onClick={() => handleAppClick(app.id)}
              >
                <div 
                  className="dock-icon"
                  style={{ backgroundColor: getAppColor(app.name) }}
                >
                  {getIconComponent(app)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="home-indicator"></div>

      {/* Render running apps */}
      {systemState.runningApps.map(app => renderApp(app.id))}
    </div>
  )
}

export default HomeScreen
