import { XIcon } from "lucide-react";
import { useSearchParams } from "react-router";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/core/components/ui/sheet";
import { sidoObject } from "~/core/lib/address";

export default function SidoFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sidos = searchParams.get("sido") || "";
  const cities = searchParams.get("city") || "";

  const selected = [];
  if (sidos)
    selected.push(
      ...sidos.split(",").map((sido) => ({ type: "sido", name: sido })),
    );
  if (cities)
    selected.push(
      ...cities.split(",").map((city) => ({ type: "city", name: city })),
    );

  const changeSidos = (sidoName: string, citiesArr?: string[]) => {
    if (!sidos.includes(sidoName) && citiesArr) {
      const newCities = cities
        .split(",")
        .filter((city) => !citiesArr.includes(city))
        .join(",");
      newCities
        ? searchParams.set("city", newCities)
        : searchParams.delete("city");
    }
    if (sidos) {
      const newSidos = sidos.includes(sidoName)
        ? sidos
            .split(",")
            .filter((sido) => sido !== sidoName)
            .join(",")
        : `${sidos},${sidoName}`;
      newSidos
        ? searchParams.set("sido", newSidos)
        : searchParams.delete("sido");
    } else searchParams.set("sido", sidoName);

    setSearchParams(searchParams);
  };

  const changeCities = (cityName: string, sidoName?: string) => {
    if (sidoName && sidos.includes(sidoName)) changeSidos(sidoName);
    if (cities) {
      const newCities = cities.includes(cityName)
        ? cities
            .split(",")
            .filter((city) => city !== `${sidoName} ${cityName}`)
            .join(",")
        : `${cities},${sidoName} ${cityName}`;
      newCities
        ? searchParams.set("city", newCities)
        : searchParams.delete("city");
    } else searchParams.set("city", `${sidoName} ${cityName}`);
    setSearchParams(searchParams);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          지역{" "}
          {selected.length > 0 && (
            <span className="text-primary-foreground bg-primary flex size-4 items-center justify-center rounded-full p-1 text-xs">
              {selected.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>지역을 골라주세요.</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="max-h-96 space-y-4 overflow-y-auto px-4">
          {sidoObject.map(
            ({ code: sidoCode, name: sidoName, cities: citiesArr }) => (
              <div key={sidoCode}>
                <h3 className="mb-2 text-sm font-semibold md:text-lg">
                  {sidoName}
                </h3>
                <div className="flex flex-wrap gap-1 text-xs md:text-lg">
                  <Button
                    variant={sidos.includes(sidoName) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      changeSidos(
                        sidoName,
                        citiesArr.map(({ name }) => `${sidoName} ${name}`),
                      )
                    }
                  >
                    전체
                  </Button>
                  {citiesArr.map(({ code: cityCode, name: cityName }) => (
                    <Button
                      key={cityCode}
                      variant={
                        cities.includes(`${sidoName} ${cityName}`)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => changeCities(cityName, sidoName)}
                    >
                      {cityName}
                    </Button>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
        <SheetFooter>
          <div className="flex flex-wrap gap-1">
            {selected.map(({ type, name }) => (
              <Badge
                key={`badge_${name}`}
                className="[&>svg]:pointer-events-auto"
              >
                {name}
                <XIcon
                  onClick={() => {
                    const splitedName = name.split(" ");
                    type === "sido"
                      ? changeSidos(name)
                      : changeCities(
                          splitedName.slice(1).join(" "),
                          splitedName[0],
                        );
                  }}
                />
              </Badge>
            ))}
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              searchParams.delete("city");
              searchParams.delete("sido");
              setSearchParams(searchParams);
            }}
          >
            초기화
          </Button>
          <SheetClose asChild>
            <Button variant="outline">닫기</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
