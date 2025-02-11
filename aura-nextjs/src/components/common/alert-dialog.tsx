import React, { JSX } from "react";
import Image from "next/image";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ButtonPrimary, ButtonSecondary } from "./Buttons";

interface alertDialogElementProps {
  children: JSX.Element;
  onClick?: VoidFunction;
  open?: boolean;
  type?: string;
  header?: string;
  body?: string;
  action?: VoidFunction | undefined;
  action_text?: string | "تأكيد";
  cancel?: string | "إلغاء";
}

function AlertDialogElement(props: alertDialogElementProps) {
  const [open, setOpen] = React.useState(props.open);

  function Open() {
    if (props.onClick) {
      props.onClick();
    }
    setOpen(!open);
  }

  async function action() {
    if (props.action) {
      await props.action();
    }
    setOpen(!open);
  }
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger asChild onClick={Open}>
        {props.children}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          id="overlay"
          className="fixed -top-300 z-50 bottom-0 inset-0 bg-black/70 data-[state=open]:animate-overlayShow"
          onClick={Open}
        />
        <AlertDialog.Content className="flex-col z-50 text-center items-center justify-between justify-items-center fixed left-1/2 top-1/2 max-h-[286px] w-[283px] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
          <AlertDialog.Title className="m-0 text-[17px] font-medium text-mauve12 text-center">
            {props.header}
          </AlertDialog.Title>
          <AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal text-mauve11">
            {props.body}
          </AlertDialog.Description>
          <div className="flex flex-col justify-between w-[95px] gap-6 items-center text-center">
            {props.action && (
              <AlertDialog.Action asChild>
                <ButtonPrimary handleClick={action}>
                  {props.action_text}
                </ButtonPrimary>
              </AlertDialog.Action>
            )}
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
