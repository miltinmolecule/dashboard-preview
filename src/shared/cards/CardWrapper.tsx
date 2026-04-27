import { cn } from "@/utils/cn";
import React from "react";

type CardWrapperProps = {
  padding?: string;
  children?: React.ReactNode;
};
const CardWrapper = ({ padding, children }: CardWrapperProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100",
        padding ? padding : "p-6",
      )}
    >
      {children}
    </div>
  );
};

export default CardWrapper;
