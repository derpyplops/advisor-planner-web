import "./mall.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Mall Operations - Retail Asset Intelligence",
  description: "Retail Mall Operations & Asset Intelligence System",
};

export default function MallLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mall-theme" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {children}
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}
