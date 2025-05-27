import React, { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import { StarBackground } from './StarBackground';
import { Sun, Moon, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingElements } from './FloatingElements';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-space-dark text-white' : 'bg-indigo-50 text-space-dark'}`}>
      <StarBackground />
      <FloatingElements />
      
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 p-4 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-border shadow-cosmic"
      >
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center transform hover:rotate-12 transition-transform shadow-glow">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#00f5dc] to-[#6366f1] bg-clip-text text-transparent">
                VoiceChart
              </span>
            </h1>
            <span className="text-xs text-text-secondary">Smart Voice Shopping Analytics</span>
          </div>
        </motion.div>
        
        <motion.button 
          onClick={toggleTheme}
          className="p-3 rounded-full hover:bg-space-light/10 transition-colors relative overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle theme"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      </motion.header>
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 container mx-auto px-4 py-6"
      >
        {children}
      </motion.main>
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 text-center p-4 text-sm text-text-secondary"
      >
        <p>© 2025 VoiceChart</p>
      </motion.footer>
    </div>
  );
};