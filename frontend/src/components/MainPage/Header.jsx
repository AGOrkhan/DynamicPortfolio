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
      <ul className="absolute top-full left-0 right-0 flex flex-col items-center bg-gray-800 text-white p-4 space-y-4 lg:hidden">
        <li>
          <a href="#">Home</a>
        </li>
        <div className="w-full h-px bg-white"></div>
        <li>
          <a href="#expertise">Expertise</a>
        </li>
        <div className="w-full h-px bg-white"></div>
        <li>
          <a href="#work">Work Experience</a>
        </li>
        <div className="w-full h-px bg-white"></div>
        <li>
          <a href="#projects">Projects</a>
        </li>
        <div className="w-full h-px bg-white"></div>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
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
