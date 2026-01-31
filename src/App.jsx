import React from 'react';
import { SystemProvider, useSystem } from './SystemContext';
import { APPS } from './AppManager';

const HomeScreen = () => {
  const { launchApp, systemStatus } = useSystem();
  return (
    <div style={styles.home}>
      <div style={styles.statusBar}><span>12:52</span><span>🔋 Battery | 📶 WiFi</span></div>
      <div style={styles.content}>
        <h1 style={styles.title}>Mobile OS</h1>
        <p style={styles.subtitle}>Tap an app to launch it</p>
        <div style={styles.appGrid}>
          {APPS.map(app => (
            <div key={app.id} style={styles.appIcon} onClick={() => launchApp(app.id)}>
              <div style={styles.icon}>{app.icon}</div>
              <div style={styles.appName}>{app.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.systemInfo}>
        <div>Running Apps: {systemStatus.runningApps}</div>
        <div>Memory: {systemStatus.usedMemory}MB / {systemStatus.totalMemory}MB</div>
        <div>Free: {systemStatus.freeMemory}MB</div>
      </div>
    </div>
  );
};

const AppScreen = ({ app, onClose }) => {
  return (
    <div style={styles.appScreen}>
      <div style={styles.appHeader}>
        <span style={styles.appTitle}>{app.icon} {app.name}</span>
        <button onClick={onClose} style={styles.closeBtn}>×</button>
      </div>
      <div style={styles.appContent}>
        <h2>{app.name} App</h2>
        <p>State: <strong>{app.state}</strong></p>
        <p>Memory: {app.memory}MB</p>
      </div>
    </div>
  );
};

const AppContainer = () => {
  const { activeApp, runningApps, terminateApp, goHome } = useSystem();
  return (
    <div style={styles.container}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!activeApp ? <HomeScreen /> : <AppScreen app={activeApp} onClose={() => terminateApp(activeApp.id)} />}
      </div>
      <div style={styles.navBar}>
        <button onClick={goHome} style={styles.homeBtn}>HOME</button>
      </div>
      {runningApps.length > 0 && (
        <div style={styles.runningApps}>
          <strong>Processes:</strong>
          {runningApps.map(app => (
            <span key={app.id} style={styles.runningTag}>
              {app.icon} {app.name} ({activeApp?.id === app.id ? 'RUNNING' : 'PAUSED'})
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <SystemProvider>
      <AppContainer />
    </SystemProvider>
  );
};

const styles = {
  container: 
  { 
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1a1a1a', 
    fontFamily: 'Arial, sans-serif', 
    display: 'flex', 
    flexDirection: 'column'
   },
  home: 
  { 
    flex: 1, 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  statusBar: 
  { 
    padding: '10px 20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    color: 'white' 
  },
  content: 
  { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  title: 
  { 
    color: 'white', 
    fontSize: '48px', 
    margin: '0' 
  },
  subtitle: 
  { 
    color: 'rgba(255,255,255,0.8)', 
    marginBottom: '40px' 
  },
  appGrid: 
  { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '30px' 
  },
  appIcon: 
  { 
    textAlign: 'center', 
    cursor: 'pointer' 
  },
  icon: 
  { 
    fontSize: '60px', 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: '20px', padding: '20px' 
  },
  appName: 
  { 
    color: 'white', 
    marginTop: '10px' 
  },
  systemInfo: 
  { 
    padding: '15px', 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    color: 'white', display: 'flex', 
    justifyContent: 'space-around' 
  },
  appScreen: 
  { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  appHeader: 
  { 
    padding: '15px', 
    backgroundColor: '#4a90e2', 
    color: 'white', 
    display: 'flex', 
    justifyContent: 'space-between' 
  },
  appTitle: 
  { 
    fontSize: '18px', 
    fontWeight: 'bold'
  },
  closeBtn: 
  { 
    background: 'transparent', 
    border: 'none', 
    color: 'white', 
    fontSize: '30px', 
    cursor: 'pointer' 
  },
  appContent: 
  { 
    padding: '40px', 
    textAlign: 'center' 
  },
  navBar: 
  { 
    height: '60px', 
    backgroundColor: 'black', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  homeBtn: 
  { 
    width: '50px', 
    height: '50px', 
    borderRadius: '50%', 
    backgroundColor: 'white', 
    border: 'none', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
  },
  runningApps:
  { padding: '10px', 
    backgroundColor: '#2d2d2d', 
    color: 'white', 
    display: 'flex', 
    gap: '10px' },
  runningTag: 
  { 
    backgroundColor: '#4a90e2', 
    padding: '5px 10px', 
    borderRadius: '5px', 
    fontSize: '12px' 
  }
};

export default App;