/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";

export const ToolTip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: any;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-surface text-secondary-dark">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
