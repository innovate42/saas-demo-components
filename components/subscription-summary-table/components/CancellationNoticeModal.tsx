import * as React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material"
import "../styles/index.css"

type CancellationNoticeModalProps = {
  open: boolean
  onClose: () => void
  onConfirmRequest: () => void
  modalTitle: string
  modalBody: string
  confirmButtonText: string
  cancelButtonText: string
}

export function CancellationNoticeModal({
  open,
  onClose,
  onConfirmRequest,
  modalTitle,
  modalBody,
  confirmButtonText,
  cancelButtonText
}: CancellationNoticeModalProps): React.JSX.Element {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="subscription-modal">
      <DialogTitle className="modal-title">{modalTitle}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="#4D5359">
          {modalBody}
        </Typography>
      </DialogContent>
      <DialogActions className="modal-actions">
        <Button onClick={onClose} variant="outlined" className="modal-btn-cancel">
          {cancelButtonText}
        </Button>
        <Button onClick={onConfirmRequest} variant="contained" className="modal-btn-confirm">
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
