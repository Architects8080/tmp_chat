import { useSnackbar, VariantType, WithSnackbarProps } from "notistack";

let useSnackbarRef: WithSnackbarProps;
export const SnackbarUtilsConfigurator = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

export default {
  success(message: string) {
    this.toast(message, "success");
  },
  warning(message: string) {
    this.toast(message, "warning");
  },
  info(message: string) {
    this.toast(message, "info");
  },
  error(message: string) {
    this.toast(message, "error");
  },
  toast(message: string, variant: VariantType = "default") {
    useSnackbarRef.enqueueSnackbar(message, {
      variant: variant,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  },
};

//<button onClick={() => {Snackbar.success("success")}}
