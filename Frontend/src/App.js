import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import GreenMartPage from "./pages/greenMart/GreenMartPage";
import MyItems from "./pages/greenMart/MyItems";
import SellingForm from "./pages/greenMart/SellingForm";
import QuizPage from './pages/quiz/QuizPage';
import EditItemPage from "./pages/greenMart/EditItemPage";
import GreenAcademy from "./pages/greenInsightAcademy/GreenAcademy";
import VisualLearningLib from "./pages/greenInsightAcademy/VisualLearningLib";

import EcoSharePage from "./pages/ecoShare/EcoSharePage.jsx";
import MyDonations from "./pages/ecoShare/MyDonations.jsx";
import PostingForm from "./pages/ecoShare/PostingForm.jsx";
import EditDonationPage from "./pages/ecoShare/EditDonationPage.jsx";

import AboutUsPage from "./pages/getInTouch/AboutUsPage";
import ContactUsPage from "./pages/getInTouch/ContactUsPage";

function App() {
  return (
    <div className="App font-opensans">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/all-items" element={<GreenMartPage />} />
        <Route path="/my-items" element={<MyItems />} />
        <Route path="/post-item" element={<SellingForm />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/edit-item/:itemId" element={<EditItemPage />} />
        <Route path="/academy" element={<GreenAcademy />} />
        <Route path="/visual-learning-library" element={<VisualLearningLib />} />

        <Route path="/all-donations" element={<EcoSharePage />} />
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/post-donation" element={<PostingForm />} />
        <Route path="/edit-donation/:donationId" element={<EditDonationPage />} />

        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
