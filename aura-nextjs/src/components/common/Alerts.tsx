import { AlertCircle } from "lucide-react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertErrorProps } from "@/interfaces/props";
import { useEffect, useState } from "react";

export const AlertError = (props: AlertErrorProps) => {
  const { description, className, duration } = props;
  const [show, setShow] = useState(true);
  // const title = props.title || "خطاء";
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, duration || 5000);
  }, [duration]);
  return show ? (
    <Alert
      variant="default"
      className={` bg-white border-primary ${className}`}
    >
      <AlertCircle className="h-6 w-6" />
      <AlertTitle className="text-lg font-[400]">{description}</AlertTitle>
      {/* <AlertDescription className="text-sm">{description}</AlertDescription> */}
    </Alert>
  ) : null;
};
