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
    });

    for (const post of posts) {
      const response = await client.responses.parse({
        model: "gpt-4.1-nano",
        input: `${post.title}
        ###
        위 내용에서 아래의 내용을 찾아서 정해진 형태로 알려줘. 오늘 날짜는 ${DateTime.now().toFormat("yyyy-MM-dd")}야. 오늘 날짜 이전의 날짜는 output으로 주지마.

        날짜: yyyy-MM-dd
        시작시간: HH:mm
        마감시간: HH:mm
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
        startTime: output.startTime,
        endTime: output.endTime,
        skillLevel: "level_0",
        minParticipants: 0,
        maxParticipants: 5,
        currentParticipants: 0,
        fee: 5000,
        sido: post.title.slice(1, 3),
        city: "",
        address: "",
        genderType: "male",
      });
    }
  } catch (e) {
    console.error("❌ 크롤링 실패:", e);
  } finally {
    await browser.close();
  }
  return data({ success: true }, { status: 200 });
};
