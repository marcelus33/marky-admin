import { toast } from "react-toastify";
import { TypeOptions } from "react-toastify/dist/types";

type ShowNotificationProps = {
  message: string;
  type: TypeOptions | undefined;
};

export const ShowNotification = ({
  message,
  type,
}: ShowNotificationProps): void => {
  const otherProps = {
    theme: "dark",
  };
  toast(message, { type: type, ...otherProps });
};
