
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';
import { initDb } from './src/db';

export default function App() {

  useEffect(() => {
    initDb().catch((err) => {
      console.error('Erro ao inicializar o Firebase:', err);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
