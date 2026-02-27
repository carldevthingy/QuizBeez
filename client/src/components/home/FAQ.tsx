import { useState } from 'react';

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqData = [
    {
        question: "How do I start playing?",
        answer: "Simply click the 'Play Now' button at the top of the page! No registration is required to start your first hive quiz."
    },
    {
        question: "Is it free for everyone?",
        answer: "Yes! Our platform is free to use. We believe knowledge should be as accessible as flowers in spring."
    },
    {
        question: "Can I create my own quizzes?",
        answer: "Absolutely. Once you create a free account, you can build custom sets to share with your friends or students."
    },
    {
        question: "Can I play with my friends?",
        answer: "Unfortunately, not yet. Multiplayer features are currently a work in progress, but we're actively working on it so you can play with your friends soon."
    },
    {
        question: "Can I play on my phone?",
        answer: "Not yet. Mobile play is not implemented at the moment, but we’re working on it!"
    }
    ];

    return (
        <>

         {/* --- HONEY DRIP Y FLIPPED ---  */}
            <div id="faqs" className="relative w-full bg-primary ">
                <img
                    src="/images/honey-drip.svg"
                    alt="Honey Drip"
                    className="w-full h-auto block bg-light-yellow scale-y-[-1] scale-x-[-1]"
                />
            </div>


            <div className="relative w-full bg-primary -mt-1">


                {/* --- FAQ SECTION --- */}
                <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">

                    {/* --- FAQ IMAGE --- */}
                    <div className="flex justify-center mb-5">
                        <img
                            src="/images/faqs.svg"
                            alt="FAQ Illustration"
                            className="w-100 h-70 md:w-200 md:h-100 object-contain"
                        />
                    </div>

                    {/* --- QUESTIONS --- */}
                    <div className="relative group overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl mb-20">
                        <div
                            className="absolute inset-0 z-0 bg-center bg-auto bg-no-repeat bg-white"
                        />

                        <div className="relative z-10 p-8 md:p-12">
                            <div className="space-y-6">
                                {faqData.map((item, index) => (
                                    <div key={index} className="border-b-2 border-black/20 pb-6 last:border-0">
                                        <button
                                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                            className="w-full flex justify-between items-center text-left font-black text-sm md:text-xl uppercase tracking-tight cursor-pointer opacity-80 hover:opacity-100 hover:text-dark-yellow transition-opacity"
                                        >
                                            <span>{item.question}</span>
                                            <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-45' : 'rotate-0'}`}>
                                                <span className="text-2xl md:text-3xl">+</span>
                                            </div>
                                        </button>

                                        {openIndex === index && (
                                            <div className="mt-4 text-sm md:text-base text-gray-800 font-bold leading-relaxed animate-in fade-in slide-in-from-top-4 duration-300">
                                                {item.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}