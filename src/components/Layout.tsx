import React, { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import { AuroraBackground } from './backgrounds/AuroraBackground';
import { Sun, Moon, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div className={`min-h-screen relative overflow-hidden font-sora transition-colors duration-500 ${isDarkMode ? 'bg-space-dark text-white' : 'bg-indigo-50 text-space-dark'}`}>
      <AuroraBackground />
      
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 p-4 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-neon/10"
      >
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon to-purple-500 flex items-center justify-center transform hover:rotate-12 transition-transform shadow-neon">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-neon to-purple-500 bg-clip-text text-transparent">
                VoiceCart
              </span>
            </h1>
            <span className="text-xs text-text-secondary">Belanja Cerdas dengan Suara</span>
          </div>
        </motion.div>
        
        <motion.button 
          onClick={toggleTheme}
          className="p-3 rounded-full hover:bg-white/5 transition-colors relative overflow-hidden"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon to-purple-500 bg-clip-text text-transparent">
            Belanja Cerdas Dimulai dari Suara
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Dulu kami bingung saat tagihan belanja melebihi rencana. Sekarang kami hanya bilang: "Indomie lima ribu" – dan semua terhitung otomatis.
          </p>
        </motion.div>
        {children}
      </motion.main>
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 text-center p-8 border-t border-neon/10 backdrop-blur-sm bg-white/5"
      >
        <p className="text-sm text-text-secondary">
          VoiceCart adalah langkah pertama menuju belanja pintar. Dirancang dengan suara, dibangun dengan visi.
        </p>
      </motion.footer>
    </div>
  );
};