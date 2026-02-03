import { SystemProvider } from './system/SystemContext'
import useBootManager from './system/BootManager'
import { useBatteryManager } from './services/BatteryManager'
import LockScreen from './ui/LockScreen/LockScreen'
import HomeScreen from './ui/HomeScreen/HomeScreen'
import { useSystem } from './system/SystemContext'
import './App.css'

/**
 * Main Application Component
 * Initializes the mobile OS and manages screen routing
 */
const MobileOS = () => {
  const { systemState } = useSystem()
  
  // Initialize system services
  useBootManager()
  useBatteryManager()

  if (!systemState.isBooted) {
    return (
      <div className="boot-screen">
        <div className="boot-logo">Mobile OS</div>
        <div className="boot-message">Booting system...</div>
      </div>
    )
  }

  if (systemState.isLocked) {
    return <LockScreen />
  }

  return <HomeScreen />
}

function App() {
  return (
    <SystemProvider>
      <div className="mobile-container">
        <MobileOS />
      </div>
    </SystemProvider>
  )
}

export default App
