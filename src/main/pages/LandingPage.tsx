import NavBar from "../../Landing-Page/components/NavBar";
import { Outlet } from "react-router-dom";
import Footer from "../../layouts/shared/Footer";

const LandingPage = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen ">
        <NavBar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
