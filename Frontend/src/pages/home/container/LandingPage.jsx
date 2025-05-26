import React from "react";

import { images } from "../../../constants";

const LandingPage = () => {
  return (
    <section className="container mx-auto flex flex-col px-10 py-5 lg:flex-row">
      <div className="mt-10 lg:w-1/2 lg:mr-32">
        <h2 className="font-roboto text-5xl text-center font-bold text-[#020D4D] md:text-6xl lg:text-5xl xl:text-6xl lg:text-left lg:max-w-[540px]">
          Welcome to
        </h2>
        <br />
        <h1 className="font-roboto text-10xl text-center font-bold text-[#020D4D] md:text-10xl lg:text-7xl xl:text-8xl lg:text-left lg:max-w-[900px] whitespace-nowrap">
           Green Insight!
        </h1>
        <br />
        <p className="text-dark-light mt-4 text-center md:text-xl lg:text-base xl:text-xl lg:text-left">
          Join us to become a champion of waste management and help create a cleaner Sri Lanka for future generations.
        </p>
        <p className="text-dark-light mt-4 text-center md:text-xl lg:text-base xl:text-xl lg:text-left">
          Transform Waste into Worth – Be the Change!
        </p>
      </div>

      <div className="hidden lg:block lg:w-1/2 lg:ml-32"> 
        <img
          className="w-3/4 max-w-10px]"
          src={images.Poster}
          alt="users are reading articles"
        />
      </div>
    </section>
  );
};

export default LandingPage;
