import Tooltip from "app/components/atoms/tooltip/tooltip";
import { convertToLocaleDateTimelll } from "app/utils/date";
import UserLabel from "../users/userLabel";

export default function ReturnTripView(props) {
  const { returnTrip, disabled, onEditClick, onDeleteClick } = props;
  return (
    <div className="w-full flex-col rounded-sm shadow-sm">
      <div className="flex space-x-2 items-center justify-between rounded-t-sm p-2">
        <div className="flex items-center space-x-2">
          <UserLabel username={returnTrip.createdBy} showLabel={false} />
          <div className="text-gray-500">
            {convertToLocaleDateTimelll(returnTrip.startDate)} to{" "}
            {convertToLocaleDateTimelll(returnTrip.endDate)}
          </div>
        </div>
        <div className="flex space-x-2 items-center pr-1">
          {!disabled && (
            <>
              <Tooltip title="Edit Return Trip">
                <i
                  className="fa-solid fa-pen cursor-pointer opacity-20 hover:opacity-100"
                  onClick={() => onEditClick(returnTrip)}
                />
              </Tooltip>

              <Tooltip title="Delete Return Trip">
                <i
                  className="fa-solid fa-trash cursor-pointer opacity-20 hover:opacity-100"
                  onClick={() => onDeleteClick(returnTrip.id)}
                />
              </Tooltip>
            </>
          )}
        </div>
      </div>
      {returnTrip.reason && (
        <div className="p-2 text-sm">{returnTrip.reason}</div>
      )}
    </div>
  );
}
