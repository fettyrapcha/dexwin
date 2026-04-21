import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface-page">
      <Sidebar />
      <main className="ml-[260px] min-h-screen flex-1">
        {children}
      </main>
    </div>
  );
}
