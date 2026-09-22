import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastViewport from './components/ui/ToastViewport';
import AppRouter from './routes/AppRouter';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
        <ToastViewport />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;