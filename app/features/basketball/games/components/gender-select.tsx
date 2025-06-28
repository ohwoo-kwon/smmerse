import { useSearchParams } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";

import { genderTypeMap } from "../constants";
import { genderTypeEnum } from "../schema";

export function GenderSelect() {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultValue = searchParams.get("genderType") || "all";
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(genderType) => {
        genderType === "all"
          ? searchParams.delete("genderType")
          : searchParams.set("genderType", genderType);
        setSearchParams(searchParams);
      }}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">전체</SelectItem>
        {genderTypeEnum.enumValues.map((value) => (
          <SelectItem key={value} value={value}>
            {genderTypeMap[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
