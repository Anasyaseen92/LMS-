import { type ComponentType, type FC } from "react";
import { Modal, Box } from "@mui/material";

type ModalComponentProps = {
  setOpen: (open: boolean) => void;
  setRoute?: (route: string) => void;
  refetch?: () => void;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  component: ComponentType<ModalComponentProps>;
  setRoute?: (route: string) => void;
  refetch?: () => void;
};

const CustomModel: FC<Props> = ({
  open,
  setOpen,
  setRoute,
  component: Component,
  refetch,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch} />
      </Box>
    </Modal>
  );
};

export default CustomModel;
