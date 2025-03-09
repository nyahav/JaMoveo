import { ModeToggle } from "@/app/dark-mode";
import { MdElectricBolt } from "react-icons/md";

export default function Navbar() {
  return (
    <div className="flex m-5 max-sm:mt-9 mx-8 items-center justify-between max-sm:flex-col  ">
      <AppLogo />
      <ModeToggle />
    </div>
  );
}

function AppLogo() {
  return (
    <div className="flex items-center justify-between space-x-2 mt-1">
      {/* // Container for the logo and title */}
      <div className="flex gap-2 items-center">
        {/* // Purple rounded background with centered robot icon */}

        <div className="w-9 h-9 bg-primary   rounded-md flex items-center justify-center">
          <MdElectricBolt className="text-primary-foreground" />{" "}
        </div>
        {/* // Title with bold and light parts */}
        <h1 className={`text-[20px] flex gap-1  `}>
          <span className="font-bold  ">Saas</span>
          <span className="font-light  ">Gen</span>
        </h1>
      </div>
    </div>
  );
}
