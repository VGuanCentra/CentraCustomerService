"use client";
import React, { useEffect, useState } from "react";
import PhotoGallery from "app/components/organisms/photoGallery/photoGallery";
import Group from "app/components/atoms/workorderComponents/group";
import styles from "../serviceWorkorder.module.css";
import { Spin } from "antd";
import UploadIcon from "app/components/atoms/uploadIcon/uploadIcon";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { antIcon } from "app/components/atoms/iconLoading/iconLoading";
import useOMPermissions from "app/hooks/useOMPermissions";
import { FEATURE_CODES } from "app/utils/constants";

export default function ServicePhotos(props) {
  const {
    photos,
    tempPhotos,
    setTempPhotos,
    handlePhotosOk,
    handlePhotosDelete,
    containsNewUnsavedImages,
    setContainsNewUnsavedImages,
    showPhotoUpload,
    setShowPhotoUpload,
    showDeletePhotos,
    setShowDeletePhotos,
    selectedPhotos,
    setSelectedPhotos,
    isLoading,
  } = props;

  const { permissions: servicePhotoPermissions } = useOMPermissions(
    FEATURE_CODES.ServicePhotos
  );

  const [deletePhotosButtonDisabled, setDeletePhotosButtonDisabled] =
    useState(true);

  const handleDeleteFiles = () => {
    setShowDeletePhotos(true);
  };

  useEffect(() => {
    if (selectedPhotos.length > 0) setDeletePhotosButtonDisabled(false);
    else setDeletePhotosButtonDisabled(true);
  }, [selectedPhotos]);

  return (
    <>
      <Group
        id={"title-photos"}
        title={"Photo Gallery"}
        style={{ minWidth: "12rem", display: "flex", flexDirection: "column" }}
        contentStyle={{
          padding: "0.5rem",
          //height: "calc(100% - 30px)",
          //maxHeight: "30vh",
          height: "100%",
          overflow: "auto",
        }}
        iconButtonsLeft={
          servicePhotoPermissions.canAdd && [
            {
              Icon: () => (
                <UploadIcon
                  color="text-blue-500"
                  onClick={() => setShowPhotoUpload(true)}
                />
              ),
              tooltip: "Upload Photos",
              className: "text-blue-500 hover:text-blue-400",
            },
          ]
        }
        iconButtonsRight={
          servicePhotoPermissions.canDelete && [
            {
              Icon: DeleteForeverIcon,
              callback: deletePhotosButtonDisabled
                ? () => {}
                : handleDeleteFiles,
              tooltip: "Delete Document(s)",
              className: deletePhotosButtonDisabled
                ? "text-gray-400"
                : "text-red-600 hover:text-red-400 cursor-pointer",
            },
          ]
        }
        className={styles.groupOptions}
      >
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full py-4">
            <span>
              <Spin className="pr-2" indicator={antIcon} /> Loading...
            </span>
          </div>
        ) : (
          <>
            <PhotoGallery
              photos={photos}
              uploadPhotos={handlePhotosOk}
              deletePhotos={handlePhotosDelete}
              tempPhotos={tempPhotos}
              setTempPhotos={setTempPhotos}
              containsNewUnsavedImages={containsNewUnsavedImages}
              setContainsNewUnsavedImages={setContainsNewUnsavedImages}
              showPhotoUpload={showPhotoUpload}
              setShowPhotoUpload={setShowPhotoUpload}
              showDeletePhotos={showDeletePhotos}
              setShowDeletePhotos={setShowDeletePhotos}
              selectedPhotos={selectedPhotos}
              setSelectedPhotos={setSelectedPhotos}
              canAdd={servicePhotoPermissions.canAdd}
            />
          </>
        )}
      </Group>
    </>
  );
}
