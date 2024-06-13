export default function OrdersMenuItem(props) {
  const { onClick, selected } = props;

  return (
    <div
      className={`rounded-sm cursor-pointer duration-300 ease-in-out hover:bg-blue-100 hover:text-centraBlue py-2 pl-2 flex w-full items-center justify-between ${
        selected ? "bg-blue-100 text-centraBlue" : ""
      }`}
      onClick={onClick}
    >
      {props.children}
    </div>
  );
}
