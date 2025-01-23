import React from "react";
import { Dialog,IconButton, DialogTitle, DialogContent, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "/home/user/Desktop/project/app/frontend/src/styles/style.css";

export const MessageModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{marginTop:2}}>
      <DialogTitle sx={{ fontWeight:"bold"}}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent >
      <Box sx={{  justifyContent: "left"}}>
        {children}
        </Box>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions> */}
      </Box>
    </Dialog>
  );
};
