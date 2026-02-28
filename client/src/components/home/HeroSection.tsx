import { useState } from "react";
import { Link } from "react-router-dom";

export function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="min-h-3/4 bg-primary flex flex-col overflow-x-hidden">

        {/* --- NAV BAR --- */}
        <nav className="sticky top-0 pt-6 px-4 z-50">
          <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto bg-white px-4 md:px-6 py-3 rounded-full shadow-xl flex items-center justify-between border-2 border-black relative">
            <a href="#" className="font-black text-lg md:text-xl">
              QuizBeez
            </a>

            <div className="hidden lg:text-md md:flex gap-8 font-bold uppercase text-sm tracking-wide">
              <a href="#" className="hover:text-dark-yellow transition-opacity">
                Home
              </a>
              <a
                href="#about"
                className="hover:text-dark-yellow transition-opacity"
              >
                About
              </a>
              <a
                href="#faqs"
                className="hover:text-dark-yellow transition-opacity"
              >
                FAQS
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link className="hidden md:block bg-black text-white px-4 md:px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shrink-0 hover:text-primary" to={"/game"}>
                PLAY NOW
              </Link>

              <button
                className="md:hidden text-black focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <img
                  src={
                    isMenuOpen
                      ? "/icons/menu-close.svg"
                      : "/icons/menu-burger.svg"
                  }
                  alt={isMenuOpen ? "Close menu" : "Open menu"}
                  width={20}
                  height={20}
                />
              </button>
            </div>

            {/* --- NAV BAR MOBILE --- */}
            {isMenuOpen && (
              <div className="absolute top-16 left-0 w-full bg-white border-2 border-black rounded-2xl p-6 flex flex-col gap-4 shadow-2xl md:hidden">
                <a
                  href="#"
                  className="font-bold uppercase tracking-widest border-b pb-2"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="font-bold uppercase tracking-widest border-b pb-2"
                >
                  About
                </a>
                <a
                  href="#faqs"
                  className="font-bold uppercase tracking-widest border-b pb-2"
                >
                  FAQS
                </a>

                <Link className="bg-black text-center text-white w-full py-3 rounded-full font-bold text-sm tracking-widest hover:scale-105 transition-transform hover:text-primary mt-2"
                to={"/game"}>
                  PLAY NOW
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* --- HERO CONTENT --- */}
        <section className="h-3/4 flex items-center justify-center px-6 md:px-12 lg:px-16 max-w-screen-2xl mx-auto py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">

            {/* --- IMAGES --- */}
            <div className="flex justify-center items-center order-1 lg:order-2 w-full">
              <div className="relative w-full max-w-70 sm:max-w-87.5 md:max-w-112.5 lg:max-w-full">
                <img
                  src="images/hive.svg"
                  alt="Bee Illustration"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* --- TEXT --- */}
            <div className="flex flex-col justify-center text-center lg:items-start items-center lg:text-left order-2 lg:order-1 max-w-2xl mx-auto lg:mx-0">
              <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-dark-yellow leading-wider mb-8 uppercase tracking-tighter font-title">
                To bee or <br className="hidden lg:block" /> not to bee
              </h1>

              <div className="text-xl sm:text-2xl md:text-3xl lg:text-3xl text-dark-yellow/80 leading-snug lg:leading-[1.3] max-w-[28ch] font-body ">
                <p className="inline lg:inline">
                  is the question. Bee the very best in knowledge with our
                  engaging quiz platform.
                </p>

                <Link className="block lg:inline-block align-baseline mx-auto lg:mx-0 lg:ml-2 mt-8 lg:mt-0 bg-black text-yellow-400 border-2 border-gray-700 px-10 py-3 lg:px-5 lg:py-1 rounded-full font-black text-lg lg:text-xl tracking-widest font-body hover:bg-white hover:text-dark-yellow"
                to={"/game"}>
                  PLAY NOW
                </Link >
              </div>
            </div>
          </div>
        </section>

        {/* --- HONEY DRIP --- */}
        <div id="" className="w-full mt-auto leading-0 bg-light-yellow">
          <img
            src="/images/honey-drip.svg"
            alt="Honey Dripz"
            className="w-full h-auto block -mt-1"
          />
        </div>
      </div>
    </>
  );
}
