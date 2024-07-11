import { benefits } from "../constants/landing-page";

const Benefit = () => {
  return (
    <div className="flex flex-wrap justify-center bg-orange-400 pt-10 px-10" id="Benefits">
      {benefits.map((benefit, index) => (
        <div className="w-full sm:w-1/2 lg:w-1/3 px-10" key={index}>
          <h1 className="text-lg font-bold">{benefit.title}</h1>
          <p className="text-base text-gray-700 pt-2 mb-10">{benefit.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Benefit;
