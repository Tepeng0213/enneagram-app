import { useEffect, useState } from 'react';
import App from './App';
import { AdminGear } from './components/AdminGear';
import ReportList from './ReportList';
import ReportView from './ReportView';

type Route = 'test' | 'reports' | 'report';

function parseRoute(): Route {
  const hash = window.location.hash.slice(1) || '/';
  if (hash.startsWith('/reports')) return 'reports';
  if (hash.startsWith('/report')) return 'report';
  return 'test';
}

function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return route;
}

export default function Root() {
  const route = useHashRoute();

  return (
    <>
      <AdminGear />
      {route === 'reports' && <ReportList />}
      {route === 'report' && <ReportView />}
      {route === 'test' && <App />}
    </>
  );
}
