import Navbar from '@/components/Navbar';
import { Provider } from './provider';
import '@/styles/global.css';
import { TrpcProvider } from '../components/TrpcProvider';

export const metadata = {
  title: 'DataViz',
  description: 'Analyze data and generate beautiful infographic',
  icons: {
    icon: '/image/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <TrpcProvider>
      <html lang="en">
        <body className="scrollbar-container">
          <Provider>
            <div>
              <Navbar />
              {children}
            </div>
          </Provider>
        </body>
      </html>
    </TrpcProvider>
  );
}
