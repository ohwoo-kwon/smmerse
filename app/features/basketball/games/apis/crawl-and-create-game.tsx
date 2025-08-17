import type { Route } from "./+types/crawl-and-create-game";

import chromium from "@sparticuz/chromium";
import { DateTime } from "luxon";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import puppeteer from "puppeteer-core";
import { data } from "react-router";
import z from "zod";

import adminClient from "~/core/lib/supa-admin-client.server";

import { insertBasketballGame } from "../mutations";

const CAFE_URL = "https://m.cafe.daum.net/dongarry/Dilr";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    slowMo: 50,
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  );

  try {
    await page.goto(CAFE_URL, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    await page.waitForSelector("#slideArticleList > ul", { timeout: 10000 });

    const posts: { title: string; url: string }[] = [];

    for (let i = 0; i < 20; i++) {
      try {
        await page.waitForSelector("#slideArticleList > ul");
        const listItems = await page.$$("#slideArticleList > ul > li");
        const item = listItems[i];
        if (!item) continue;

        const title =
          (await item.$eval("span.txt_detail", (el) =>
            el.textContent?.trim(),
          )) || "";
        const createdAt = await item.$eval("span.created_at", (el) =>
          el.textContent?.trim(),
        );

        if (!/^(\d{1,2})분 전$/.test(createdAt ?? "")) break;

        const link = await item.$("a.link_cafe");
        if (!link) continue;

        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }),
          link.click(),
        ]);

        const url = page.url();
        posts.push({ title, url });

        await page.goBack({ waitUntil: "networkidle2" });
      } catch (err) {
        console.warn(`❌ ${i + 1}번째 게시물 처리 실패:`, err);
      }
    }

    const client = new OpenAI();

    const outputSchema = z.object({
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      sido: z.enum([
        "서울",
        "경기",
        "인천",
        "부산",
        "대구",
        "광주",
        "대전",
        "울산",
        "세종",
        "충북",
        "충남",
        "전북",
        "전남",
        "경북",
        "경남",
        "제주",
        "강원",
        "",
      ]),
      city: z.enum([
        "종로구",
        "중구",
        "용산구",
        "성동구",
        "광진구",
        "동대문구",
        "중랑구",
        "성북구",
        "강북구",
        "도봉구",
        "노원구",
        "은평구",
        "서대문구",
        "마포구",
        "양천구",
        "강서구",
        "구로구",
        "금천구",
        "영등포구",
        "동작구",
        "관악구",
        "서초구",
        "강남구",
        "송파구",
        "강동구",
        "수원시 장안구",
        "수원시 권선구",
        "수원시 팔달구",
        "수원시 영통구",
        "성남시 수정구",
        "성남시 중원구",
        "성남시 분당구",
        "의정부시",
        "안양시 만안구",
        "안양시 동안구",
        "부천시",
        "광명시",
        "평택시",
        "동두천시",
        "안산시 상록구",
        "안산시 단원구",
        "고양시 덕양구",
        "고양시 일산동구",
        "고양시 일산서구",
        "과천시",
        "구리시",
        "남양주시",
        "오산시",
        "시흥시",
        "군포시",
        "의왕시",
        "하남시",
        "용인시 처인구",
        "용인시 기흥구",
        "용인시 수지구",
        "파주시",
        "이천시",
        "안성시",
        "김포시",
        "화성시",
        "광주시",
        "양주시",
        "포천시",
        "여주시",
        "연천군",
        "가평군",
        "양평군",
        "중구",
        "서구",
        "동구",
        "영도구",
        "부산진구",
        "동래구",
        "남구",
        "북구",
        "해운대구",
        "사하구",
        "금정구",
        "강서구",
        "연제구",
        "수영구",
        "사상구",
        "기장군",
        "중구",
        "동구",
        "서구",
        "남구",
        "북구",
        "수성구",
        "달서구",
        "달성군",
        "군위군",
        "중구",
        "동구",
        "미추홀구",
        "연수구",
        "남동구",
        "부평구",
        "계양구",
        "서구",
        "강화군",
        "옹진군",
        "동구",
        "서구",
        "남구",
        "북구",
        "광산구",
        "동구",
        "중구",
        "서구",
        "유성구",
        "대덕구",
        "중구",
        "남구",
        "동구",
        "북구",
        "울주군",
        "청주시 상당구",
        "청주시 서원구",
        "청주시 흥덕구",
        "청주시 청원구",
        "충주시",
        "제천시",
        "보은군",
        "옥천군",
        "영동군",
        "증평군",
        "진천군",
        "괴산군",
        "음성군",
        "단양군",
        "천안시 동남구",
        "천안시 서북구",
        "공주시",
        "보령시",
        "아산시",
        "서산시",
        "논산시",
        "계룡시",
        "당진시",
        "금산군",
        "부여군",
        "서천군",
        "청양군",
        "홍성군",
        "예산군",
        "태안군",
        "전주시 완산구",
        "전주시 덕진구",
        "군산시",
        "익산시",
        "정읍시",
        "남원시",
        "김제시",
        "완주군",
        "진안군",
        "무주군",
        "장수군",
        "임실군",
        "순창군",
        "고창군",
        "부안군",
        "목포시",
        "여수시",
        "순천시",
        "나주시",
        "광양시",
        "담양군",
        "곡성군",
        "구례군",
        "고흥군",
        "보성군",
        "화순군",
        "장흥군",
        "강진군",
        "해남군",
        "영암군",
        "무안군",
        "함평군",
        "영광군",
        "장성군",
        "완도군",
        "진도군",
        "신안군",
        "포항시 남구",
        "포항시 북구",
        "경주시",
        "김천시",
        "안동시",
        "구미시",
        "영주시",
        "영천시",
        "상주시",
        "문경시",
        "경산시",
        "군위군",
        "의성군",
        "청송군",
        "영양군",
        "영덕군",
        "청도군",
        "고령군",
        "성주군",
        "칠곡군",
        "예천군",
        "봉화군",
        "울진군",
        "울릉군",
        "제주시",
        "서귀포시",
        "춘천시",
        "원주시",
        "강릉시",
        "동해시",
        "태백시",
        "속초시",
        "삼척시",
        "홍천군",
        "횡성군",
        "영월군",
        "평창군",
        "정선군",
        "철원군",
        "화천군",
        "양구군",
        "인제군",
        "고성군",
        "양양군",
        "",
      ]),
    });

    for (const post of posts) {
      const response = await client.responses.parse({
        model: "gpt-5-nano",
        input: `
        아래 경기제목 태그의 내용을 확인하고 정해진 date, startTime, endTie, city, sido 정보 알려줘.
        오늘 날짜는 ${DateTime.now().toFormat("yyyy-MM-dd")}야. 오늘 날짜 이전의 날짜는 output으로 주지마.
        불확실한 정보는 빈 string 형태로 답변해줘.

        date: yyyy-MM-dd
        startTime: HH:mm
        endTime: HH:mm
        sido: 시,도
        city: 구,군

        ###
        <경기제목>
          ${post.title}
        </경기제목>
        `,
        text: {
          format: zodTextFormat(outputSchema, "event"),
        },
      });

      const output = response.output_parsed;

      if (!output || !output.date || !output.startTime || !output.endTime)
        continue;

      await insertBasketballGame(adminClient, {
        title: post.title,
        link: post.url,
        description: `📌 주의사항
이 게시물의 정보는 자동 수집된 데이터로, 실제 내용과 다를 수 있습니다.
정확한 내용은 아래 링크를 통해 직접 게시글을 확인해주세요. 🙏`,
        date: output.date,
        start_time: output.startTime,
        end_time: output.endTime,
        skill_level: "level_0",
        min_participants: 0,
        max_participants: 5,
        fee: 5000,
        sido: output.sido || post.title.slice(1, 3),
        city: output.city || "",
        address: "",
        gender_type: "male",
      });
    }
  } catch (e) {
    console.error("❌ 크롤링 실패:", e);
  } finally {
    await browser.close();
  }
  return data({ success: true }, { status: 200 });
};
