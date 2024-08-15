import logo from "../../assets/logo/BaiSol-Logo.png";
import { navItems } from "../constants/landing-page";
import { Link } from "react-scroll";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  const closeDrawer = () => setMobileDrawerOpen(false);

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-neutral-700/80">
      <div className="container mx-auto relative px-5 lg:text-sm">
        <div className="flex justify-between items-center">
        <NavLink to='/'>
          <div className="flex items-center flex-shrink-0">
              <img className="h-10 w-10 mr-2" src={logo} alt="logo" />
              <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-wide text-orange-500">
                  BaiSol
                </span>
                <span className="text-xs tracking-tight">
                  Easy Install, Effortless Monitoring
                </span>
              </div>
          </div>
          </NavLink>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  className="text-orange-500 text-base font-medium hover:text-orange-300"
                  to={item.label}
                  href={item.href}
                  smooth={true}
                  offset={-100}
                  duration={500}
                >
                  <NavLink to="/">{item.label}</NavLink>
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center mr-16 items-center ">
            <NavLink
              to="/LogIn"
              className="bg-orange-400 text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            >
              Sign In
            </NavLink>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar} className="text-orange-500">
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-2 w-full p-12 flex flex-col justify-center items-center lg:hidden backdrop-blur-lg bg-white/90">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <Link
                    className="text-orange-500 hover:text-orange-300"
                    onClick={closeDrawer}
                    to={item.label}
                    href={item.href}
                    smooth={true}
                    offset={-100}
                    duration={500}
                  >
                    <NavLink to="/">{item.label}</NavLink>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              <NavLink
              onClick={closeDrawer}
                to="/LogIn"
                className="bg-orange-400 text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
              >
                Sign In
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
