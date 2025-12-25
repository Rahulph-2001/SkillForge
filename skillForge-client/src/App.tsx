import UserStatusMonitor from './components/auth/UserStatusMonitor';
import AvatarSync from './components/auth/AvatarSync';
import SubscriptionSync from './components/auth/SubscriptionSync';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      {/* Global user status monitor - runs for all logged-in users */}
      <UserStatusMonitor />

      {/* Sync avatar from database on app load */}
      <AvatarSync />

      {/* Sync subscription plan from database on app load */}
      <SubscriptionSync />

      <AppRoutes />
    </>
  );
}

export default App;
