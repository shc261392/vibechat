import React, { useState, useEffect } from 'react';

interface Personality {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
  traits: string[];
}

interface PersonalitySelectorProps {
  onSelect: (personalityId: string) => void;
}

const DEFAULT_PERSONALITIES: Personality[] = [
  {
    id: 'optimist',
    name: 'Optimist',
    description: 'Always sees the bright side of things',
    avatar: '🌟',
    color: '#FFD700',
    traits: ['positive', 'encouraging', 'enthusiastic'],
  },
  {
    id: 'listener',
    name: 'Listener',
    description: 'Thoughtful and empathetic companion',
    avatar: '👂',
    color: '#87CEEB',
    traits: ['empathetic', 'supportive', 'understanding'],
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Imaginative and playful',
    avatar: '🎨',
    color: '#FF69B4',
    traits: ['creative', 'playful', 'imaginative'],
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Wise and thoughtful advice',
    avatar: '🧙',
    color: '#9370DB',
    traits: ['wise', 'thoughtful', 'analytical'],
  },
];

export function PersonalitySelector({ onSelect }: PersonalitySelectorProps) {
  const [personalities, setPersonalities] = useState<Personality[]>(DEFAULT_PERSONALITIES);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect(id);
  };

  return (
    <div className="personality-selector">
      <div className="selector-header">
        <h2>Choose Your Companion 🌈</h2>
        <p>Select an AI personality to chat with</p>
      </div>

      <div className="personalities-grid">
        {personalities.map(personality => (
          <div
            key={personality.id}
            className={`personality-card ${selectedId === personality.id ? 'selected' : ''}`}
            onClick={() => handleSelect(personality.id)}
            style={{ borderColor: personality.color }}
          >
            <div className="personality-avatar" style={{ fontSize: '3em' }}>
              {personality.avatar}
            </div>
            <h3>{personality.name}</h3>
            <p className="personality-description">{personality.description}</p>
            <div className="personality-traits">
              {personality.traits.map(trait => (
                <span key={trait} className="trait-badge">
                  {trait}
                </span>
              ))}
            </div>
            {selectedId === personality.id && (
              <div className="selection-indicator">✓ Selected</div>
            )}
          </div>
        ))}
      </div>

      <div className="selector-footer">
        <p>💡 Tip: You can switch personalities anytime while chatting</p>
      </div>
    </div>
  );
}
