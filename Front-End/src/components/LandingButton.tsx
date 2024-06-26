import { Link } from "react-router-dom";

const LandingButton = () => {
  return (
    <div>
      <Link to="/login">
        <button className="py-3 px-8 font-bold font-montserrat md:px-3 3xl:px-14 font-2px text-white rounded-lg bg-darkblue hover:bg-lightblue dark:bg-lightblue dark:hover:bg-darkblue">
          Faça Login
        </button>
      </Link>
    </div>
  );
};

export default LandingButton;
