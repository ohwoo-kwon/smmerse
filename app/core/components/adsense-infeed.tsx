import { useEffect } from "react";

import { cn } from "../lib/utils";

export default function AdsenseInfeed({ className }: { className?: string }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);
  return (
    <div className={cn("mx-auto max-w-screen-md", className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-hd-1h+49-1t-2a"
        data-ad-client={import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT}
        data-ad-slot="3274428738"
      />
    </div>
  );
}
