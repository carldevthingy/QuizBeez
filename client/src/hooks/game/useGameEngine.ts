import { useEffect, useRef, useCallback } from 'react';
import {
    Canvas, PlayArea,
    BeeSprite,
    FlowerSprite, COLORS,
    type GameMode, type ModalType, type Bee, type Flower, type Entity, type Question
} from '../../config/gameConfig';
import { type SoundName } from './useAudio';

// effect type
type FeedbackEffect = {
    id: number;
    type: 'correct' | 'wrong';
    x: number;
    y: number;
    alpha: number; // For fading out
    life: number;  // duration
};

type GameState = {
    bee: Bee;
    menuFlowers: Flower[];
    keys: { up: boolean; down: boolean; left: boolean; right: boolean };
    currentZone: string | null;
    activeEffects: FeedbackEffect[];
}

export const useGameEngine = (
    gameMode: GameMode,
    activeModal: ModalType,
    currentQuestion: Question | null,
    onZoneEnter: (zone: string | null) => void,
    onMenuSelect: (id: string) => void,
    onToggleOptions: () => void,
    playSfx: (name: SoundName) => void,
    submissionRef: React.RefObject<((zone: string | null) => void) | null>
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);

    const callbacks = useRef({ onZoneEnter, onMenuSelect, onToggleOptions, playSfx });
    useEffect(() => {
        callbacks.current = { onZoneEnter, onMenuSelect, onToggleOptions, playSfx };
    }, [onZoneEnter, onMenuSelect, onToggleOptions, playSfx]);

    const modeRef = useRef(gameMode);
    const modalRef = useRef(activeModal);

    // number of choices for game loop
    const choiceCountRef = useRef(4);

    useEffect(() => { modeRef.current = gameMode; }, [gameMode]);
    useEffect(() => { modalRef.current = activeModal; }, [activeModal]);

    // Update choice count when question changes
    useEffect(() => {
        choiceCountRef.current = currentQuestion ? currentQuestion.choices.length : 4;
    }, [currentQuestion]);

    const gameState = useRef<GameState>({
        bee: {
            pos: { x: 580, y: 150 },
            velocity: { x: 0, y: 0 },
            width: BeeSprite.displaySize,
            height: BeeSprite.displaySize,
            speed: 6,
            direction: 'left',
            isMoving: false,
            frameIndex: 0, rowIndex: 2, tickCount: 0, ticksPerFrame: 10,
        },
        menuFlowers: [
            { id: 'start', label: 'PLAY', pos: { x: 80, y: 450 }, width: 100, height: 135, isHovered: false },
            { id: 'options', label: 'OPTIONS', pos: { x: 250, y: 450 }, width: 100, height: 135, isHovered: false },
            { id: 'exit', label: 'EXIT', pos: { x: 420, y: 450 }, width: 100, height: 135, isHovered: false },
        ],
        keys: { up: false, down: false, left: false, right: false },
        currentZone: null,
        activeEffects: []
    });

    // Image Refs
    const beeImageRef = useRef<HTMLImageElement | null>(null);
    const flowerImageRef = useRef<HTMLImageElement | null>(null);
    const bgImageRef = useRef<HTMLImageElement | null>(null);
    const hiveImageRef = useRef<HTMLImageElement | null>(null);
    const heartImageRef = useRef<HTMLImageElement | null>(null);
    const plusOneImageRef = useRef<HTMLImageElement | null>(null);

    const resetBeePosition = useCallback(() => {
        gameState.current.bee.pos = { x: PlayArea.midX - BeeSprite.displaySize / 2, y: PlayArea.midY - BeeSprite.displaySize / 2 };
        gameState.current.currentZone = null;
        gameState.current.activeEffects = [];
    }, []);

    const getCurrentZone = useCallback(() => {
        return gameState.current.currentZone;
    }, []);

    const triggerFeedback = useCallback((isCorrect: boolean) => {
        const bee = gameState.current.bee;
        gameState.current.activeEffects.push({
            id: Date.now(),
            type: isCorrect ? 'correct' : 'wrong',
            x: bee.pos.x + (bee.width / 4),
            y: bee.pos.y - 20,
            alpha: 1.0,
            life: 60
        });
    }, []);

    // Helper: Calculate Geometry for Zones based on Choice Count
    const getZoneRect = (index: number, count: number) => {
        if (count === 4) {
            const isRight = index % 2 !== 0; // Index 1, 3
            const isBottom = index >= 2;     // Index 2, 3
            const w = PlayArea.width / 2;
            const h = Canvas.height / 2;
            return {
                x: PlayArea.startX + (isRight ? w : 0),
                y: isBottom ? h : 0,
                w: w,
                h: h
            };
        } else {
            const w = PlayArea.width;
            const h = Canvas.height / count; // Split height evenly
            return {
                x: PlayArea.startX,
                y: index * h,
                w: w,
                h: h
            };
        }
    };

    //FOR TOUCH CONTROLS
   const moveBee = useCallback((direction: string) => {
    const k = gameState.current.keys;

    //clear everything
    k.up = k.down = k.left = k.right = false;

    if (direction === 'stop') {
        gameState.current.bee.isMoving = false;
        return;
    }

    if (direction === 'up') k.up = true;
    if (direction === 'down') k.down = true;
    if (direction === 'left') { k.left = true; gameState.current.bee.direction = 'left'; }
    if (direction === 'right') { k.right = true; gameState.current.bee.direction = 'right'; }

    gameState.current.bee.isMoving = true;
    }, []);

    //FOR ACTION BUTTON AND ENTER TO SELECT IN MENU OR SELECT ANSWER
    const pressEnter = useCallback(() => {
        if (modeRef.current === 'menu') {
            const hovered = gameState.current.menuFlowers.find(f => f.isHovered);
            if (hovered) onMenuSelect(hovered.id);
        } else if (modeRef.current === 'quiz') {
            if (submissionRef.current) {
                submissionRef.current(gameState.current.currentZone);
            }
        }
    }, [onMenuSelect, submissionRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const loadImg = (src: string, ref: React.RefObject<HTMLImageElement | null>) => {
            const img = new Image(); img.src = src; img.onload = () => { ref.current = img; };
        };

        loadImg('/game/bee-sprite.png', beeImageRef);
        loadImg('/game/flowers-sprite.png', flowerImageRef);
        loadImg('/game/bg.png', bgImageRef);
        loadImg('/game/hive.png', hiveImageRef);
        loadImg('/game/hurt.png', heartImageRef);
        loadImg('/game/bell.png', plusOneImageRef);

        const handleKey = (e: KeyboardEvent, isPressed: boolean) => {
            if (e.repeat) return;
            if (e.code === 'Enter' && isPressed) {
            pressEnter();
            return;
            }
            if (e.code === 'Escape' && isPressed) {
                callbacks.current.onToggleOptions();
                if (!modalRef.current) {
                    gameState.current.keys = { up: false, down: false, left: false, right: false };
                }
                return;
            }
            if (modalRef.current) return;

            const k = gameState.current.keys;
            switch (e.code) {
                case 'ArrowUp': case 'KeyW': k.up = isPressed; break;
                case 'ArrowDown': case 'KeyS': k.down = isPressed; break;
                case 'ArrowLeft': case 'KeyA': k.left = isPressed; break;
                case 'ArrowRight': case 'KeyD': k.right = isPressed; break;
            }

            if (isPressed && e.code === 'Enter' && modeRef.current === 'menu') {
                const hovered = gameState.current.menuFlowers.find(f => f.isHovered);
                if (hovered) {

                    callbacks.current.onMenuSelect(hovered.id);
                    gameState.current.keys = { up: false, down: false, left: false, right: false };
                }
            }
        };

        const onKeyDown = (e: KeyboardEvent) => handleKey(e, true);
        const onKeyUp = (e: KeyboardEvent) => handleKey(e, false);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        const checkRectCollision = (r1: Bee, r2: Entity): boolean => {
            return (
                r1.pos.x < r2.pos.x + r2.width &&
                r1.pos.x + r1.width > r2.pos.x &&
                r1.pos.y < r2.pos.y + r2.height &&
                r1.pos.y + r1.height > r2.pos.y
            );
        };

        const update = () => {
            if (modalRef.current || modeRef.current === 'gameover') return;

            const { bee, keys, menuFlowers, activeEffects } = gameState.current;
            const currentMode = modeRef.current;
            const choiceCount = choiceCountRef.current;

            bee.isMoving = false;
            if (keys.up) { bee.pos.y -= bee.speed; bee.isMoving = true; }
            if (keys.down) { bee.pos.y += bee.speed; bee.isMoving = true; }
            if (keys.left) { bee.pos.x -= bee.speed; bee.direction = 'left'; bee.isMoving = true; }
            if (keys.right) { bee.pos.x += bee.speed; bee.direction = 'right'; bee.isMoving = true; }

          if (currentMode === 'menu') {
                bee.pos.x = Math.max(0, Math.min(Canvas.width - bee.width, bee.pos.x));
                bee.pos.y = Math.max(0, Math.min(Canvas.height - bee.height, bee.pos.y));

                // HOVER LOGIC
                menuFlowers.forEach(f => {
                    const isNowHovering = checkRectCollision(bee, f);

                    // If wasn't hovered last frame, but is hovered now, play the sound
                    if (!f.isHovered && isNowHovering) {
                        callbacks.current.playSfx('hover');
                    }

                    f.isHovered = isNowHovering;
                });
            } else if (currentMode === 'quiz') {
                bee.pos.x = Math.max(PlayArea.startX, Math.min(Canvas.width - bee.width, bee.pos.x));
                bee.pos.y = Math.max(0, Math.min(Canvas.height - bee.height, bee.pos.y));

                const beeCX = bee.pos.x + bee.width / 2;
                const beeCY = bee.pos.y + bee.height / 2;

                let zone = null;
                const zoneLabels = ['A', 'B', 'C', 'D'];

                if (choiceCount === 4) {
                    if (beeCX < PlayArea.midX && beeCY < PlayArea.midY) zone = 'A';
                    else if (beeCX >= PlayArea.midX && beeCY < PlayArea.midY) zone = 'B';
                    else if (beeCX < PlayArea.midX && beeCY >= PlayArea.midY) zone = 'C';
                    else if (beeCX >= PlayArea.midX && beeCY >= PlayArea.midY) zone = 'D';
                } else {
                    if (beeCX >= PlayArea.startX) {
                        const rowHeight = Canvas.height / choiceCount;
                        const rowIndex = Math.floor(beeCY / rowHeight);
                        if (rowIndex >= 0 && rowIndex < choiceCount) {
                            zone = zoneLabels[rowIndex];
                        }
                    }
                }

                gameState.current.currentZone = zone;
                callbacks.current.onZoneEnter(zone);
            }

            if (bee.isMoving) bee.rowIndex = bee.direction === 'left' ? 2 : 3;
            else bee.rowIndex = bee.direction === 'left' ? 0 : 1;
            bee.tickCount++;
            if (bee.tickCount > bee.ticksPerFrame) {
                bee.tickCount = 0;
                bee.frameIndex = (bee.frameIndex + 1) % BeeSprite.columns;
            }

            for (let i = activeEffects.length - 1; i >= 0; i--) {
                const fx = activeEffects[i];
                fx.life--;
                fx.y -= 1.5;
                fx.alpha = Math.max(0, fx.life / 60);
                if (fx.life <= 0) {
                    activeEffects.splice(i, 1);
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, Canvas.width, Canvas.height);
            const { bee, menuFlowers, activeEffects } = gameState.current;
            const currentMode = modeRef.current;
            const choiceCount = choiceCountRef.current;

            if (currentMode === 'menu') {
                if (bgImageRef.current) ctx.drawImage(bgImageRef.current, 0, 0, Canvas.width, Canvas.height);
                else { ctx.fillStyle = '#fdf6e3'; ctx.fillRect(0, 0, Canvas.width, Canvas.height); }

                if (hiveImageRef.current) {
                    const hiveW = 280; const hiveH = 275;
                    ctx.drawImage(hiveImageRef.current, Canvas.width - hiveW - 50, -5, hiveW, hiveH);
                }

                menuFlowers.forEach(f => {
                    const textColor = f.isHovered ? '#FFD700' : '#1E3A8A';
                    if (flowerImageRef.current) {
                        const sx = f.isHovered ? FlowerSprite.frameWidth : 0;
                        ctx.drawImage(flowerImageRef.current, sx, 0, FlowerSprite.frameWidth, FlowerSprite.frameHeight, f.pos.x, f.pos.y, f.width, f.height);
                    } else {
                        ctx.fillStyle = f.isHovered ? '#FFEB3B' : '#E0E0E0';
                        ctx.beginPath();
                        ctx.arc(f.pos.x + f.width / 2, f.pos.y + f.width / 2, f.width / 2, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.fillStyle = textColor;
                    ctx.font = '900 28px "Courier New", monospace';
                    ctx.textAlign = 'center';
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.strokeText(f.label, f.pos.x + f.width / 2, f.pos.y - 20);
                    ctx.fillText(f.label, f.pos.x + f.width / 2, f.pos.y - 20);
                });

            } else if (currentMode === 'quiz' || currentMode === 'gameover') {
                const labels = ['A', 'B', 'C', 'D'];
                const colorKeys: (keyof typeof COLORS)[] = ['A', 'B', 'C', 'D'];

                for (let i = 0; i < choiceCount; i++) {
                    const rect = getZoneRect(i, choiceCount);
                    const label = labels[i];

                    ctx.fillStyle = COLORS[colorKeys[i]];
                    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

                    ctx.globalAlpha = 0.3;
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 120px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
                    ctx.globalAlpha = 1.0;

                    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.rect(rect.x, rect.y, rect.w, rect.h);
                    ctx.stroke();
                }
            }

            if (beeImageRef.current) {
                const sx = bee.frameIndex * BeeSprite.frameWidth;
                const sy = bee.rowIndex * BeeSprite.frameHeight;
                ctx.drawImage(beeImageRef.current, sx, sy, BeeSprite.frameWidth, BeeSprite.frameHeight, bee.pos.x, bee.pos.y, bee.width, bee.height);
            }

            activeEffects.forEach(fx => {
                ctx.save();
                ctx.globalAlpha = fx.alpha;
                const wrongSize = 50;
                const correctSize= 60;
                const xPos= fx.x-10;
                if (fx.type === 'correct' && plusOneImageRef.current) {
                    ctx.drawImage(plusOneImageRef.current, xPos, fx.y, correctSize, correctSize);
                } else if (fx.type === 'wrong' && heartImageRef.current) {
                    ctx.drawImage(heartImageRef.current, xPos, fx.y, wrongSize, wrongSize);
                }
                ctx.restore();
            });
        };

        const loop = () => { update(); draw(); requestRef.current = requestAnimationFrame(loop); };
        requestRef.current = requestAnimationFrame(loop);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return { canvasRef, resetBeePosition, getCurrentZone, triggerFeedback, moveBee, pressEnter };
};