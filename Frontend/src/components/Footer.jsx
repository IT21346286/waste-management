import React from "react";
import {
  AiOutlineTwitter,
  AiFillYoutube,
  AiFillInstagram,
} from "react-icons/ai";
import { GiThreeLeaves } from "react-icons/gi";
import { FaFacebook } from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";

import { images } from "../constants";

const Footer = () => {
  return (
    <section className="bg-dark-hard">
      <footer className="container mx-auto grid grid-cols-10 px-5 py-10 gap-y-10 gap-x-5 md:pt-20 md:grid-cols-12 lg:grid-cols-10 lg:gap-x-10">
   {/* Page 1 ----- keep this */}
   {/*  <div className="col-span-5 md:col-span-4 lg:col-span-2">
          <h3 className="text-dark-light font-bold md:text-lg">Page 1</h3>
          <ul className="text-[#959EAD] text-sm mt-5 space-y-4 md:text-base">
            <li>
              <a href="/">Sub-page 1</a>
            </li>
            <li>
              <a href="/">Sub-page 2</a>
            </li>
            <li>
              <a href="/">Sub-page 3</a>
            </li>
          </ul>
        </div>
        */}

        <div className="col-span-5 md:col-span-4 lg:col-span-2">
          <h3 className="text-dark-light font-bold md:text-lg">Green Insight Academy</h3>
          <ul className="text-[#959EAD] text-sm mt-5 space-y-4 md:text-base">
            <li>
              <a href="/all-items">Green Mart</a>
            </li>
            <li>
              <a href="/quiz">Waste Whiz</a>
            </li>
            <li>
              <a href="/">Eco Share</a>
            </li>
            <li>
              <a href="/visual-learning-library">Visual Learning Library</a>
            </li>
          </ul>
        </div>

        {/* Page 3, 4 ----- keep this */}
{/*    <div className="col-span-5 md:col-span-4 md:col-start-5 lg:col-start-auto lg:col-span-2">
          <h3 className="text-dark-light font-bold md:text-lg">Page 3</h3>
          <ul className="text-[#959EAD] text-sm mt-5 space-y-4 md:text-base">
            <li>
              <a href="/">Sub-page 1</a>
            </li>
            <li>
              <a href="/">Sub-page 2</a>
            </li>
            <li>
              <a href="/">Sub-page 3</a>
            </li>
          </ul>
        </div>
        <div className="col-span-5 md:col-span-4 lg:col-span-2">
          <h3 className="text-dark-light font-bold md:text-lg">Page 4</h3>
          <ul className="text-[#959EAD] text-sm mt-5 space-y-4 md:text-base">
            <li>
              <a href="/">Sub-page 1</a>
            </li>
            <li>
              <a href="/">Sub-page 2</a>
            </li>
            <li>
              <a href="/">Sub-page 3</a>
            </li>
          </ul>
        </div>

        */}

        <div className="col-span-10 md:order-first md:col-span-4 lg:col-span-2">
           <img
              src={images.Logo1}
              alt="logo"
              className="md:mx-0 w-12 h-12"
          />
          <p className="text-sm text-dark-light text-center mt-4 md:text-left md:text-base lg:text-sm">
            Follow us on
          </p>
          <ul className="flex justify-center items-center mt-5 space-x-4 text-gray-300 md:justify-start">
            <li>
              <a href="/">
                <AiOutlineTwitter className="w-6 h-auto" />
              </a>
            </li>
            <li>
              <a href="/">
                <AiFillYoutube className="w-6 h-auto" />
              </a>
            </li>
            <li>
              <a href="/">
                <AiFillInstagram className="w-6 h-auto" />
              </a>
            </li>
            <li>
              <a href="/">
                <FaFacebook className="w-6 h-auto" />
              </a>
            </li>
            <li>
              <a href="/">
                <BsTelegram className="w-6 h-auto" />
              </a>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-center space-y-4 md:col-span-12 lg:col-span-10">
          <div className="bg-[#a3e635] text-white p-3 rounded-full">
            <GiThreeLeaves className="w-7 h-auto" />
          </div>
          <p className="text-center text-sm text-gray-500">
            Copyright © 2024. A greener world starts with you.
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
