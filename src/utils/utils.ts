import { toast } from "react-toastify";
import { TypeOptions } from "react-toastify/dist/types";

type ShowNotificationProps = {
  message: string | undefined;
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

export const displayFormikFormErrors = (error: any, setFieldError: any) => {
  if (error.errors) {
    Object.entries(error.errors).forEach(([fieldName, messages]) => {
      if (Array.isArray(messages)) {
        setFieldError(fieldName, messages[0]);
      } else {
        setFieldError(fieldName, messages);
      }
    });
  }
};
