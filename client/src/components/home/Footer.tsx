export function Footer() {
    return (
        <>

            <hr className="border-t-4 border-black" />

            <footer className="bg-footer border-t-4 border-black pt-16 pb-8 px-8 font-sans">

                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-12 mb-12">

                    {/* --- NAV --- */}
                    <div className="flex flex-col">
                        <h4 className="font-black uppercase text-xl mb-6 italic underline decoration-dark-yellow decoration-4 underline-offset-4">
                            Navigation
                        </h4>
                        <ul className="space-y-3 font-bold uppercase text-sm tracking-widest text-[10px] md:text-base">
                            <li><a href="#" className="hover:text-dark-yellow transition-colors">Home</a></li>
                            <li><a href="#about" className="hover:text-dark-yellow transition-colors">About</a></li>
                            <li><a href="#faqs" className="hover:text-dark-yellow transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* --- REACH OUT --- */}
                    <div className="flex flex-col">
                        <h4 className="font-black uppercase text-xl mb-6 italic underline decoration-dark-yellow decoration-4 underline-offset-4">
                            Reach Out
                        </h4>
                        <div className="space-y-2 font-bold text-[10px] md:text-base">
                            <p className="flex items-center gap-2">
                                <span className="text-[#FFD700]">📍</span> Philippines
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-[#FFD700]">✉️</span> thequizbeez@gmail.com
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-[#FFD700]">📞</span> +63 912 345 6789
                            </p>
                        </div>
                    </div>

                    {/* --- HOW IT WORKS ---*/}
                    <div className="flex flex-col col-span-2 md:col-span-1">
                        <h4 className="font-black uppercase text-xl mb-6 italic underline decoration-dark-yellow decoration-4 underline-offset-4">
                            How it Works
                        </h4>
                        <div className="bg-primary p-6 border-b-2  rounded-2xl">
                            <p className="font-bold leading-tight text-[10px] md:text-base">
                                Is an online interactive learning platform that makes learning both fun and engaging.
                            </p>
                        </div>
                    </div>

                </div>

                {/* --- COPYRIGHT --- */}
                <div className="max-w-7xl mx-auto border-t-2 border-black/10 pt-8 mt-8 flex flex-row justify-between items-center gap-4">
                    <div className="font-black text-base md:text-xl italic">QuizBeez</div>
                    <div className="font-bold text-[8px] md:text-sm uppercase tracking-tighter opacity-60">
                        © Copyright 2026 QuizBeez. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </>
    );
}