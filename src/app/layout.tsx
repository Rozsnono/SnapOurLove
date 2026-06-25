import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Snapchat MVP',
  description: 'Next.js, Tailwind, Capacitor, Mongoose, Pusher & Cloudinary integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden select-none bg-black">
        {children}
      </body>
    </html>
  );
}