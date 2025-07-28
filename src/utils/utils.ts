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

export function splitISODateTime(iso?: string) {
  if (!iso) return { date: ``, time: `` };
  const d = new Date(iso);
  // “toISOString” always yields “YYYY-MM-DDTHH:mm:ss.sssZ”
  const [date, timeWithRest] = d.toISOString().split(`T`);
  // grab only the “HH:mm”
  const time = timeWithRest.slice(0, 5);
  return { date, time };
}
