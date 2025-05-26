import React from "react";
import MainLayout from "../../components/MainLayout";
import Go from "./container/Go";
import CTA from "./container/CTA";
import LandingPage from "./container/LandingPage";

const HomePage = () => {
  return (
    <MainLayout>
      <LandingPage />
      <Go />
      <CTA />
    </MainLayout>
  );
};

export default HomePage;
