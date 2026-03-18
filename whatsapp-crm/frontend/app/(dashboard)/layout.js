import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ToastProvider } from "@/contexts/ToastContext";

export default function DashboardLayout({ children }) {
  return (
    <ToastProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: "#F7F8FA" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Header />
          <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
