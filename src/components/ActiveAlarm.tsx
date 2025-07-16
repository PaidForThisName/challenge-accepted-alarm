
import React, { useState, useEffect } from 'react';
import { Alarm } from './AlarmApp';
import { ShakeChallenge } from './ShakeChallenge';
import { PacmanChallenge } from './PacmanChallenge';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ActiveAlarmProps {
  alarm: Alarm;
  onDismiss: () => void;
}

export const ActiveAlarm = ({ alarm, onDismiss }: ActiveAlarmProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Simulate alarm sound/vibration
    const playAlarmSound = () => {
      if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
      
      // Create audio context for alarm sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        setTimeout(() => oscillator.stop(), 1000);
        
        setIsPlaying(true);
      } catch (error) {
        console.log('Audio not supported');
      }
    };

    playAlarmSound();
    const interval = setInterval(playAlarmSound, 3000);

    return () => {
      clearInterval(interval);
      setIsPlaying(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-slate-900/90 border-red-500 backdrop-blur-sm">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <AlertCircle className="w-12 h-12 text-red-400 animate-pulse mr-4" />
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">ALARM!</h1>
                <p className="text-xl text-red-200">{alarm.label}</p>
                <p className="text-lg text-red-300">{alarm.time}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-lg text-white mb-4">
                Complete the challenge to dismiss the alarm:
              </p>
            </div>

            {alarm.challengeType === 'shake' ? (
              <ShakeChallenge 
                targetCount={alarm.shakeCount} 
                onComplete={onDismiss}
              />
            ) : (
              <PacmanChallenge onComplete={onDismiss} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
