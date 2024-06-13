import { Spin } from "antd";
import Document from "app/components/atoms/document/document";
import Group from "app/components/atoms/workorderComponents/group";
import UploadIcon from "app/components/atoms/uploadIcon/uploadIcon";
import { useCallback } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { antIcon } from "app/components/atoms/iconLoading/iconLoading";
import { openBlob } from "app/utils/utils";
import { saveAs } from "file-saver";
import useOMPermissions from "app/hooks/useOMPermissions";
import { FEATURE_CODES } from "app/utils/constants";

export default function RemakeAttachments(props) {
  const {
    module,
    documents,
    setDocuments,
    setShowAttachments,
    setShowDeleteFiles,
    isLoading,
  } = props;

  const { permissions: remakeAttachmentPermissions } = useOMPermissions(
    FEATURE_CODES.RemakeAttachments
  );

  const handleDownloadFile = useCallback(
    (fileId) => {
      if (documents) {
        let document = documents.find((x) => x.id === fileId);
        if (document) {
          const binaryData = atob(document.base64);
          const byteArray = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: document.mimeType });
          saveAs(blob, document.name);
        }
      }
    },
    [documents]
  );

  const handlePreviewFile = useCallback(
    (fileId) => {
      if (documents) {
        let document = documents.find((x) => x.id === fileId);
        if (document) {
          let base64 = document.base64;
          if (base64) {
            openBlob(base64, document.mimeType);
          }
        }
      }
    },
    [documents]
  );

  const handleCheckFile = (fileId, value) => {
    setDocuments((d) => {
      let _d = JSON.parse(JSON.stringify(d));
      let index = documents.findIndex((x) => x.id === fileId);
      _d[index].checked = value;
      return _d;
    });
  };

  const deleteDocumentsButtonDisabled = useCallback(() => {
    let result = true;

    if (documents?.length > 0) {
      documents.forEach((d) => {
        if (d.checked) {
          result = false;
        }
      });
    }

    return result;
  }, [documents]);

  const handleDeleteFiles = () => {
    setShowDeleteFiles(true);
  };
  return (
    <Group
      title="Attachments"
      style={{
        minWidth: "21rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      contentStyle={{
        padding: "0.5rem",
        height: "100%",
        overflow: "auto",
      }}
      iconButtonsLeft={
        remakeAttachmentPermissions.canAdd && [
          {
            Icon: () => (
              <UploadIcon
                onClick={() => setShowAttachments(true)}
                color="text-blue-400"
              />
            ),
            callback: () => setShowAttachments(true),
            tooltip: "Upload Documents",
            className: "text-blue-500 hover:text-blue-400",
          },
        ]
      }
      iconButtonsRight={
        remakeAttachmentPermissions.canDelete && [
          {
            Icon: DeleteForeverIcon,
            callback: deleteDocumentsButtonDisabled()
              ? () => {}
              : handleDeleteFiles,
            tooltip: "Delete Document(s)",
            className: deleteDocumentsButtonDisabled()
              ? "text-gray-400"
              : "text-red-600 hover:text-red-400 cursor-pointer",
          },
        ]
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full py-4">
          <span>
            <Spin className="pr-2" indicator={antIcon} /> Loading...
          </span>
        </div>
      ) : (
        <>
          {documents?.map((d, index) => {
            return (
              <Document
                file={d}
                module={module}
                key={`attachment-${index}`}
                onPreview={handlePreviewFile}
                onDownload={handleDownloadFile}
                onCheck={handleCheckFile}
              />
            );
          })}

          {documents?.length === 0 && (
            <div style={{ display: "table", height: "80%" }} className="w-full">
              <div className="table-cell align-middle text-center  text-gray-400">
                {remakeAttachmentPermissions.canAdd ? (
                  <div
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() => setShowAttachments(true)}
                  >
                    <UploadIcon style={{ marginRight: "3px" }} /> Add a document
                  </div>
                ) : (
                  <div className="text-xs">No attachments for this order.</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Group>
  );
}
