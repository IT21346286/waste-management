import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Go = () => {
  return (
    <section className="flex flex-col container mx-auto px-5 py-1">
      <Link
        to="/register"
        onClick={() => console.log("Link clicked!")}
        className="mx-auto flex items-center gap-x-2 font-bold text-white border-8 bg-[#020D4D] border-[#b8e994] px-6 py-3 rounded-full"
      >
        <span>Let's get started</span>
        <FaArrowRight className="w-3 h-3" />
      </Link>
    </section>
  );
};

export default Go;
