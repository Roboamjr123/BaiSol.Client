import { getNotificationMessage } from "../../lib/API/Client/ClientApi";
import { useParams } from "react-router-dom";
import Loader from "../../main/components/Loader";

const NotificationInfoDisplay = () => {
  const { notifId } = useParams<{ notifId: string }>(); // Expecting string
  const notifIdNumber = notifId ? parseInt(notifId, 10) : null; // Converting to number

  const { data: notification, isLoading } = getNotificationMessage(
    notifIdNumber!
  );

  if (isLoading) return <Loader />;

  if (!notification || notifIdNumber === null || isNaN(notifIdNumber))
    return <div>Empty notification...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 mx-4 border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white">
        <h2 className="text-2xl font-bold text-start text-gray-800 dark:text-white mb-2">
          {notification.title}
        </h2>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-300 text-start justify-stretch indent-10">
          {notification.message}
        </p>
        <div className="flex justify-center mt-4 text-xs text-gray-500 dark:text-gray-400">
          {notification.createdAt}
        </div>
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-center text-gray-500 dark:text-gray-300">
            <strong>Assigned Facilitator:</strong>{" "}
            {notification.facilitatorName}
          </p>
          <p className="text-sm text-center text-gray-500 dark:text-gray-300">
            <strong>Email:</strong> {notification.facilitatorEmail}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationInfoDisplay;
