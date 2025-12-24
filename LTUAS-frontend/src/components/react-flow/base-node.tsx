import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";
import { NodeStatus } from "./node-status-indicator";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";

interface baseNodeProps extends HTMLAttributes<HTMLDivElement> {
  status?: NodeStatus;
}

export const BaseNode = forwardRef<
  HTMLDivElement,
  baseNodeProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-sm border border-muted-foreground bg-card text-card-foreground hover:bg-accent shadow-md border-none transition-all",
      className,
    )}
    tabIndex={0}
    {...props}
  >
    {props.children}

    {/* Floating status badge */}
    {props.status && props.status !== "initial" && (
      <div
        className={cn(
          "border absolute -top-8 z-10 flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium shadow-lg transition-all animate-in fade-in zoom-in duration-200",
          props.status === "error" && "bg-rose-100 border-rose-400 text-rose-600",
          props.status === "success" && "bg-emerald-100 border-emerald-400 text-emerald-600",
          props.status === "loading" && "bg-sky-100 border-blue-400 text-blue-600"
        )}
      >
        {props.status === "error" && (
          <div className="flex items-center gap-1">
            <XCircleIcon className="w-4 h-4 flex-none" />
            <span>Error</span>
          </div>
        )}
        {props.status === "success" && (
          <div className="flex items-center gap-1">
            <CheckCircle2Icon className="w-4 h-4 flex-none" />
            <span>Success</span>
          </div>
        )}
        {props.status === "loading" && (
          <div className="flex items-center gap-1">
            <Loader2Icon className="w-4 h-4 flex-none animate-spin translate-y-2 translate-x-1" />
            <span>Running</span>
          </div>
        )}
      </div>
    )}
  </div>
));
BaseNode.displayName = "BaseNode";

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export const BaseNodeHeader = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    {...props}
    className={cn(
      "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
      className,
    )}
  />
));
BaseNodeHeader.displayName = "BaseNodeHeader";

/**
 * The
  />
));
BaseNodeHeader.displayName = "BaseNodeHeader";

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export const BaseNodeHeaderTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="base-node-title"
    className={cn("user-select-none flex-1 font-semibold", className)}
    {...props}
  />
));
BaseNodeHeaderTitle.displayName = "BaseNodeHeaderTitle";

export const BaseNodeContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="base-node-content"
    className={cn("flex flex-col gap-y-2 p-3", className)}
    {...props}
  />
));
BaseNodeContent.displayName = "BaseNodeContent";

export const BaseNodeFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="base-node-footer"
    className={cn(
      "flex flex-col items-center gap-y-2 border-t px-3 pb-3 pt-2",
      className,
    )}
    {...props}
  />
));
BaseNodeFooter.displayName = "BaseNodeFooter";
