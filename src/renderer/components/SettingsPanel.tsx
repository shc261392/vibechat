import React, { useState } from 'react';

interface SettingsPanelProps {
  captureInterval: number;
  onIntervalChange: (interval: number) => void;
  onClose: () => void;
}

export function SettingsPanel({
  captureInterval,
  onIntervalChange,
  onClose,
}: SettingsPanelProps) {
  const [autoCapture, setAutoCapture] = useState(true);
  const [captureQuality, setCaptureQuality] = useState(0.7);
  const [maxMemorySize, setMaxMemorySize] = useState(1000);

  const intervalSeconds = Math.round(captureInterval / 1000);
  const maxInterval = 60; // 60 seconds
  const minInterval = 5;  // 5 seconds

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = parseInt(e.target.value);
    onIntervalChange(seconds * 1000);
  };

  const handleSave = () => {
    // Save settings to database
    console.log({
      autoCapture,
      captureInterval,
      captureQuality,
      maxMemorySize,
    });
    onClose();
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3>⚙️ Settings</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="settings-content">
        {/* Screen Capture Settings */}
        <div className="settings-section">
          <h4>📸 Screen Capture</h4>
          
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={autoCapture}
                onChange={e => setAutoCapture(e.target.checked)}
              />
              Auto-capture screenshots
            </label>
          </div>

          {autoCapture && (
            <div className="setting-item">
              <label>
                Capture every {intervalSeconds} seconds
                <input
                  type="range"
                  min={minInterval}
                  max={maxInterval}
                  value={intervalSeconds}
                  onChange={handleIntervalChange}
                  className="slider"
                />
                <span className="slider-value">{intervalSeconds}s</span>
              </label>
            </div>
          )}

          <div className="setting-item">
            <label>
              Screenshot quality
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={captureQuality}
                onChange={e => setCaptureQuality(parseFloat(e.target.value))}
                className="slider"
              />
              <span className="slider-value">{Math.round(captureQuality * 100)}%</span>
            </label>
          </div>
        </div>

        {/* Memory Settings */}
        <div className="settings-section">
          <h4>🧠 Memory Management</h4>
          
          <div className="setting-item">
            <label>
              Max memory entries
              <input
                type="number"
                min="100"
                max="10000"
                value={maxMemorySize}
                onChange={e => setMaxMemorySize(parseInt(e.target.value))}
              />
            </label>
          </div>

          <button className="secondary-button">🗑️ Clear Old Memories</button>
        </div>

        {/* Privacy Settings */}
        <div className="settings-section">
          <h4>🔒 Privacy & Data</h4>
          
          <div className="privacy-info">
            <p>✅ All data stored locally</p>
            <p>✅ No cloud synchronization</p>
            <p>✅ No personal data collection</p>
            <p>✅ You can edit/delete memories anytime</p>
          </div>

          <button className="secondary-button">📝 Manage Saved Data</button>
        </div>

        {/* About */}
        <div className="settings-section">
          <h4>ℹ️ About</h4>
          <p>VibeChat v0.1.0</p>
          <p>Licensed under GPL-3.0</p>
          <button className="secondary-button">
            📖 View License
          </button>
        </div>
      </div>

      <div className="settings-footer">
        <button className="secondary-button" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-button" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
