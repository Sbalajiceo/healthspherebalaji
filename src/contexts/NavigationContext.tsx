import { createContext, useContext, useState, ReactNode } from 'react';

type Screen = {
  id: string;
  component: ReactNode;
};

type NavigationContextType = {
  pushScreen: (screen: Screen) => void;
  popScreen: () => void;
  screens: Screen[];
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [screens, setScreens] = useState<Screen[]>([]);

  const pushScreen = (screen: Screen) => {
    setScreens((prev) => [...prev, screen]);
  };

  const popScreen = () => {
    setScreens((prev) => prev.slice(0, -1));
  };

  return (
    <NavigationContext.Provider value={{ pushScreen, popScreen, screens }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
