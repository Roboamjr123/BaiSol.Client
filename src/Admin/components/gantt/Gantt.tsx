import "../gantt/css/tailwind.css";

import {
  GanttComponent,
  Inject,
  Selection,
  Toolbar,
  Edit,
  EditSettingsModel,
  ToolbarItem,
  Filter,
  TaskFieldsModel,
  RowDD,
  Reorder,
  DayMarkers,
  Sort,
  HolidaysDirective,
  HolidayDirective,
  SortSettings,
  SortSettingsModel,
} from "@syncfusion/ej2-react-gantt";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2/data";

const Gantt = () => {
  const toolbarOptions: ToolbarItem[] = [
    "Add",
    "Edit",
    "Delete",
    "Cancel",
    "Update",
    "PrevTimeSpan",
    "NextTimeSpan",
    "ExpandAll",
    "CollapseAll",
    "Search",
    "Indent",
    "Outdent",
    "ZoomIn",
    "ZoomOut",
    "ZoomToFit",
  ];

  const editOptions: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
  };

  const taskFieldData: TaskFieldsModel = {
    id: "TaskId",
    name: "TaskName",
    startDate: "PlannedStartDate",
    endDate: "PlannedEndDate",
    duration: "Duration",
    progress: "Progress",
    baselineStartDate: "ActualStartDate",
    baselineEndDate: "ActualEndDate",
    dependency: "Predecessor",
    parentID: "ParentId",
  };

  // Initialize DataManager
  const dataManager: DataManager = new DataManager({
    url: "https://localhost:7233/api/Gantt",
    adaptor: new WebApiAdaptor(),
    crossDomain: true,
  });

  const sortingOptions: SortSettingsModel = {
    columns: [{ field: "TaskId", direction: "Descending" }],
  };

  return (
    <div className="p-5">
      <GanttComponent
        loadingIndicator={{ indicatorType: "Shimmer" }}
        dataSource={dataManager}
        taskFields={taskFieldData}
        height="700px"
        timelineSettings={{
          timelineViewMode: "Week",
        }}
        splitterSettings={{ position: "50%" }}
        allowSelection={true}
        toolbar={toolbarOptions}
        allowResizing={true}
        highlightWeekends={true}
        labelSettings={{ taskLabel: "${Progress}%", rightLabel: "TaskName" }}
        baselineColor="orange"
        renderBaseline={true}
        showColumnMenu={true}
        editSettings={editOptions}
        allowRowDragAndDrop={true}
        allowReordering={true}
        allowParentDependency={true}
        sortSettings={sortingOptions}
        allowSorting={true}
      >
        <Inject
          services={[
            Toolbar,
            Selection,
            Filter,
            Edit,
            RowDD,
            Reorder,
            DayMarkers,
            Sort,
          ]}
        />
      </GanttComponent>
    </div>
  );
};

export default Gantt;
