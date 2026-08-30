import './globals.css';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: 'NyayaSetu — न्यायसेतु | AI-Powered Indian Legal Assistant',
  description: 'NyayaSetu (Bridge to Justice) is a free AI-powered legal assistant that helps Indian citizens understand their rights, analyze legal documents, generate legal document formats, and find legal aid resources. Available in English and Hindi.',
  keywords: 'Indian law, legal assistant, legal rights, AI legal help, NyayaSetu, न्यायसेतु, free legal aid, Indian constitution, consumer rights, RTI',
  openGraph: {
    title: 'NyayaSetu — Your Bridge to Justice',
    description: 'Free AI-powered Indian legal assistant. Understand your rights, analyze documents, and find legal aid.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚖️</text></svg>" />
      </head>
      <body>
        <div className="bg-pattern" />
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
