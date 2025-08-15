import type { CheckedState } from "@radix-ui/react-checkbox";

import { useState } from "react";

import { buttonVariants } from "~/core/components/ui/button";
import { Checkbox } from "~/core/components/ui/checkbox";
import { Label } from "~/core/components/ui/label";
import { cn } from "~/core/lib/utils";

export default function PostionCheckbox({
  defaultChecked,
  position,
}: {
  defaultChecked: boolean;
  position: string;
}) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleCheckedChange = (checked: CheckedState) => {
    setIsChecked(checked === true);
  };

  return (
    <div className="w-full">
      <Checkbox
        id={position}
        name={position}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className="sr-only"
      />
      <Label
        htmlFor={position}
        className={cn(
          buttonVariants({ variant: isChecked ? "default" : "outline" }),
          "w-full cursor-pointer",
        )}
      >
        {position}
      </Label>
    </div>
  );
}
