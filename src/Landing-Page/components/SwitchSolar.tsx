import { ArrowRight } from "lucide-react";

const SwitchSolar = () => {
  return (
    <div
      className="flex flex-col items-center text-center justify-center bg-orange-400 pt-10 px-10"
      id="Cost Savings"
    >
      <h1 className="text-white lg:text-4xl text-2xl font-extrabold tracking-wider">
        Start saving money and the environment with solar energy!
      </h1>
      <p className="text-white lg:text-sm text-xs pt-10">
        Find out how easy it is to switch to solar power and start enjoying the
        benefits today.
      </p>
      <div className="flex justify-center my-10">
        {/* <a
          href="#"
          className="bg-white text-black font-extrabold py-3 px-4 mx-3 rounded-lg hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
        >
          Get Free Quote
        </a> */}
        <a
          href="https://en.wikipedia.org/wiki/Solar_energy"
          className="flex py-3 px-4 mx-3 hover:rounded-md hover:border text-white"
        >
          Learn about more Solar Energy
          <span className="pl-3 text-black">
            <ArrowRight />
          </span>
        </a>
      </div>
    </div>
  );
};

export default SwitchSolar;
