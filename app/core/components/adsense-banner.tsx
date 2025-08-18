import { useEffect } from "react";

export default function AdsenseBanner({
  adClient = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT,
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
  className = "adsbygoogle mx-auto",
}: {
  adClient?: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);
  return (
    <ins
      className={className}
      style={style}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive}
    />
  );
}
