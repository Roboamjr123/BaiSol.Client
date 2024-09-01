import { IAvailableFacilitators } from "../../../lib/API/PersonnelAPI";
import { useDrag } from "react-dnd";
import { ItemType } from "./FacilitatorMain";


const FacilitatorDragItem: React.FC<{
  facilitator: IAvailableFacilitators;
  index: number;
}> = ({ facilitator, index }) => {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: { index },
  }));

  return (
    <div ref={drag} className="flex flex-col cursor-pointer hover:bg-gray-100 focus-visible:bg-gray-300">
      <span className="font-semibold tracking-widest">
        {facilitator.userName}
      </span>
      <span className="text-xs text-gray-400 tracking-tight">
        {facilitator.email}
      </span>
    </div>
  );
};

export default FacilitatorDragItem;
