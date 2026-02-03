import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCog, 
  faCalculator, 
  faStickyNote, 
  faFolder 
} from '@fortawesome/free-solid-svg-icons'
import { useSystem } from '../../system/SystemContext'
import StatusBar from '../StatusBar/StatusBar'
import Calculator from '../../apps/Calculator/Calculator'
import './HomeScreen.css'

/**
 * HomeScreen - Main app launcher interface
 * Memory efficient: Reads app list from system context
 * Security: Only displays installed apps
 */
const HomeScreen = () => {
  const { systemState, launchApp, lockScreen } = useSystem()

  const renderApp = (appId) => {
    switch (appId) {
      case 'calculator':
        return <Calculator key={appId} />
      // Will add more apps here
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

  const handleAppClick = (appId) => {
    launchApp(appId)
  }

  return (
    <div className="home-screen">
      <StatusBar />
      
      <div className="home-content">
        <div className="app-grid">
          {systemState.installedApps.map(app => (
            <div
              key={app.id}
              className="app-icon-container"
              onClick={() => handleAppClick(app.id)}
            >
              <div className="app-icon">
                {getIconComponent(app)}
              </div>
              <div className="app-name">{app.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="home-footer">
        <button className="lock-button" onClick={lockScreen}>
          Lock Device
        </button>
      </div>

      {/* Render running apps */}
      {systemState.runningApps.map(app => renderApp(app.id))}
    </div>
  )
}

export default HomeScreen
