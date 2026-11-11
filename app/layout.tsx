import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AI Farming Planner - From Seed to Harvest, Powered by AI',
  description: 'Complete AI-powered agriculture platform to identify plants, analyze farmland, discover suitable crops, generate farm layouts, monitor weather, and plan planting schedules.',
  openGraph: {
    title: 'AI Farming Planner - From Seed to Harvest, Powered by AI',
    description: 'Complete AI-powered agriculture platform to identify plants, analyze farmland, discover suitable crops, generate farm layouts, monitor weather, and plan planting schedules.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Farming Planner - From Seed to Harvest, Powered by AI',
    description: 'Complete AI-powered agriculture platform to identify plants, analyze farmland, discover suitable crops, generate farm layouts, monitor weather, and plan planting schedules.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
