import type {Metadata} from 'next';
import './globals.css';
import FloatingContactButtons from '@/components/FloatingContactButtons';

export const metadata: Metadata = {
  title: 'LTS BAGS PRIVATE LIMITED - Custom B2B Bag Manufacturer & Wholesale Supplier',
  description: 'Premier custom B2B bag manufacturer & wholesale supplier for corporate backpacks, laptop briefcases, travel duffels, and eco totes.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="relative antialiased">
        {children}
        <FloatingContactButtons />
      </body>
    </html>
  );
}

