
import React, { createContext, useContext, ReactNode } from 'react';

interface AppContextProps {
  groupMembers: IUser[];
  [key: string]: any; // Allow additional properties
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  value: AppContextProps;
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ value, children }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

/*
Usage Example:
[1] Wrap the root component with AppProvider in src/App.tsx:
import { AppProvider, useAppContext } from './AppContext';

const App = () => {
  const { user, setUser } = useAppContext();
  return (
    <AppProvider value={{ user, setUser }}>
      <HomePage />
    </AppProvider>
  );
};

export default App;
[2] Use the context in src/pages/homepage/index.tsx:
import { useAppContext } from '../../AppContext';

function HomePage() {
  const { user, setUser } = useAppContext();
  return (
    <>
      <h1>I am homepage</h1>
      <button onClick={() => setUser('guest')}>Login as guest</button>
    </>
  );
}
*/