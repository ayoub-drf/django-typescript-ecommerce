import { CiDark } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import navBarIcon from "../assets/navbar.png";
import { FC } from "react"
import { AuthenticationProps } from "../types/types"
import CatIcon from "../assets/cart.png"

interface navProps extends AuthenticationProps {
  cartCount: number
}

const Navbar: FC<navProps> = ({ isAuthenticated, setIsAuthenticated, cartCount }) => {
  const handleDarkMode = () => {
    document.body.classList.toggle("dark");
  };
  const handleNavBar = () => {
    document.querySelector("#nav-links")?.classList.toggle("active-navbar");
  };
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false)
  };

  return (
    <nav className="container sticky top-0 z-20 max-md:py-2 max-md:px-1 flex text-black dark:bg-gray-800 dark:text-white bg-white border-b-1 border-[#ccc] py-2 justify-between items-center">
      <a
        href="/"
        className="text-[#2196F3] max-lg:flex-1 text-[33px] font-bold "
      >
        E-commerce
      </a>
      <ul
        id="nav-links"
        className="flex z-10 bg-white dark:bg-gray-800 max-lg:flex-col max-lg:absolute max-lg:top-[-572px] max-lg:left-0 max-lg:container"
      >
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              (isActive ? "active-link" : "") +
              " block hover:text-[#2196F3] mx-3 max-lg:mx-0 max-lg:my-2 max-lg:p-1"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/c/"
            className={({ isActive }) =>
              (isActive ? "active-link" : "") +
              " block hover:text-[#2196F3] mx-3 max-lg:mx-0 max-lg:my-2 max-lg:p-1"
            }
          >
            Create Product
          </NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <a
                onClick={logout}
                className="block cursor-pointer hover:text-[#2196F3] mx-3 max-lg:mx-0 max-lg:my-2 max-lg:p-1"
              >
                Logout
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/register/"
                className={({ isActive }) =>
                  (isActive ? "active-link" : "") +
                  " block hover:text-[#2196F3] mx-3 max-lg:mx-0 max-lg:my-2 max-lg:p-1"
                }
              >
                Register
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login/"
                className={({ isActive }) =>
                  (isActive ? "active-link" : "") +
                  " block hover:text-[#2196F3] mx-3 max-lg:mx-0 max-lg:my-2 max-lg:p-1"
                }
              >
                Login
              </NavLink>
            </li>
          </>
        )}
      </ul>
      <div className="flex items-center">
        <CiDark
          onClick={handleDarkMode}
          className="text-[28px] cursor-pointer font-extrabold text-black"
        />
        <a href="/cart/" className="ml-4 block relative">
          <img className="relative" src={CatIcon} width={33} alt="" />
          <span className="absolute top-[-12px] left-[-12px] font-bold text-[#2196F3] ">{cartCount}</span>
        </a>
      </div>
      <div className="items-center ml-3 hidden max-lg:flex">
        <img
          onClick={handleNavBar}
          width={28}
          className="cursor-pointer"
          src={navBarIcon}
          alt=""
        />
      </div>
    </nav>
  );
};

export default Navbar;
