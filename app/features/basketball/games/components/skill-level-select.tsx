import { useSearchParams } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";

import { basketballSkillLevelMap } from "../constants";
import { basketballSkillLevelEnum } from "../schema";

export function SkillLevelSelect() {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultValue = searchParams.get("level") || "all";
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(level) => {
        level === "all"
          ? searchParams.delete("level")
          : searchParams.set("level", level);
        setSearchParams(searchParams);
      }}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">전체</SelectItem>
        {basketballSkillLevelEnum.enumValues.map((value) => (
          <SelectItem key={value} value={value}>
            {basketballSkillLevelMap[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
