import Navbar from '@/components/Navbar';
import { Provider } from './provider';
import '@/styles/global.css';
import { TrpcProvider } from '../components/TrpcProvider';
import style from '../styles/rootLayout.module.css';

export const metadata = {
  title: 'DataViz',
  description: 'Analyze data and generate beautiful infographic',
  icons: {
    icon: '/image/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={style['custom-font']}>
      <body className="scrollbar-container">
        <TrpcProvider>
          <Provider>
            <div>
              <Navbar />
              {children}
            </div>
          </Provider>
        </TrpcProvider>
      </body>
    </html>
  );
}
