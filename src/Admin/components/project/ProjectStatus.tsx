const ProjectStatus = ({
  onSelectStatus,
  activeStatus,
}: {
  onSelectStatus: any;
  activeStatus: any;
}) => {
  const statuses = ["OnGoing", "Finished", "OnHold"];

  return (
    <div className="px-4 mb-8 lg:space-x-16 flex flex-wrap items-center border-b-2 py-5 text-gray-900 font-semibold">
      <button
        onClick={() => onSelectStatus(null)}
        className={`lg:ml-12 ${activeStatus ? "" : "active-button"}`}
      >
        All
      </button>
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onSelectStatus(status)}
          className={`mx-2 space-x-16 ${
            activeStatus === status ? "active-button" : ""
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default ProjectStatus;
