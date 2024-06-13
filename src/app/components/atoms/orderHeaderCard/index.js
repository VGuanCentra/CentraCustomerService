import { Button, Popover } from "antd";

export default function OrderHeaderCard(props) {
  const { orderId, label = "", handleShare, isReadOnly = true } = props;

  const content = () => {
    return (
      <Button
        className="text-xs"
        type="text"
        size="small"
        onClick={() => handleShare(orderId)}
        disabled={handleShare === null || handleShare === undefined}
      >
        <i className="fas fa-link text-xs"></i>
        <span className="pl-2 text-xs">Copy Link</span>
      </Button>
    );
  };

  return (
    <>
      <div
        className={`
      bg-slate-200 rounded font-bold p-1
       flex justify-between items-center text-sm`}
        style={{ color: "var(--centrablue)" }}
      >
        <Popover placement="bottomLeft" title={""} content={content}>
          <>
            <i className="fa-regular fa-rectangle-list pr-2 pl-1 align-sub"></i>
            <span className="pr-1 align-sub font-semibold">{label}</span>
          </>
        </Popover>
      </div>
    </>
  );
}
