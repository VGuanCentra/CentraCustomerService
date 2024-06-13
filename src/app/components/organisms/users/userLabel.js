import UserAvatar from "./userAvatar";
import Tooltip from "app/components/atoms/tooltip/tooltip";

export default function UserLabel(props) {
  const { username, size, showLabel = true } = props;

  return (
    <div
      className={`flex items-center space-x-2 text-ellipsis 
      ${size}`}
    >
      <UserAvatar username={username} />

      {showLabel && <div>{`${username}`}</div>}
    </div>
  );
}
