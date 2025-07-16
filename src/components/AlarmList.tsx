import React from 'react';
import { Alarm } from './AlarmApp';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Smartphone, Gamepad2, Clock } from 'lucide-react';

interface AlarmListProps {
  alarms: Alarm[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AlarmList = ({ alarms, onToggle, onDelete }: AlarmListProps) => {
  if (alarms.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-xl text-slate-400">No alarms set</p>
        <p className="text-slate-500">Create your first challenge alarm!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {alarms.map((alarm) => (
        <Card key={alarm.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-mono text-white">
                    {alarm.time}
                  </div>
                  <div>
                    <div className="text-white font-medium">{alarm.label}</div>
                    <div className="flex items-center text-sm text-slate-300 mt-1">
                      {alarm.challengeType === 'shake' ? (
                        <>
                          <Smartphone className="w-4 h-4 mr-1" />
                          Shake {alarm.shakeCount} times
                        </>
                      ) : (
                        <>
                          <Gamepad2 className="w-4 h-4 mr-1" />
                          Play Pac-Man
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Switch
                  checked={alarm.isEnabled}
                  onCheckedChange={() => onToggle(alarm.id)}
                  className="data-[state=checked]:bg-green-500"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(alarm.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
