import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ButtonPrimary, ButtonSecondary } from "./Buttons";

interface alertDialogElementProps {
  trigger: string;
  header?: string;
  body?: string;
  action?: VoidFunction | undefined;
  action_text?: string | "تأكيد";
  cancel?: string | "إلغاء";
}

function AlertDialogElement(props: alertDialogElementProps) {
  const [open, setOpen] = React.useState(false);

  // React.useEffect(() => {
  // const overlay = document.getElementById('win');
  // // /console.log('ovelay is', overlay);
  //     window.addEventListener('click', () => {
  //         setOpen(false);
  //     });
  //     return () => {
  //         window.removeEventListener('click', () => {
  //             setOpen(false);
  //         });
  //     }
  // }, []);

  function Open() {
    setOpen(!open);
  }

  if (!props.action) {
    props.action = Open;
  }
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger asChild>
        <ButtonPrimary handleClick={Open}>{props.trigger}</ButtonPrimary>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          id="overlay"
          className="fixed inset-0 bg-black/70 data-[state=open]:animate-overlayShow"
        />
        <AlertDialog.Content className="flex-col text-center items-center justify-between justify-items-center fixed left-1/2 top-1/2 max-h-[286px] w-[283px] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
          <AlertDialog.Title className="m-0 text-[17px] font-medium text-mauve12 text-center">
            {props.header}
          </AlertDialog.Title>
          <AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal text-mauve11">
            {props.body}
          </AlertDialog.Description>
          <div className="flex flex-col justify-between w-[95px] min-h-[136px] items-center text-center">
            <AlertDialog.Action asChild>
              <ButtonPrimary handleClick={props.action}>
                {props.action_text}
              </ButtonPrimary>
            </AlertDialog.Action>
            <AlertDialog.Cancel asChild>
              <ButtonSecondary variant="outline" handleClick={Open}>
                {props.cancel}
              </ButtonSecondary>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default AlertDialogElement;
