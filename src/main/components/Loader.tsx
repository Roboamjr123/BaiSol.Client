import ReactLoading from "react-loading";
const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="w-full h-full backdrop-blur-md rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center ">
        <ReactLoading
          type="bubbles"
          color="orange"
          height={100}
          width={100}
        />
        <p className="mt-3 text-orange-400 text-3xl tracking-widest font-bold">{label}</p>
      </div>
    </div>
  );
};

export default Loader;
