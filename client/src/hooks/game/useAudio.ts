import { useRef, useCallback, useState, useEffect } from 'react';

export type SoundName = 'bgm' | 'hover' | 'click' | 'correct' | 'wrong' | 'win';

export const useAudio = () => {
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

    const [musicEnabled, setMusicEnabled] = useState(true);
    const [sfxEnabled, setSfxEnabled] = useState(true);

    // Initialize audio objects
    const loadAudio = useCallback(async () => {
        const sounds: Record<string, string> = {
            bgm: '/sounds/bg-music.mp3',
            hover: '/sounds/hover.wav',
            correct: '/sounds/correct.wav',
            wrong: '/sounds/wrong.wav',
            win: '/sounds/win.wav'
        };

        const promises = Object.entries(sounds).map(([key, src]) => {
            return new Promise<void>((resolve) => {
                const audio = new Audio(src);
                audio.oncanplaythrough = () => resolve();
                audio.onerror = () => {
                    console.warn(`Failed to load sound: ${src}`);
                    resolve();
                };
                if(key === 'bgm') {
                    audio.loop = true;
                    audio.volume = 0.18;
                }
                audioRefs.current[key] = audio;
            });
        });

        await Promise.all(promises);
    }, []);

    // toggle music
    useEffect(() => {
        const bgm = audioRefs.current['bgm'];
        if (bgm) {
            if (musicEnabled) {
                 bgm.play().catch(() => {});
            } else {
                bgm.pause();
            }
        }
    }, [musicEnabled]);

    const playSfx = useCallback((name: SoundName) => {
        if (!sfxEnabled) return;
        const audio = audioRefs.current[name];
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.3;
            audio.play().catch(e => console.warn("SFX play prevented", e));
        }
    }, [sfxEnabled]);

    const playBgm = useCallback(() => {
        if (!musicEnabled) return;

        const bgm = audioRefs.current['bgm'];
        if (bgm && bgm.paused) {
            bgm.play().catch(e => console.warn("BGM play prevented", e));
        }
    }, [musicEnabled]);

    const stopBgm = useCallback(() => {
        const bgm = audioRefs.current['bgm'];
        if (bgm) {
            bgm.pause();
            bgm.currentTime = 0;
        }
    }, []);

    return {
        loadAudio,
        playSfx,
        playBgm,
        stopBgm,
        musicEnabled,
        setMusicEnabled,
        sfxEnabled,
        setSfxEnabled
    };
};