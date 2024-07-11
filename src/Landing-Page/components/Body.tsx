import HeroSection from "./HeroSection";
import Benefit from "./Benefit";
import Pricing from "./Pricing";
import SwitchSolar from "./SwitchSolar";
import Faq from "./FAQ";

const Body = () => {
  return (
    <div className="max-w mx-auto">
      <HeroSection />
      <Benefit/>
      <Pricing />
      <SwitchSolar />
      <Faq />
    </div>
  );
};

export default Body;
