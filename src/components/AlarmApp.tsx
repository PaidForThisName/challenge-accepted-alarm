
import React, { useState, useEffect } from 'react';
import { AlarmList } from './AlarmList';
import { AlarmForm } from './AlarmForm';
import { ActiveAlarm } from './ActiveAlarm';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  challengeType: 'shake' | 'pacman';
  shakeCount: number;
  isActive: boolean;
  isEnabled: boolean;
}

export const AlarmApp = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const triggeredAlarm = alarms.find(alarm => 
        alarm.isEnabled && 
        !alarm.isActive && 
        alarm.time === currentTimeString
      );

      if (triggeredAlarm) {
        setActiveAlarm(triggeredAlarm);
        setAlarms(prev => prev.map(alarm => 
          alarm.id === triggeredAlarm.id 
            ? { ...alarm, isActive: true }
            : alarm
        ));
      }
    };

    checkAlarms();
  }, [currentTime, alarms]);

  const addAlarm = (alarmData: Omit<Alarm, 'id' | 'isActive'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Date.now().toString(),
      isActive: false,
    };
    setAlarms(prev => [...prev, newAlarm]);
    setShowForm(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const dismissAlarm = () => {
    if (activeAlarm) {
      setAlarms(prev => prev.map(alarm => 
        alarm.id === activeAlarm.id 
          ? { ...alarm, isActive: false }
          : alarm
      ));
      setActiveAlarm(null);
    }
  };

  if (activeAlarm) {
    return <ActiveAlarm alarm={activeAlarm} onDismiss={dismissAlarm} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Challenge Alarm</h1>
          </div>
          <p className="text-lg text-blue-200">Wake up with a challenge!</p>
          <div className="text-6xl font-mono text-cyan-400 mt-4">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {showForm ? (
          <AlarmForm onSave={addAlarm} onCancel={() => setShowForm(false)} />
        ) : (
          <>
            <div className="text-center mb-8">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Alarm
              </Button>
            </div>

            <AlarmList
              alarms={alarms}
              onToggle={toggleAlarm}
              onDelete={deleteAlarm}
            />
          </>
        )}
      </div>
    </div>
  );
};
