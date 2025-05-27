import React from 'react';
import { Layout } from './components/Layout';
import { ShoppingCalculator } from './components/ShoppingCalculator';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <ShoppingCalculator />
      </Layout>
    </ThemeProvider>
  );
}

export default App;