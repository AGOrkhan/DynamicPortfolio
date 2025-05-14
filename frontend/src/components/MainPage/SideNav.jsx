import { Home, Glasses, Briefcase, FolderDot, Mail } from "lucide-react";

const SideNav = ({ visible }) => {
  return (
    <nav
      className={`sidenav fixed top-1/2 -translate-y-1/2 left-0 z-50 w-16 sm:w-20 bg-red-900 flex flex-col items-center justify-center 
            space-y-10 transition duration-300 ease-in-out transform 
            ${
              visible
                ? "opacity-75 transition duration-300 hover:opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full sm:-translate-x-5"
            } rounded-r-lg`}
    >
      <a href="#home">
        <Home className="icon-style mt-5"></Home>
      </a>
      <a href="#expertise">
        <Glasses className="icon-style"></Glasses>
      </a>
      <a href="#work">
        <Briefcase className="icon-style"></Briefcase>
      </a>
      <a href="#projects">
        <FolderDot className="icon-style"></FolderDot>
      </a>
      <a href="#contact">
        <Mail className="icon-style mb-5"></Mail>
      </a>
    </nav>
  );
};

export default SideNav;
