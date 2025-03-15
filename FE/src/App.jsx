// App.jsx
import { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Appointment from "./pages/Appointment";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./pages/Login";
import AppointmentStatus from "./pages/AppointmentStatus";
import Profile from "./pages/Profile";
import VerificationSuccess from "./pages/Verificationsuccess.jsx";
import MedicalRecord from "./pages/MedicalRecord";
import DetailsMedicalRecord from "./components/DetailsMedicalRecord";
import UserAdapter from "./utils/UserAdapter";

const App = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/patient/me",
          { withCredentials: true }
        );
        const rawUserData = response.data.user;
        console.log("Raw user data from API:", rawUserData); // Debug dữ liệu thô

        const userAdapter = new UserAdapter(rawUserData);
        const formattedUser = userAdapter.getFormattedUser();
        console.log("Formatted user data:", formattedUser); // Debug dữ liệu đã chuẩn hóa

        setIsAuthenticated(true);
        setUser(formattedUser);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    fetchUser();
  }, [setIsAuthenticated, setUser]);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/appointmentstatus" element={<AppointmentStatus />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verification-success" element={<VerificationSuccess />} />
          <Route path="/medical-record" element={<MedicalRecord />} />
          <Route path="/details-medical-record/:id" element={<DetailsMedicalRecord />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;