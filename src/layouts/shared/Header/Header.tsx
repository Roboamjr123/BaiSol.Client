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
  Button,
  Badge,
} from "@nextui-org/react";
import { MdMenu } from "react-icons/md";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectUser } from "../../../state/authSlice";
import { useNavigate } from "react-router-dom";
import { useLogOut } from "../../../lib/API/AuthAPI";
import { useUserEmail, useUserRole } from "../../../state/Hooks/userHook";
import { IoNotificationsSharp } from "react-icons/io5";
import Notification from "./Notification";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();
  const logOut = useLogOut();

  const email = useUserEmail();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logOut.mutateAsync(email); // Await the logout mutation
      // Only execute the following lines if the mutation is successful
      localStorage.removeItem("refreshToken");
      Cookies.remove("accessToken");
      dispatch(clearUser());
      navigate("/");
      window.location.reload();
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

      <NavbarContent as="div" justify="end" className="gap-4">
        {useUserRole() === "Client" && <Notification />}
        <span className="hidden sm:block md:block lg:block">
          {useUserRole()}
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
              src="https://img-s1.onedio.com/id-636fbd5fa99378ac2941e5cf/rev-0/w-600/h-600/f-jpg/s-8f6b0c51641bfe96893ea3ded522a020e4a0753b.jpg"
              // src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{useUserEmail()}</p>
            </DropdownItem>

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
