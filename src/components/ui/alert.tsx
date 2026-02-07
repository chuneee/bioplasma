import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

const AlertMessage = (
  props: React.ComponentProps<"div"> & {
    type?: "success" | "warning" | "error" | "info";
    title?: string;
    message: string;
  },
) => {
  const classNamesAlertType = {
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-[var(--color-warning)]",
    error: " bg-red-100 text-[var(--color-error)]",
    info: " bg-blue-100 text-blue-800",
  };

  const stylesAlert = classNamesAlertType[props.type || "info"];

  return (
    <div className={"rounded-lg border px-4 py-3" + stylesAlert}>
      <div>
        {props.title && <strong>{props.title}</strong>}
        <p style={{ fontSize: "14px" }}>{props.message || ""}</p>
      </div>
    </div>
  );
};

const AlertErrorInput = (
  props: React.ComponentProps<"div"> & {
    type?: "error" | "success";
    message: string;
  },
) => {
  const classNamesAlertType = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 border-[var(--color-error)] text-[var(--color-error)]",
  };

  const stylesAlert = classNamesAlertType[props.type || "error"];

  return (
    <div className={`rounded-lg  px-3 py-1 mt-1 ${stylesAlert}`}>
      <div>
        <strong style={{ fontSize: "14px" }}>{props.message || ""}</strong>
      </div>
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription, AlertMessage, AlertErrorInput };
