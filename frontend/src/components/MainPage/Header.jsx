import { Menu } from "lucide-react";
import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  let mobileMenu = null;
  if (isMenuOpen) {
    mobileMenu = (
      <div className="fixed top-0 left-0 w-full h-screen bg-black/90 backdrop-blur-sm z-50 lg:hidden">
        <nav className="pt-20">
          <ul className="flex flex-col items-center space-y-8">
            <li>
              <a href="#" className="text-xl text-white hover:text-purple-400 transition-colors" 
                 onClick={() => setIsMenuOpen(false)}>//home</a>
              <div className="w-full h-px bg-white/20 mt-4"></div>
            </li>
            <li>
              <a href="#expertise" className="text-xl text-white hover:text-purple-400 transition-colors" 
                 onClick={() => setIsMenuOpen(false)}>//expertise</a>
              <div className="w-full h-px bg-white/20 mt-4"></div>
            </li>
            <li>
              <a href="#work" className="text-xl text-white hover:text-purple-400 transition-colors" 
                 onClick={() => setIsMenuOpen(false)}>//experience</a>
              <div className="w-full h-px bg-white/20 mt-4"></div>
            </li>
            <li>
              <a href="#projects" className="text-xl text-white hover:text-purple-400 transition-colors" 
                 onClick={() => setIsMenuOpen(false)}>//projects</a>
              <div className="w-full h-px bg-white/20 mt-4"></div>
            </li>
            <li>
              <a href="#contact" className="text-xl text-white hover:text-purple-400 transition-colors" 
                 onClick={() => setIsMenuOpen(false)}>//contact</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <header className="absolute top-0 left-0 right-0">
      <nav className="w-full p-5 z-50 topnav">
        {/* Burger Menu Button for Mobile View */}
        <button className="lg:hidden" onClick={openMenu}>
          <Menu className="w-10 h-10 text-white mr-5 hover:bg-blue-400 cursor-pointer" />
        </button>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex justify-center list-none">
          <li className="mx-[30px] my-0">
            <a href="#">//home</a>
          </li>
          <li className="mx-[30px] my-0">
            <a href="#expertise">//expertise</a>
          </li>
          <li className="mx-[30px] my-0">
            <a href="#work">//experience</a>
          </li>
          <li className="mx-[30px] my-0">
            <a href="#projects">//projects</a>
          </li>
          <li className="mx-[30px] my-0">
            <a href="#contact">//contact</a>
          </li>
        </ul>
        {mobileMenu}
      </nav>
    </header>
  );
};

export default Header;
