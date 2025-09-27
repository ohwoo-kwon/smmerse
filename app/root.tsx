import "./app.css";

import type { Route } from "./+types/root";

import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

import { Dialog } from "./core/components/ui/dialog";
import { Sheet } from "./core/components/ui/sheet";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      const error = searchParams.get("error");
      const code = searchParams.get("code");
      if (error) {
        navigate(`/error?${searchParams.toString()}`);
      } else if (code) {
        navigate(`/login?email-verified`);
      }
    }
  }, [searchParams]);

  const adsenseClient =
    typeof window !== "undefined"
      ? import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT
      : process.env.VITE_GOOGLE_ADSENSE_CLIENT;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-adsense-account" content={adsenseClient} />
        <meta
          name="keywords"
          content="농구, 농구 게스트, 게스트 모집, 농구 경기, 농구 매칭, 농구인 커뮤니티"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`농구 게스트 모집 플랫폼 | ${import.meta.env.VITE_APP_NAME}`}
        />
        <meta
          property="og:description"
          content="스멀스에서 연락처 공유 없이 게스트를 모집해보세요. 스멀스는 멈추지 않고 발전 중입니다."
        />
        <meta property="og:url" content="https://smmerse.com" />
        <meta
          property="og:image"
          content="https://wujxmuluphdazgapgwrr.supabase.co/storage/v1/object/public/avatars/e421200d-88ca-4711-a667-b000290ef252"
        />
        <Meta />
        <Links />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GHV7NKZDXP"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GHV7NKZDXP');`,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
