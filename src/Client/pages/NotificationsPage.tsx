import React from "react";
// import { notifications } from "../../layouts/shared/Header/Notification";
import { Link, useNavigate } from "react-router-dom";
import { Chip } from "@nextui-org/react";
import {
  getNotificationMessages,
  useReadNotif,
} from "../../lib/API/Client/ClientApi";
import Loader from "../../main/components/Loader";

const NotificationsPage = () => {
  const { data: notifications, isLoading, refetch } = getNotificationMessages();
  const readNotif = useReadNotif();
  const navigate = useNavigate();

  const handleReadNotif = (notifId: number) => {
    readNotif.mutateAsync(
      { notifId },
      {
        onSuccess: () => {
          refetch();
          navigate(`/notifications/${notifId}`);
        },
      }
    );
  };

  if (isLoading) return <Loader />;

  if (!notifications) return <div>Empty notification...</div>;

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        {" "}
        <div className="px-4 py-3 border-b">
          <h5 className="text-lg font-semibold tracking-wide">Notifications</h5>
        </div>
        <div className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className="min-h-full">
            <ul className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100 max-h-full">
              {notifications?.notifs.map((notif) => (
                <li key={notif.notifId}>
                  <button
                    className={`flex flex-col gap-2.5 border-t px-4 py-3 hover:bg-gray-100 dark:hover:bg-meta-4 ${
                      notif.isRead
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-boxdark"
                    }`}
                    onClick={() => handleReadNotif(notif.notifId)}
                    // to={{
                    //   pathname: `/notifications/${notif.notifId}`, // Target route
                    // }}
                    disabled={readNotif.isPending}
                  >
                    <p className="text-sm ">
                      <span className="font-semibold text-black dark:text-white">
                        {notif.title}
                      </span>{" "}
                      <p className="text-start justify-stretch indent-10">
                        {notif.message}
                      </p>
                    </p>
                    <p className="text-xs text-gray-500">
                      {notif.createdAt}
                      <Chip
                        className={`border-none ${
                          notif.isRead ? "hidden" : ""
                        }`}
                        color="danger"
                        size="sm"
                        variant="dot"
                      ></Chip>
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
