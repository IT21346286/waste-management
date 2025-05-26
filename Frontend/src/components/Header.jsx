import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../store/actions/user";
import { images } from "../constants";

const navItemsInfo = [
  { name: "Home", type: "link", href: "/" },
  //{ name: "Page 1", type: "link", href: "/page1" },
  { name: "Green Insight Academy", type: "link", href: "/academy" },
  { name: "Green Mart", type: "link", href: "/all-items" },
  { name: "Waste Whiz", type: "link", href: "/quiz" },
  { name: "Eco Share", type: "link", href: "/all-donations" },
  { name: "Visual Learning Library", type: "link", href: "/visual-learning-library" },
  //{ name: "Page 3", type: "link", href: "/page3" },
  //{ name: "Page 4", type: "link", href: "/page4" },
  {
    name: "Get in Touch",
    type: "dropdown",
    items: [
      { title: "About us", href: "/about" },
      { title: "Contact us", href: "/contact" },
    ],
  },
];

const NavItem = ({ item, isActive, onClick }) => {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdownHandler = () => {
    setDropdown((curState) => !curState);
  };

  return (
    <li className="relative group">
      {item.type === "link" ? (
        <>
          <Link
            to={item.href}
            onClick={onClick}
            className={`px-4 py-2 transition-all duration-300 border border-transparent rounded-full ${isActive ? 'border-[#020D4D] bg-[#020D4D] text-white' : 'group-hover:border-[#020D4D] group-hover:bg-[#020D4D] group-hover:text-white'}`}
          >
            {item.name}
          </Link>
          
        </>
      ) : (
        <div className="flex flex-col items-center">
          <button
            className="px-4 py-2 flex gap-x-1 items-center"
            onClick={toggleDropdownHandler}
          >
            <span>{item.name}</span>
            <MdKeyboardArrowDown />
          </button>
          <div
            className={`${
              dropdown ? "block" : "hidden"
            } lg:hidden transition-all duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
          >
            <ul className="bg-white lg:bg-white text-center flex flex-col shadow-lg rounded-lg overflow-hidden">
              {item.items.map((page, index) => (
                <Link
                  key={index}
                  to={page.href}
                  className="hover:bg-[#020D4D] hover:text-white px-4 py-2 text-white lg:text-dark-soft"
                >
                  {page.title}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [navIsVisible, setNavIsVisible] = useState(false);
  const userState = useSelector((state) => state.user);
  const [profileDrowpdown, setProfileDrowpdown] = useState(false);

  const navVisibilityHandler = () => {
    setNavIsVisible((curState) => {
      return !curState;
    });
  };

  const logoutHandler = () => { 
    // Clear localStorage 
    localStorage.removeItem('account'); 
    // Dispatch logout action 
    dispatch(logout()); 
    // Navigate to login page 
    navigate('/login'); };

   // Function to determine if a nav item should be active based on current path
  const getActiveNavItem = (href) => location.pathname === href;

  return (
    <section className="sticky top-0 left-0 right-0 z-50 bg-white">
      <header className="container mx-auto px-5 flex justify-between py-4 items-center">
        <Link to="/" className="flex items-center">
          <img className="w-16" src={images.Logo1} alt="logo" />
          <div className="flex flex-col ml-4" style={{ color: '#0c4a6e' }}>
            <h4 className="font-roboto font-bold text-3xl">GREEN</h4>
            <h4 className="font-roboto font-bold text-3xl">INSIGHT</h4>
          </div>
        </Link>
        <div className="lg:hidden z-50">
          {navIsVisible ? (
            <AiOutlineClose
              className="w-6 h-6"
              onClick={navVisibilityHandler}
            />
          ) : (
            <AiOutlineMenu className="w-6 h-6" onClick={navVisibilityHandler} />
          )}
        </div>
        <div
          className={`${
            navIsVisible ? "right-0" : "-right-full"
          } transition-all duration-300 mt-[56px] lg:mt-0 bg-dark-hard lg:bg-transparent z-[49] flex flex-col w-full lg:w-auto justify-center lg:justify-end lg:flex-row fixed top-0 bottom-0 lg:static gap-x-9 items-center`}
        >
          <ul className="text-white items-center gap-y-5 lg:text-dark-soft flex flex-col lg:flex-row gap-x-2 font-semibold">
            {navItemsInfo.map((item) => (
              <NavItem 
                  key={item.name}
                  item={item}
                  isActive={getActiveNavItem(item.href)}
                  onClick={() => {}}
              />
            ))}
          </ul>
          {/* userState */}
          {userState.userInfo ? (
            <div className="text-white items-center gap-y-5 lg:text-dark-soft flex flex-col lg:flex-row gap-x-2 font-semibold">
              <div className="relative group">
                <div className="flex flex-col items-center">
                  <button
                    className="flex gap-x-1 items-center mt-5 lg:mt-0 border-2 border-blue-500 px-6 py-2 rounded-full text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
                    onClick={() => setProfileDrowpdown(!profileDrowpdown)}
                  >
                    <span>Account</span>
                    <MdKeyboardArrowDown />
                  </button>
                  <div
                    className={`${
                      profileDrowpdown ? "block" : "hidden"
                    } lg:hidden transition-all duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
                  >
                    <ul className="bg-dark-soft lg:bg-transparent text-center flex flex-col shadow-lg rounded-lg overflow-hidden">

                      <button
                        onClick={() => navigate("/profile")}
                        type="button"
                        className="hover:bg-dark-hard hover:text-white px-4 py-2 text-white lg:text-dark-soft"
                      >
                        Profile Page
                      </button>
                      <button
                        onClick={logoutHandler}
                        type="button"
                        className="hover:bg-dark-hard hover:text-white px-4 py-2 text-white lg:text-dark-soft"
                      >
                        Logout
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="mt-5 lg:mt-0 border-2 border-green-500 px-6 py-2 rounded-full text-green-500 font-semibold hover:bg-green-500 hover:text-white transition-all duration-300"
            >
              Sign in
            </button>
          )}
        </div>
      </header>
    </section>
  );
};

export default Header;