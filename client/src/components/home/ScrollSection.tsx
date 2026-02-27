import { useEffect, useRef, useState } from 'react';

export function ScrollSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [percentage, setPercentage] = useState(0);

    const stepImages = [
        "/images/house.svg",
        "/images/question.svg",
        "/images/bees.svg",
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const stickyOffset = 200; // pixels, same as top-50
            const totalHeight = (rect.height + stickyOffset) - windowHeight;
            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
            setPercentage(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // FLAPPING FREQUENCY
    // every 5% of scroll
    const isWingUp = Math.floor(percentage / 0.05) % 2 === 0;


    // To account for when in mobile view
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const config = isMobile
        ? {
            start: { x: -25, y: -110, rotate: -15 },
            end: { x: 45, y: 100, rotate: 0 }
        }
        : {
            start: { x: -75, y: -110, rotate: -15 },
            end: { x: 135, y: 50, rotate: 0 }
        };

    const baseX = config.start.x + (config.end.x - config.start.x) * percentage;
    const baseY = config.start.y + (config.end.y - config.start.y) * percentage;
    const baseRotation = config.start.rotate + (config.end.rotate - config.start.rotate) * percentage;

    // Bee wobble
    const xWobble = Math.sin(percentage * Math.PI * 6) * 30;
    const rotWobble = Math.cos(percentage * Math.PI * 6) * 15;

    const finalX = baseX + xWobble;
    const finalY = baseY;
    const finalRotation = baseRotation + rotWobble;


    const standardTextClass = "text-[12px] tracking-widest md:tracking-[0.3rem] sm:text-2xl lg:text-4xl font-normal text-[#8a9aa8] font-body ";

    const blueKeywordClass = "font-title tracking-tighter text-[#354eab] text-xl sm:text-4xl lg:text-6xl font-black";

    return (
        <section ref={containerRef} className=" relative bg-light-yellow min-h-290 md:min-h-575">
            <div className="flex flex-row max-w-360 mx-auto px-4 md:px-8 min-h-290  md:min-h-575 py-20 md:py-50">

                <div className="w-1/2 space-y-80 md:space-y-180 z-10">
                    <div className="p-4 md:p-8">
                        <h2 className="text-sm md:text-4xl font-normal  uppercase mb-4 opacity-50">01.</h2>
                        <div className={standardTextClass}>
                            <p className="items-baseline">
                                PLAY AS A <span className={blueKeywordClass}>
                                    Bee
                                </span>
                            </p>
                            <p> WHILE ANSWERING QUIZZES </p>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        <h2 className="text-sm md:text-4xl font-normal uppercase mb-4 opacity-50">02.</h2>
                        <div className={standardTextClass}>
                            <p className="items-baseline whitespace-nowrap">
                                <span className={blueKeywordClass}>Fly</span> TO THE AREA
                            </p>
                            <p>WITH THE CORRECT ANSWER</p>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        <h2 className="text-sm md:text-4xl font-normal uppercase mb-4 opacity-50">03.</h2>
                        <div className={standardTextClass}>
                            <p className="items-baseline whitespace-nowrap">
                                PLAY WITH <span className={blueKeywordClass}>Friends</span>
                            </p>
                            <p>MAKE ANSWERING MORE FUN</p>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 relative ml-4">
                    <div className="absolute inset-0 flex flex-col items-center justify-between">
                        {stepImages.map((src, index) => (
                            <div key={index} className="h-48 md:h-64 flex items-center justify-center">
                                <img
                                    src={src}
                                    alt={`Step ${index}`}
                                    className="w-sm h-sm md:w-lg md:h-lg   object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="sticky top-50 h-100 flex items-center justify-center pointer-events-none">
                        <div
                            style={{
                                transform: `translate(${finalX}px, ${finalY}px) rotate(${finalRotation}deg)`,
                                transition: 'transform 0.1s linear'
                            }}
                        >
                            <div className="w-12 sm:w-20 md:w-32 pointer-events-auto">
                                <img
                                    src={isWingUp
                                        ? "/images/bee1.png"
                                        : "/images/bee2.png"
                                    }
                                    alt="Bee"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}