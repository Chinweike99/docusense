
'use client';

import { FileText, MessageSquareHeart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navigation() {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Chat',
      href: '/',
      icon: MessageSquareHeart,
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.95 }
  };

  const sparkleVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-slate-900/70 via-slate-800 to-slate-900 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50"
      initial="hidden"
      animate="visible"
      // variants={containerVariants}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-3"
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              // variants={logoVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full blur opacity-30"
                // variants={sparkleVariants}
                animate="animate"
              />
              <div className="relative bg-slate-800 p-2 rounded-full border border-slate-600">
                <Sparkles className="h-6 w-6 text-cyan-400" />
              </div>
            </motion.div>
            
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              Docusense
            </motion.h1>
          </motion.div>
          
          {/* Navigation Links */}
          <motion.div
            className="flex space-x-2"
            variants={itemVariants}
          >
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <Link href={item.href} className="relative block">
                    <motion.div
                      className={`relative flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-slate-300 hover:text-white'
                      }`}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Active background with gradient */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30"
                          layoutId="activeTab"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                        />
                      )}
                      
                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-0 bg-slate-700/30 rounded-xl opacity-0"
                        whileHover={{ opacity: isActive ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      
                      {/* Icon with animation */}
                      <motion.div
                        className="relative z-10"
                        animate={isActive ? {
                          rotate: [0, 5, -5, 0],
                          transition: { duration: 0.5, ease: "easeInOut" }
                        } : {}}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                      </motion.div>
                      
                      {/* Text */}
                      <span className="relative z-10 font-semibold tracking-wide">
                        {item.name}
                      </span>
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                        />
                      )}
                      
                      {/* Glow effect for active item */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-xl blur-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
      
      {/* Subtle bottom gradient line */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </motion.nav>
  );
}