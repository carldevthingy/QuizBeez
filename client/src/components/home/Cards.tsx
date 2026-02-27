export function Cards() {
    const hexagonSVG = "/images/hexagon.svg";

    const CardData = [
    {
        title: "Interactive",
        description: "Move your bee to the spot you think is right and watch it buzz!",
        img: "/images/flower.svg",
        imgClass: "left-2 top-0 md:-top-3 md:left-5",
    },
    {
        title: "Learning Fun",
        description: "Fly around, explore, and pick the answers in a playful way!",
        img: "/images/bee1.png",
        imgClass: "top-0 right-5 md:-top-2 md:right-8 rotate-10",
        isRaised: true,
    },
    {
        title: "Engaging",
        description: "Race against the clock and land on the correct spot!",
        img: "/images/asterisk.svg",
        imgClass: "right-2 top-4 md:-right-2",
    }
    ];


    return (
        <section id="about" className="py-32 bg-light-yellow overflow-visible">
            <div className="w-full mx-auto px-4 flex flex-wrap justify-center gap-16 md:gap-12">
                {CardData.map((card, index) => (
                    <div
                        key={index}
                        className={`relative w-50 h-45 md:w-85 md:h-85 group ${card.isRaised ? 'sm:-translate-y-12' : ''}`}
                    >
                        {/* --- HEXAGON CARD BG --- */}
                        <img
                            src={hexagonSVG}
                            alt="Hexagon background"
                            className="w-full h-full object-contain pointer-events-none"
                        />

                        {/* --- TITLE & DESC --- */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <h1 className="m-0 text-xl md:text-4xl font-black text-[#3b5998] font-display w-30 md:w-55 tracking-tighter">
                                {card.title}
                            </h1>
                            <p className="mt-2 text-[10px] md:text-xl font-medium text-gray-500">
                                {card.description}
                            </p>
                        </div>

                        {/* --- ATTACHED IMG --- */}
                        <div className={`absolute z-30 drop-shadow-md transition-transform duration-300 scale-125 group-hover:scale-145 ${card.imgClass}`}>
                            <img
                                src={card.img}
                                alt="Decorative icon"
                                className="w-12 h-12 md:w-25 md:h-25 object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
