import { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import styles from "./serviceOrder.module.css";
import { LocationIcon } from "app/utils/icons";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";

export default function CustomerInfoSection(props) {
  const { inputData } = props;
  const [showMap, setShowMap] = useState(false);
  const [latitude, setLatitude] = useState(49.18103828678011); // Map defaults to Centra Langley
  const [longitude, setLongitude] = useState(-122.6618332736532);

  useEffect(() => {
    if (inputData && inputData?.address && Geocode && showMap) {
      Geocode.setLocationType("ROOFTOP");
      Geocode.setLanguage("en");
      Geocode.setApiKey("AIzaSyAhsQnBPh07vYae9Oakwczkyv8gTDY9j-U");

      Geocode.fromAddress(inputData?.address).then(
        (response) => {
          const { lat, lng } = response?.results[0]?.geometry?.location;
          setLatitude(lat);
          setLongitude(lng);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [inputData, showMap]);

  const MapWithAMarker = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        defaultZoom={14}
        defaultCenter={{ lat: latitude, lng: longitude }}
      >
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>
    ))
  );

  return (
    <>
      {inputData?.address && (
        <div>
          <div
            className={styles.customerInfoIcon}
            style={{ display: "inline" }}
          >
            <i className="bi bi-house" />
          </div>
          <div className={styles.address}>
            {inputData.address}
            <span
              className={`${styles.mapIcon}`}
              onClick={() => {
                setShowMap(true);
              }}
            >
              <Tooltip title="Show Map">
                <LocationIcon />
              </Tooltip>
            </span>
          </div>
        </div>
      )}
      {inputData?.homePhone && (
        <div style={{ paddingRight: "0.7rem" }}>
          <div
            className={styles.customerInfoIcon}
            style={{ display: "inline" }}
          >
            <i className="bi bi-telephone"></i>
          </div>
          <a href={`tel:${inputData.homePhone}`}>{inputData.homePhone}</a>
        </div>
      )}
      {inputData?.cellPhone && (
        <div style={{ paddingRight: "0.7rem" }}>
          <div
            className={styles.customerInfoIcon}
            style={{ display: "inline" }}
          >
            <i className="bi bi-phone"></i>
          </div>
          <a href={`tel:${inputData.cellPhone}`}>{inputData.cellPhone}</a>
        </div>
      )}
      {inputData?.email && (
        <div>
          <div
            className={styles.customerInfoIcon}
            style={{ display: "inline" }}
          >
            <i className="bi bi-envelope"></i>
          </div>
          <a href={`mailto:${inputData.email}`} style={{ display: "inline" }}>
            {inputData.email}
          </a>
        </div>
      )}

      <Modal
        open={showMap}
        onClose={() => {
          setShowMap(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: "3px",
          }}
          className={styles.mapModal}
        >
          <div style={{ height: "400px", width: "100%" }}>
            <MapWithAMarker
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAhsQnBPh07vYae9Oakwczkyv8gTDY9j-U&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
}
