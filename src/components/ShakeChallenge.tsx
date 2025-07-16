
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Smartphone, CheckCircle } from 'lucide-react';

interface ShakeChallengeProps {
  targetCount: number;
  onComplete: () => void;
}

export const ShakeChallenge = ({ targetCount, onComplete }: ShakeChallengeProps) => {
  const [shakeCount, setShakeCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [lastShake, setLastShake] = useState(0);

  useEffect(() => {
    let shakeThreshold = 15;
    let lastX = 0, lastY = 0, lastZ = 0;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const { x = 0, y = 0, z = 0 } = acceleration;
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      const shakeDetected = deltaX + deltaY + deltaZ > shakeThreshold;
      const now = Date.now();

      if (shakeDetected && now - lastShake > 500) {
        setIsShaking(true);
        setShakeCount(prev => {
          const newCount = prev + 1;
          if (newCount >= targetCount) {
            setTimeout(onComplete, 1000);
          }
          return newCount;
        });
        setLastShake(now);

        setTimeout(() => setIsShaking(false), 300);
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    const requestPermission = async () => {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('devicemotion', handleDeviceMotion);
        }
      } else {
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [targetCount, onComplete, lastShake]);

  const progress = (shakeCount / targetCount) * 100;
  const isComplete = shakeCount >= targetCount;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 transition-all duration-300 ${
          isShaking 
            ? 'border-green-400 bg-green-400/20 scale-110' 
            : 'border-blue-400 bg-blue-400/20'
        }`}>
          <Smartphone className={`w-12 h-12 transition-all duration-300 ${
            isShaking ? 'text-green-400 animate-bounce' : 'text-blue-400'
          }`} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {shakeCount} / {targetCount}
          </p>
          <p className="text-slate-300">
            {isComplete ? 'Challenge Complete!' : 'Shake your device!'}
          </p>
        </div>

        <Progress 
          value={progress} 
          className="h-4 bg-slate-700" 
        />

        {isComplete && (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto animate-pulse" />
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-full"
            >
              Dismiss Alarm
            </Button>
          </div>
        )}
      </div>

      {!isComplete && (
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Can't shake? Tap the button below 20 times as alternative
          </p>
          <Button
            onClick={() => setShakeCount(prev => Math.min(prev + 1, targetCount))}
            variant="outline"
            className="mt-2 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Manual Shake ({shakeCount})
          </Button>
        </div>
      )}
    </div>
  );
};
