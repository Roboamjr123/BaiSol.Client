import { HiOutlineBell } from "react-icons/hi";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { MdMenu } from "react-icons/md";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../state/authSlice";
import { useNavigate } from "react-router-dom";
import { useLogOut } from "../../../lib/API/AuthAPI";
import { useUserEmail, useUserRole } from "../../../state/Hooks/userHook";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();
  const logOut = useLogOut();

  const email = useUserEmail();
  const user = useSelector(selectUser);

  const handleLogout = async () => {
    try {
      await logOut.mutateAsync(email); // Await the logout mutation
      // Only execute the following lines if the mutation is successful
      localStorage.removeItem("refreshToken");
      Cookies.remove("accessToken");
      window.location.reload();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err); // Log error for debugging
      // Optionally show an error toast here if needed
    }
  };

  return (
    <Navbar isBordered className="border-orange-200">
      <NavbarContent justify="start">
        <div
          className="md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MdMenu size={25} />
        </div>
        <NavbarBrand>
          <div className="flex flex-col">
            <span className="text-xl font-semibold tracking-widest text-orange-500">
              BaiSol
            </span>
            <span className="text-xs tracking-tight">
              Easy Install, Effortless Monitoring
            </span>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" justify="end" className="gap-3">
        <Dropdown placement="bottom-end" className="lg:mr-8">
          <DropdownTrigger>
            <button className="p-1.5 rounded inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none transition-transform">
              <HiOutlineBell fontSize={26} />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" onClick={handleLogout} color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <span className="hidden sm:block md:block lg:block">
          {user.userRole}
        </span>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="warning"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem onClick={handleLogout} key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}

export default Header;
