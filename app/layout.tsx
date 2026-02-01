import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Social Capital",
  description: "Peer-to-peer lending and borrowing"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
              <div className="text-lg font-semibold text-slate-900">
                Logo Placeholder
              </div>
              <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
                <Link className="hover:text-slate-900" href="/">
                  Home
                </Link>
                <Link className="hover:text-slate-900" href="/lend">
                  Lend
                </Link>
                <Link className="hover:text-slate-900" href="/borrow">
                  Borrow
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
            {children}
          </main>
          <footer className="border-t border-slate-200">
            <div className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-slate-500">
              Footer placeholder
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
