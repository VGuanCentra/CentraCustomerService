export interface EditableLabelProps {
  inputKey: string;
  style?: React.CSSProperties;
  className?: string;
  value: string;
  title: string;
  onSave: (data: { [key: string]: string }) => void;
  iconClass?: string;
  onClick?: () => void;
  hasNoEditButton?: boolean;
  okLabel?: string;
  multiline?: boolean;
  canEdit?: boolean;
}