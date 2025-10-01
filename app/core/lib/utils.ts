import { type ClassValue, clsx } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(birth: string): number {
  const birthDate = DateTime.fromFormat(birth, "yyyy-MM-dd");

  const now = DateTime.now();

  const diff = now.diff(birthDate, "years").years;

  return Math.floor(diff);
}

export const copyToClipboard = async (copyText: string, text: string) => {
  try {
    await navigator.clipboard.writeText(copyText);
    return text;
  } catch (err) {
    console.error("클립보드 복사 실패:", err);
    return "복사에 실패했습니다";
  }
};

export const openKakaoMap = (address: string) => {
  const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(address)}`;
  window.open(kakaoMapUrl, "_blank"); // 새 탭에서 열기
};
