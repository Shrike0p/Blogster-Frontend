import { Auth } from "../Components/Auth";
import { Qoute } from "../Components/Qoute";

export const Signin = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div >
            <Auth type="signin"></Auth>
        </div>

        <div className="hidden lg:block">
          <Qoute></Qoute>
        </div>
      </div>
    </div>
  );
};
