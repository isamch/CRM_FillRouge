import "./globals.css";

export const metadata = {
  title: "WhatsApp CRM",
  description: "Manage your WhatsApp communications at scale",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
