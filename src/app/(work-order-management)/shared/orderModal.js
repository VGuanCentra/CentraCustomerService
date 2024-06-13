import { Modal, Box } from "@mui/material";

export default function OrderModal(props) {
  const { open, onClose, isMobile } = props;

  return (
    <Modal open={open} onClose={onClose} BackdropProps={{ onClick: undefined }}>
      {isMobile ? (
        <Box
          sx={{
            position: "absolute",
            width: "100vw",
            height: "100%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1,
          }}
        >
          {props.children}
        </Box>
      ) : (
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
        >
          {props.children}
        </Box>
      )}
    </Modal>
  );
}
