import Group from "app/components/atoms/workorderComponents/group";
import LabelItem from "app/components/atoms/workorderComponents/labelItem";
import { openWOLink } from "app/utils/utils";

export default function RemakeProductionItem(props) {
  const { inputData } = props;

  const onWOClick = () => {
    openWOLink(inputData?.workOrderNo);
  };

  return (
    <Group
      title={"Production Item"}
      style={{
        minWidth: "21rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      contentStyle={{
        padding: "0.5rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        rowGap: "0.3rem",
        height: "100%",
      }}
    >
      <LabelItem
        label={"WO No."}
        value={inputData?.workOrderNo}
        leftAlign={true}
        isValueBold={true}
        style={{ color: "var(--centrablue)" }}
        onClick={onWOClick}
      />

      <LabelItem
        label={"Item No."}
        value={inputData?.itemNo}
        emphasizeValue={true}
        leftAlign={true}
        isValueBold={true}
      />
      <LabelItem label={"Branch"} value={inputData?.branch} leftAlign={true} />
      <LabelItem
        label={"System"}
        value={inputData?.systemValue}
        leftAlign={true}
      />
      <LabelItem label={"Size"} value={inputData?.size} leftAlign={true} />
      <LabelItem
        label={"Sub Quantity"}
        value={inputData?.subQty}
        leftAlign={true}
      />
      <LabelItem
        label={"Description"}
        value={inputData?.description}
        leftAlign={true}
      />
    </Group>
  );
}
