import UserStatusMonitor from './components/auth/UserStatusMonitor';
import AvatarSync from './components/auth/AvatarSync';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      {/* Global user status monitor - runs for all logged-in users */}
      <UserStatusMonitor />

      {/* Sync avatar from database on app load */}
      <AvatarSync />

      <AppRoutes />
    </>
  );
}

export default App;
