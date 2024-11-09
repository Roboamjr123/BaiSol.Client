import { useEffect, useState } from "react";
import SubMenu from "./SubMenu";
import { motion } from "framer-motion";
import Logo from "../../../assets/logo/BaiSol-Logo.png";

// * React icons
import { IoIosArrowBack } from "react-icons/io";
import { TbReportAnalytics } from "react-icons/tb";
import { useMediaQuery } from "react-responsive";
import { MdMenu, MdPeopleAlt } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { BiSolidReport } from "react-icons/bi";
import { selectUser } from "../../../state/authSlice";
import { useSelector } from "react-redux";
import { RxActivityLog } from "react-icons/rx";

// Define the type for a sidebar link
interface SidebarLink {
  key: string;
  label: string;
  path: string;
  icon: React.ReactElement;
}

// Define the type for the Sidebar component props
interface SidebarProps {
  links: SidebarLink[];
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ links, isOpen, setOpen }) => {
  const user = useSelector(selectUser) || {}; // Ensure user is not null

  // Default to empty object if user is null to avoid errors
  const userRole = user?.userRole || null; // Ensure user is not null

  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  const { pathname } = useLocation();

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString(); // Format date and time as per locale
      setCurrentTime(formattedTime);
    };

    updateTime(); // Update time immediately on component mount

    const timerId = setInterval(updateTime, 1000); // Update time every second

    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTabletMid]);

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [pathname]);

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  const subMenusList = [
    {
      name: "reports",
      icon: BiSolidReport,
      menus: ["sales", "project", "materials", "equipment"],
    },
    // {
    //   name: "analytics",
    //   icon: TbReportAnalytics,
    //   menus: ["dashboard", "realtime", "events"],
    // },
  ];

  return (
    <div>
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${
          isOpen ? "block" : "hidden"
        } `}
      ></div>
      <motion.div
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={isOpen ? "open" : "closed"}
        className=" bg-white text-gray shadow-xl z-[999] max-w-[16rem]  w-[16rem] 
            overflow-hidden md:relative fixed h-screen "
      >
        <div className="flex justify-center gap-2.5 font-medium border-b py-3 border-orange-300  mx-3">
          <img src={Logo} width={45} alt="" />
        </div>

        <div className="flex flex-col  h-full">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1  font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100   md:h-[68%] h-[70%]">
            {links.map((link) => (
              <li key={link.key}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `link ${isActive ? "sidebar-active" : ""}`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              </li>
            ))}

            {userRole === "Admin" && (
            // {userRole === null && (
              <>
                {(isOpen || isTabletMid) && (
                  <div className="border-y py-5 border-orange-300">
                    {/* <small className="pl-3 text-slate-500 inline-block mb-2">
                      Product categories
                    </small> */}
                    {subMenusList?.map((menu) => (
                      <div key={menu.name} className="flex flex-col gap-1">
                        <SubMenu data={menu} />
                      </div>
                    ))}
                  </div>
                )}
                <li>
                  <NavLink
                    to={"/clients"}
                    className={({ isActive }) =>
                      `link ${isActive ? "sidebar-active" : ""}`
                    }
                  >
                    <MdPeopleAlt size={23} className="min-w-max" />
                    Clients
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/activity"}
                    className={({ isActive }) =>
                      `link ${isActive ? "sidebar-active" : ""}`
                    }
                  >
                    <RxActivityLog size={23} className="min-w-max" />
                    Activity
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {isOpen && (
            <div className="flex-1 text-sm z-50  max-h-48 my-auto  whitespace-pre   w-full  font-medium  ">
              <div className="flex border-y border-orange-300 p-4 items-center justify-between">
                <span className="text-gray-700 text-base font-semibold">
                  {currentTime}
                </span>
              </div>
            </div>
          )}
        </div>
        <motion.div
          onClick={() => {
            setOpen(!isOpen);
          }}
          animate={
            isOpen
              ? {
                  x: 0, // Keep the arrow in its default x position when open
                  rotate: 0, // Default rotation when open
                }
              : {
                  x: -10, // Move it slightly to the left when closed
                  rotate: 180, // Rotate the arrow when closed
                }
          }
          transition={{ duration: 0 }}
          className="absolute w-fit h-fit md:block z-50 hidden right-2 bottom-3 cursor-pointer"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
