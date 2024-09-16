import { Box, Fade, Modal } from '@mui/material';
import { styled } from '@mui/system';

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  width: '80%',
  maxWidth: 500,
  maxHeight: '90vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export default function CustomModal({ open, handleClose, child, width }: any) {
  return (
    <Modal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <ModalContent sx={{ width: width || 500 }}>
          {child}
        </ModalContent>
      </Fade>
    </Modal>
  );
}
