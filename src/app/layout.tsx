import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from './providers';

export const metadata: Metadata = {
  title: 'PrepFlow — Personal Exam Preparation OS',
  description: 'Track roadmaps, daily schedules, lectures, tasks, and focus time in one elegant dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
