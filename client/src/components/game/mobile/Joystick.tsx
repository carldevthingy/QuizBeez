import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';

interface JoystickProps {
    onMove: (dir: 'up' | 'down' | 'left' | 'right' | 'stop') => void;
}

export const Joystick = ({ onMove }: JoystickProps) => {
    const zoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!zoneRef.current) return;

        const manager = nipplejs.create({
            zone: zoneRef.current,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: '#facc15',
            size: 100,
            threshold: 0.1,
        });

        manager.on('move', (_, data) => {
            if (data.direction) {
                onMove(data.direction.angle);
            }
        });

        manager.on('end', () => onMove('stop'));

        return () => {
            manager.destroy();
            onMove('stop');
        };
    }, [onMove]);

    return (
        <div className="absolute bottom-10 left-10 w-32 h-32 z-50 pointer-events-none touch-none">
            <div ref={zoneRef} className="w-full h-full pointer-events-auto" />
        </div>
    );
};