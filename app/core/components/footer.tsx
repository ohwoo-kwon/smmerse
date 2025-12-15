import PrivacyPolicySheet from "~/features/auth/components/privacy-policy-sheet";
import ServiceSheet from "~/features/auth/components/service-sheet";

import { Separator } from "./ui/separator";

export default function Footer() {
  return (
    <footer className="space-y-4 border-t p-3 text-sm">
      <div className="flex flex-wrap text-xs">
        <div className="border-foreground border-r-1 px-1">
          주식회사 이른새벽다섯시
        </div>
        <div className="border-foreground border-r-1 px-1">대표 권오우</div>
        <div className="border-foreground border-r-1 px-1">
          사업자번호 346-25-01780
        </div>
        <div className="px-1">통신판매업</div>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:py-5">
        <div className="order-2 md:order-none">
          <p>
            &copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}.
            All rights reserved.
          </p>
        </div>
        <div className="order-1 flex gap-5 *:underline md:order-none">
          <PrivacyPolicySheet />
          <ServiceSheet />
        </div>
      </div>
    </footer>
  );
}
