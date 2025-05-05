import NavBar from "@/components/navigation/app-nav";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`
        // max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}
        className="max-w-6xl mx-auto px-10"
      >
        <NavBar />

        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
