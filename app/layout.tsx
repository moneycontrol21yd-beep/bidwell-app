import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BidWell | Global AI Tender Consultant & Legal Suite',
  description: 'World-class automated tender intelligence and legal document generator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#030712] text-slate-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-black`}>
        <main className="max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl min-h-screen relative shadow-2xl border-x border-slate-800/60 bg-[#070b18]">
          {children}
        </main>
      </body>
    </html>
  );
}
