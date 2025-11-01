import { XIcon } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";

import { cityEnum } from "~/features/gyms/schema";

import { sidoObject } from "../lib/address";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";

export default function CityDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sidos = searchParams.get("sidos")?.split(",");
  let initSido = "";
  if (!sidos) {
    initSido = "";
  } else if (sidos.length === 1) {
    initSido = sidos[0];
  } else {
    initSido = `지역 ${sidos.length}`;
  }

  const [selected, setSelected] = useState<string[]>([]);
  const [sido, setSido] = useState("");
  const [guGuns, setGuGUns] = useState<string[] | undefined>([]);

  const onClickSido = (sido: string) => {
    setSido(sido);
    // 전국 클릭 시
    if (!sido) setSelected([]);
    const cities = sidoObject
      .find(({ name }) => name === sido)
      ?.cities.map(({ name }) => name);
    setGuGUns(cities);
  };

  const onClickGuGun = (gugun: string) => {
    if (!sido) return;
    const newSelected = gugun ? `${sido} ${gugun}` : `${sido}`;

    setSelected((prev) => {
      if (!gugun) {
        // 전체 클릭 해제
        if (prev.includes(newSelected))
          return prev.filter((value) => value !== newSelected);
        // 전체 클릭
        else return [...prev.filter((value) => !value.includes(sido)), sido];
      } else {
        // 구군 클릭 해제
        if (prev.includes(newSelected))
          return prev.filter((value) => value !== newSelected);
        // 구군 클릭
        else return [...prev.filter((value) => value !== sido), newSelected];
      }
    });
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "" || value === false) newParams.delete(key);
    else newParams.set(key, value.toString());

    setSearchParams(newParams);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant={initSido ? "default" : "outline"}
          className={cn("rounded-full", initSido ? "" : "text-neutral-400")}
          size="sm"
        >
          {initSido || "전국"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-left">지역</DrawerTitle>
          <DrawerDescription className="flex flex-wrap gap-1">
            {selected.length > 0
              ? selected.map((v) => (
                  <Badge
                    key={v}
                    variant="secondary"
                    onClick={() => {
                      setSelected((prev) => {
                        return prev.filter((value) => value !== v);
                      });
                    }}
                  >
                    <XIcon /> {v}
                  </Badge>
                ))
              : "지역을 선택해주세요."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex">
          <ScrollArea className="h-70 flex-1">
            <div className="flex flex-col">
              <div
                className={cn(
                  "border-b py-1 text-center",
                  selected.length !== 0 ? "" : "bg-primary/40",
                )}
                onClick={() => onClickSido("")}
              >
                전국
              </div>
              {cityEnum.enumValues.map((city) => {
                const isAll = selected.find((value) => value === city);
                const citysGugun = sidoObject
                  .find(({ name }) => name === city)
                  ?.cities.map(({ name }) => name);
                const selectedCount = isAll
                  ? citysGugun?.length
                  : selected.filter((value) => value.includes(city)).length;

                return (
                  <div
                    key={city}
                    className={cn(
                      "relative border-b py-1 text-center last:border-none",
                      selectedCount ? "bg-primary/40" : "",
                    )}
                    onClick={() => onClickSido(city)}
                  >
                    {city}{" "}
                    {selectedCount ? (
                      <p className="bg-muted text-muted-foreground absolute top-2 right-2 flex size-4 items-center justify-center rounded-full text-xs">
                        {selectedCount}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          {sido ? (
            <ScrollArea className="h-70 flex-1">
              <div className="border-l">
                <div
                  className={cn(
                    "border-b py-1 text-center",
                    selected.includes(`${sido}`) ? "bg-primary/40" : "",
                  )}
                  onClick={() => onClickGuGun("")}
                >
                  전체
                </div>
                {guGuns?.map((value) => (
                  <div
                    key={value}
                    className={cn(
                      "border-b py-1 text-center last:border-none",
                      selected.includes(`${sido} ${value}`)
                        ? "bg-primary/40"
                        : "",
                    )}
                    onClick={() => onClickGuGun(value)}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : null}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                if (selected.length === 0) newParams.delete("sidos");
                else newParams.set("sidos", selected.join(","));

                setSearchParams(newParams);
              }}
            >
              적용
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="secondary">취소</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
