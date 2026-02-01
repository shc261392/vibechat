import React, { useState, useEffect } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { PersonalitySelector } from './components/PersonalitySelector';
import { SettingsPanel } from './components/SettingsPanel';
import './App.css';

interface AppState {
  currentPersonality: string | null;
  isSettingsOpen: boolean;
  captureInterval: number;
  isConnected: boolean;
}

function App() {
  const [state, setState] = useState<AppState>({
    currentPersonality: null,
    isSettingsOpen: false,
    captureInterval: 15000,
    isConnected: false,
  });

  useEffect(() => {
    // Check connection to Electron IPC and backend services
    checkConnection();
    
    // Set up periodic status check
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      // This would communicate with the Electron main process
      setState(prev => ({ ...prev, isConnected: true }));
    } catch (error) {
      setState(prev => ({ ...prev, isConnected: false }));
    }
  };

  const handlePersonalitySelect = (personalityId: string) => {
    setState(prev => ({ ...prev, currentPersonality: personalityId }));
  };

  const handleSettingsToggle = () => {
    setState(prev => ({ ...prev, isSettingsOpen: !prev.isSettingsOpen }));
  };

  const handleCaptureIntervalChange = (interval: number) => {
    setState(prev => ({ ...prev, captureInterval: interval }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌈 VibeChat</h1>
        <div className="header-status">
          {state.isConnected ? (
            <span className="status-indicator connected">● Connected</span>
          ) : (
            <span className="status-indicator disconnected">● Offline</span>
          )}
        </div>
      </header>

      <main className="app-main">
        {state.currentPersonality ? (
          <>
            <ChatWindow personalityId={state.currentPersonality} />
            <aside className="app-sidebar">
              <button 
                className="settings-button"
                onClick={handleSettingsToggle}
              >
                ⚙️ Settings
              </button>
              {state.isSettingsOpen && (
                <SettingsPanel
                  captureInterval={state.captureInterval}
                  onIntervalChange={handleCaptureIntervalChange}
                  onClose={handleSettingsToggle}
                />
              )}
            </aside>
          </>
        ) : (
          <PersonalitySelector onSelect={handlePersonalitySelect} />
        )}
      </main>

      <footer className="app-footer">
        <p>Made with ❤️• Running 100% locally • Your privacy matters</p>
      </footer>
    </div>
  );
}

export default App;
