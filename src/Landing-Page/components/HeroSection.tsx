import { ArrowRight } from "lucide-react";
import background from "../../assets/Background.png";

const HeroSection = () => {
  return (
    <div
      className="flex flex-col items-center h-screen min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
      id="How it works"
    >
      <div className="px-1 flex flex-col justify-center flex-grow">
        <h1 className="text-4xl text-white sm:text-5xl lg:text-7xl mt-16 lg:mt-20 text-center tracking-wide">
          Switch to Solar Energy
        </h1>
        <h1 className="text-4xl text-white sm:text-5xl lg:text-7xl text-center tracking-wide">
          Today
        </h1>
        <p className="mt-10 text-lg text-center text-white max-w-4xl">
          Discover the benefits of installing solar panels for your home or
          business. Start saving money and reducing your carbon footprint.
        </p>
        <div className="flex justify-center my-10">
          <a
            href="#"
            className="bg-orange-400 text-white py-3 px-4 mx-3 rounded-lg hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
          >
            Get Free Quote
          </a>
          <a
            href="#"
            className="flex py-3 px-4 mx-3 hover:rounded hover:border"
          >
            Learn More{" "}
            <span className="pl-3">
              <ArrowRight />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
