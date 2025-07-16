
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Smartphone, Gamepad2, Save, X } from 'lucide-react';
import { Alarm } from './AlarmApp';

interface AlarmFormProps {
  onSave: (alarm: Omit<Alarm, 'id' | 'isActive'>) => void;
  onCancel: () => void;
}

export const AlarmForm = ({ onSave, onCancel }: AlarmFormProps) => {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('Wake up!');
  const [challengeType, setChallengeType] = useState<'shake' | 'pacman'>('shake');
  const [shakeCount, setShakeCount] = useState([20]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      time,
      label,
      challengeType,
      shakeCount: shakeCount[0],
      isEnabled: true,
    });
  };

  return (
    <Card className="max-w-md mx-auto bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Alarm</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="time" className="text-white">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="label" className="text-white">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-2"
              placeholder="Wake up!"
              required
            />
          </div>

          <div>
            <Label className="text-white">Challenge Type</Label>
            <RadioGroup
              value={challengeType}
              onValueChange={(value: 'shake' | 'pacman') => setChallengeType(value)}
              className="mt-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors">
                <RadioGroupItem value="shake" id="shake" className="border-slate-400" />
                <Smartphone className="w-5 h-5 text-blue-400" />
                <Label htmlFor="shake" className="text-white flex-1 cursor-pointer">
                  Shake Phone
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors">
                <RadioGroupItem value="pacman" id="pacman" className="border-slate-400" />
                <Gamepad2 className="w-5 h-5 text-yellow-400" />
                <Label htmlFor="pacman" className="text-white flex-1 cursor-pointer">
                  Play Pac-Man
                </Label>
              </div>
            </RadioGroup>
          </div>

          {challengeType === 'shake' && (
            <div>
              <Label className="text-white">
                Shake Count: {shakeCount[0]} times
              </Label>
              <Slider
                value={shakeCount}
                onValueChange={setShakeCount}
                max={50}
                min={5}
                step={5}
                className="mt-3"
              />
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Alarm
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
