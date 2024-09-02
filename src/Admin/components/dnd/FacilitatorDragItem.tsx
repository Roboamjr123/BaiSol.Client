import { IAvailableFacilitators } from "../../../lib/API/PersonnelAPI";
import { useDrag } from "react-dnd";
import { ItemType } from "./FacilitatorMain";
import { formatName } from "../../../lib/utils/functions";


const FacilitatorDragItem: React.FC<{
  facilitator: IAvailableFacilitators;
  index: number;
}> = ({ facilitator, index }) => {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: { index },
  }));

  return (
    <div ref={drag} className="flex flex-col cursor-pointer hover:bg-gray-100 mb-2 focus-visible:bg-gray-300">
      <span className="font-semibold text-sm tracking-widest">
        {formatName(facilitator.userName)}
      </span>
      <span className="text-xs text-gray-400 tracking-tight">
        {facilitator.email}
      </span>
    </div>
  );
};

export default FacilitatorDragItem;
