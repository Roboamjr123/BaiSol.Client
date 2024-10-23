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
  UndoRedo,
  ColumnDirective,
  ColumnsDirective,
  EditDialogFieldsDirective,
  EditDialogFieldDirective,
} from "@syncfusion/ej2-react-gantt";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2/data";
import { useParams } from "react-router-dom";
import { useUpdateProjectToOnWork } from "../../../lib/API/Project/ProjectApi";
import { useEffect } from "react";

const Gantt: React.FC<{ isOnProcess: boolean }> = ({ isOnProcess }) => {
  const toolbarOptions: ToolbarItem[] = isOnProcess
    ? [
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
      ]
    : [
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

  const { projId } = useParams<{ projId: string }>();

  const dataManager: DataManager = new DataManager({
    url: `https://localhost:7233/api/Gantt/${projId}`,
    adaptor: new WebApiAdaptor(),
    crossDomain: true,
  }); 
  
  // Helper function to format date as 'MM dd, yyyy'
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };


  const sortingOptions: SortSettingsModel = {
    columns: [{ field: "TaskId", direction: "Descending" }],
  };

  return (
    <div className="p-5">
      <GanttComponent
        projectStartDate={new Date("2024-10-23")}
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
        allowRowDragAndDrop={isOnProcess}
        allowReordering={true}
        allowParentDependency={true}
        sortSettings={sortingOptions}
        // allowSorting={true}
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
            // Sort,
            UndoRedo,
          ]}
        />
        <ColumnsDirective>
          <ColumnDirective field="TaskId"></ColumnDirective>
          <ColumnDirective
            field="TaskName"
            headerText="Task Name"
          ></ColumnDirective>
          <ColumnDirective field="PlannedStartDate"></ColumnDirective>
          <ColumnDirective field="PlannedEndDate"></ColumnDirective>
          <ColumnDirective field="Duration"></ColumnDirective>
        </ColumnsDirective>

        <EditDialogFieldsDirective>
          <EditDialogFieldDirective
            type="General"
            headerText="General"
            fields={[
              "TaskID",
              "TaskName",
              "PlannedStartDate",
              "PlannedEndDate",
            ]}
          ></EditDialogFieldDirective>
          <EditDialogFieldDirective type="Dependency"></EditDialogFieldDirective>
        </EditDialogFieldsDirective>
      </GanttComponent>
    </div>
  );
};

export default Gantt;
