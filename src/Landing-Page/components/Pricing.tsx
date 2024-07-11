import { pricingPlans } from "../constants/landing-page";
import { Check } from "lucide-react";

const Pricing = () => {
  return (
    <div className="my-20 text-center" id="Pricing">
      <h4 className="font-semibold text-orange-500 tracking-wider">
        Choose the Right Plan for You
      </h4>
      <h1 className="text-3xl sm:text-5xl lg:text-6xl text-center font-bold my-4 tracking-wider">
        Pricing Plans
      </h1>
      <h3 className="font-semibold text-gray-500 pb-10 tracking-wider">
        Select the plan that best fits your needs and budget.{" "}
      </h3>
      <div className="flex flex-wrap">
        {pricingPlans.map((option, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 lg:w-1/3 p-5 px-16 hover:scale-105 duration-300"
          >
            <div className="p-10 border rounded-xl">
              <p className="font-bold text-xl">
                Package <span className="text-orange-500">{option.title}</span>
              </p>
              <p className="sm:text-2xl lg:text-3xl  font-extrabold py-5 tracking-wider">
                {option.price}
              </p>
              <p className="text-sm font-bold">{option.type}</p>
              <ul>
                {option.features.map((feature, index) => (
                  <li key={index} className="flex mt-5 items-center">
                    <Check className="text-green-600" />
                    <span className="ml-5">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
