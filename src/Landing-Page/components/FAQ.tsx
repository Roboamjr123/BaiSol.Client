import { faqs } from "../constants/landing-page";

const Faq = () => {
  return (
    <div className="flex flex-wrap justify-center items-center my-10" id="FAQ">
      {faqs.map((faq, index) => (
        <div key={index} className="p-10 lg:w-1/2">
          <h1 className="font-bold text-xl mb-2">{faq.question}</h1>
          <p className="text-gray-700">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default Faq;
