import { Auth } from "../Components/Auth";
import { Qoute } from "../Components/Qoute";

export const Signup = () => {
  return (
    <div>
      <div className="grid grid-cols-2">
        <div >
            <Auth type="signup"></Auth>
        </div>

        <div className="invisible lg:visible">
          <Qoute></Qoute>
        </div>
      </div>
    </div>
  );
};
