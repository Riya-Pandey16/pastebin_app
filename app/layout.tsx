import "./globals.css";

export const metadata = {
  title: "Pastebin Lite",
  description: "A simple Pastebin-like application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
