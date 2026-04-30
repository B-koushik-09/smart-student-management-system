import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 lg:ml-0 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
