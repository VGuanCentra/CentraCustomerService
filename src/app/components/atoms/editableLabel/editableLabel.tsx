import React, { useState, useCallback, useEffect, FC } from "react";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import LockButton from "app/components/atoms/lockButton/lockButton";
import Title from "app/components/atoms/title/title";
import { Button, Popover, Space, Input } from "antd";
import { EditableLabelProps } from "app/utils/interfaces";

const EditableLabel: FC<EditableLabelProps> = (props) => {
  const {
    inputKey,
    style,
    className = "",
    value,
    title,
    onSave,
    iconClass = "",
    onClick,
    hasNoEditButton,
    okLabel,
    multiline,
    canEdit
  } = props;

  const [inputValue, setInputValue] = useState<string>(value);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSave = useCallback(
    () => {
      onSave({ [inputKey]: inputValue });
      setOpen(false);
    },
    [inputKey, inputValue, onSave]
  );

  const content = (
    <div>
      <Title
        label={title}
        className="inline-block mr-4 pt-1 pb-1 mb-3 pr-2"
        Icon={() => {
          return <i className="fa-solid fa-pen pr-2" />;
        }}
      ></Title>
      {!multiline && (
        <Input className="mb-3" value={inputValue} onChange={onChange} />
      )}
      {multiline && (
        <Input.TextArea
          className="mb-3"
          rows={4}
          value={inputValue}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
        />
      )}
      <div className="flex w-100 justify-end">
        <Space>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <LockButton
            onClick={handleSave}
            disabled={!canEdit || value === inputValue}
            showLockIcon={!canEdit}
            label={okLabel || "Save"}
          />
        </Space>
      </div>
    </div>
  );

  return (
    <div className={`${className} flex flex-row`} style={style}>
      <span
        className={`pr-1 ${
          hasNoEditButton ? "hover:text-blue-500 hover:cursor-pointer" : ""
        }`}
        onClick={hasNoEditButton ? () => setOpen(true) : onClick}
      >
        {/* 
        VGuan Debug: Property 'children' does not exist on type 'EditableLabelProps'.
        <Tooltip title={hasNoEditButton ? title : ""}>{props.children}</Tooltip>
        */}
        <Tooltip title={hasNoEditButton ? title : ""}>{props.title}</Tooltip>
      </span>
      <Tooltip title={title}>
        <Popover
          content={content}
          trigger="click"
          visible={open}
          onVisibleChange={setOpen}
        >
          <div
            className={`${iconClass} ${
              hasNoEditButton ? "opacity-0" : "opacity-100"
            }`}
          >
            <i
              className={`fa-solid fa-pen hover:text-blue-600 hover:cursor-pointer`}
              style={{ fontSize: "0.6rem" }}
              onClick={() => setOpen(true)}
            ></i>
          </div>
        </Popover>
      </Tooltip>
    </div>
  );
};

export default EditableLabel;
