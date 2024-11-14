import React, { useState } from "react";
import ClickOutside from "./ClickOutside";
import { Badge, Button, Chip } from "@nextui-org/react";
import { IoNotificationsSharp } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import {
  getNotificationMessages,
  INotificationMessage,
  useReadNotif,
} from "../../../lib/API/Client/ClientApi";
import Loader from "../../../main/components/Loader";

// export const notifications: INotificationMessage[] = [
//   {
//     notifId: 1,
//     title: 'Task "Solar Panel Installation" Started',
//     message:
//       'The task "Solar Panel Installation" for your project has just begun. Get ready for the next steps!',
//     type: "task_started",
//     createdAt: "2025-05-12",
//     isRead: false,
//     facilitatorName: "John Doe",
//     facilitatorEmail: "johndoe@example.com",
//   },
//   {
//     notifId: 2,
//     title: 'Task "Solar Panel Installation" Started',
//     message:
//       'The task "Solar Panel Installation" for your project has just begun. Get ready for the next steps!',
//     type: "task_started",
//     createdAt: "2025-05-12",
//     isRead: false,
//     facilitatorName: "John Doe",
//     facilitatorEmail: "johndoe@example.com",
//   },
//   {
//     notifId: 3,
//     title: 'Task "Solar Panel Installation" Started',
//     message:
//       'The task "Solar Panel Installation" for your project has just begun. Get ready for the next steps!',
//     type: "task_started",
//     createdAt: "2025-05-12",
//     isRead: false,
//     facilitatorName: "Jane Smith",
//     facilitatorEmail: "janesmith@example.com",
//   },
//   {
//     notifId: 4,
//     title: 'Task "Site Preparation" Completed',
//     message:
//       'Your project "Site Preparation" has been successfully completed and is now ready for the next phase.',
//     type: "task_completed",
//     createdAt: "2025-02-24",
//     isRead: true,
//     facilitatorName: "Michael Brown",
//     facilitatorEmail: "michaelbrown@example.com",
//   },
//   {
//     notifId: 5,
//     title: '"Energy Audit" Task Scheduled',
//     message:
//       'Your task "Energy Audit" has been scheduled and is set to begin on 10th March.',
//     type: "task_scheduled",
//     createdAt: "2025-01-04",
//     isRead: false,
//     facilitatorName: "Linda Green",
//     facilitatorEmail: "lindagreen@example.com",
//   },
//   {
//     notifId: 6,
//     title: 'Project "Solar Power Setup" Finalized',
//     message:
//       'Your project "Solar Power Setup" has been finalized successfully! Thank you for your collaboration.',
//     type: "project_finalized",
//     createdAt: "2024-12-01",
//     isRead: true,
//     facilitatorName: "David Lee",
//     facilitatorEmail: "davidlee@example.com",
//   },
// ];
const Notification = () => {
  const location = useLocation(); // Get the current location (URL)

  const isOnNotificationsPage = location.pathname === "/notifications"; // Check if the current URL is '/notifications'

  const { data: notifications, isLoading, refetch } = getNotificationMessages();
  const readNotif = useReadNotif();

  const handleReadNotif = (notifId: number) => {
    readNotif.mutateAsync({ notifId });
    refetch();
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  if (isLoading) return <Loader />;

  if (!notifications) return <div>Empty notification...</div>;

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Badge
        content={notifications.notifCount}
        shape="circle"
        color={`${notifying ? "default" : "danger"}`}
        className={
          isOnNotificationsPage || notifications.notifCount < 1 ? "hidden" : ""
        }
      >
        <Button
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          isDisabled={isOnNotificationsPage}
          radius="full"
          isIconOnly
          aria-label="more than 99 notifications"
          variant="light"
          className={`hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in ${
            isOnNotificationsPage && "text-orange-500"
          }`}
        >
          <IoNotificationsSharp size={20} />
        </Button>
      </Badge>

      {dropdownOpen && (
        <div
          className={`absolute -right-0 mt-1.5 flex h-auto w-60 px-4 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
        >
          <div className="px-4 py-3 border-b border-stroke">
            <h5 className="text-sm font-medium text-bodydark2">
              Recent Notifications
            </h5>
          </div>

          <ul className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100 max-h-80">
            {notifications.notifs.map((notif) => (
              <li key={notif.notifId}>
                <Link
                  className={`flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-100 dark:hover:bg-meta-4 ${
                    notif.isRead
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-boxdark"
                  }`}
                  to={`/notifications/${notif.notifId}`}
                  onClick={() => handleReadNotif(notif.notifId)}
                >
                  <p className="text-sm truncate">
                    <span className="font-semibold text-black dark:text-white">
                      {notif.title}
                    </span>{" "}
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {notif.createdAt}
                    <Chip
                      className={`border-none ${notif.isRead ? "hidden" : ""}`}
                      color="danger"
                      size="sm"
                      variant="dot"
                    ></Chip>
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-4 py-3 border-t border-stroke text-center">
            <Link to={"/notifications"}>
              <Button size="sm" className="text-gray-500 hover:text-gray-700">
                View All Notifications
              </Button>
            </Link>
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default Notification;
