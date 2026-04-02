/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, LayoutDashboard, BarChart3, Globe, CloudSun, Wind, Droplets, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import screen0 from './assets/screen_0.png';
import screen1 from './assets/screen_1.png';
import screen2 from './assets/screen_2.png';

// Configuration for the display screens grouped by category as seen in the reference image
const CATEGORIES = [
  {
    name: '农业',
    id: 'agri',
    items: [
      { id: '1', title: '建阳桔柚', url: screen0, description: '集成桔柚生长气象服务专题、灾害指标监测及逐日天气预报。', icon: <CloudSun size={20} /> },
      { id: '2', title: '建瓯玉米', url: screen1, description: '实时监控鲜食玉米生长环境，提供气象适宜性指标分析。', icon: <Thermometer size={20} /> },
      { id: '3', title: '邵武黄精', url: 'https://picsum.photos/seed/huangjing/3840/2160', description: '中药材种植气象服务。', icon: <Wind size={20} /> },
      { id: '4', title: '浦城水稻制种', url: 'https://picsum.photos/seed/rice/3840/2160', description: '水稻制种全过程气象保障。', icon: <Droplets size={20} /> },
      { id: '5', title: '光泽稻花鱼', url: screen2, description: '结合稻花鱼养殖需求，提供农业气象灾害风险预警。', icon: <Droplets size={20} /> },
      { id: '6', title: '光泽生态农场', url: 'https://picsum.photos/seed/farm/3840/2160', description: '生态农场综合气象监测。', icon: <Globe size={20} /> },
    ]
  },
  {
    name: '茶园',
    id: 'tea',
    items: [
      { id: '7', title: '武夷学院智慧茶园', url: 'https://picsum.photos/seed/teagarden1/3840/2160', description: '智慧茶园气象服务系统。', icon: <CloudSun size={20} /> },
      { id: '8', title: '武夷山倾上有机茶园', url: 'https://picsum.photos/seed/teagarden2/3840/2160', description: '有机茶园气象环境监测。', icon: <CloudSun size={20} /> },
    ]
  },
  {
    name: '渡运',
    id: 'ferry',
    items: [
      { id: '9', title: '邵武卫闽镇渡运', url: 'https://picsum.photos/seed/ferry1/3840/2160', description: '渡口航运安全气象预警。', icon: <Wind size={20} /> },
      { id: '10', title: '武夷山城村村渡运', url: 'https://picsum.photos/seed/ferry2/3840/2160', description: '村级渡口气象服务。', icon: <Wind size={20} /> },
    ]
  },
  {
    name: '旅游',
    id: 'tour',
    items: [
      { id: '11', title: '建阳云谷旅游驿站', url: 'https://picsum.photos/seed/tour1/3840/2160', description: '旅游景区气象服务。', icon: <Globe size={20} /> },
      { id: '12', title: '建阳考亭旅游驿站', url: 'https://picsum.photos/seed/tour2/3840/2160', description: '考亭书院文化旅游气象保障。', icon: <Globe size={20} /> },
    ]
  },
  {
    name: '生态',
    id: 'eco',
    items: [
      { id: '13', title: '松溪生态驿站', url: 'https://picsum.photos/seed/eco1/3840/2160', description: '生态环境气象监测。', icon: <Droplets size={20} /> },
      { id: '14', title: '延平宝珠村生态驿站', url: 'https://picsum.photos/seed/eco2/3840/2160', description: '宝珠村生态气象服务。', icon: <Droplets size={20} /> },
    ]
  },
];

// Flattened screens for carousel logic
const ALL_SCREENS = CATEGORIES.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.name })));

const CAROUSEL_INTERVAL = 20000; // 20 seconds per screen for better reading

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scale, setScale] = useState(0.2); 
  const [loadError, setLoadError] = useState<Record<string, boolean>>({});
  const [useFallback, setUseFallback] = useState<Record<string, boolean>>({});

  // Helper to get absolute URL for images
  const getFullUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    // If it's a resolved asset from Vite (starts with / or has a hash), return as is
    if (url.startsWith('/') || url.includes('?')) return url;
    // Otherwise, assume it needs a leading slash (relative to root/base)
    return `/${url}`;
  };

  // Calculate scale to fit 4K content into current viewport
  const updateScale = useCallback(() => {
    const width = window.innerWidth || 1920;
    const height = window.innerHeight || 1080;
    const targetWidth = 3840;
    const targetHeight = 2160;
    const scaleX = width / targetWidth;
    const scaleY = height / targetHeight;
    const newScale = Math.min(scaleX, scaleY);
    // Ensure scale is never zero and has a reasonable minimum
    setScale(newScale > 0.01 ? newScale : 0.2);
  }, []);

  useEffect(() => {
    updateScale();
    // Re-run after a short delay to ensure window dimensions are ready
    const timer = setTimeout(updateScale, 100);
    const timer2 = setTimeout(updateScale, 500); // Second check for slow loads
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [updateScale]);

  const handleSwitch = useCallback((index: number) => {
    // Prevent switching if already transitioning or already on that index
    if (index === currentIndex || isTransitioning) return;
    
    setIsMenuOpen(false);
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [currentIndex, isTransitioning]);

  // Handle transition completion
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    // Auto-rotation timer
    if (isMenuOpen || isTransitioning) return;
    
    const timer = setTimeout(() => {
      handleSwitch((currentIndex + 1) % ALL_SCREENS.length);
    }, CAROUSEL_INTERVAL);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isMenuOpen, isTransitioning, handleSwitch]);

  const handleImageError = (id: string) => {
    const screen = ALL_SCREENS.find(s => s.id === id);
    console.error(`[DEBUG] Image load failed for ID ${id}. URL: ${screen?.url}`);
    if (!useFallback[id]) {
      setUseFallback(prev => ({ ...prev, [id]: true }));
    } else {
      setLoadError(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleImageLoad = () => {
    // No-op, kept for compatibility if needed
  };

  return (
    <div className="relative w-screen h-screen bg-[#000510] overflow-hidden font-sans select-none">
      {/* 4K Content Wrapper */}
      <div 
        className={`screen-container shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-700 ${isMenuOpen ? 'blur-md scale-[0.98] opacity-50' : ''}`}
        style={{ 
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: scale > 0 ? (isMenuOpen ? 0.5 : 1) : 0 
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div 
            key={currentIndex}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {useFallback[ALL_SCREENS[currentIndex].id] && (
              <div className="absolute top-4 left-4 z-[200] bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-lg">
                正在使用备用演示图片 (资源加载失败)
              </div>
            )}
            {loadError[ALL_SCREENS[currentIndex].id] ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#001a3d] via-[#000a1a] to-[#001a3d] text-blue-400">
                {/* Animated Radar Background for Error State */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-blue-500/30 rounded-full animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] border border-blue-500/10 rounded-full" />
                </div>
                
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <CloudSun size={180} className="mb-12 text-blue-500/40 animate-bounce" />
                  <div className="text-8xl font-black mb-6 tracking-tighter bg-gradient-to-b from-white to-blue-400 bg-clip-text text-transparent">
                    图片未找到
                  </div>
                  <div className="text-4xl opacity-70 font-light tracking-widest mb-12">
                    系统检测到资源文件缺失: <span className="text-blue-400 font-mono mx-4">{ALL_SCREENS[currentIndex].url}</span>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 p-8 rounded-2xl max-w-4xl text-center backdrop-blur-md">
                    <p className="text-2xl text-blue-200/80 leading-relaxed">
                      请在左侧 <span className="text-white font-bold">文件浏览器</span> 中上传图片并重命名为对应名称，<br/>
                      或再次将图片发送给 AI 助手进行保存。
                    </p>
                  </div>
                </motion.div>
              </div>
            ) : (
              <img
                src={useFallback[ALL_SCREENS[currentIndex].id] ? (ALL_SCREENS[currentIndex] as any).fallback || `https://picsum.photos/seed/${ALL_SCREENS[currentIndex].id}/3840/2160` : getFullUrl(ALL_SCREENS[currentIndex].url)}
                className="w-full h-full object-cover"
                alt={ALL_SCREENS[currentIndex].title}
                onLoad={handleImageLoad}
                onError={() => handleImageError(ALL_SCREENS[currentIndex].id)}
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* High-end Navigation Entry (Vertical Handle on Right) */}
      <div 
        className="absolute top-0 right-0 h-full w-4 z-[100] group cursor-pointer"
        onMouseEnter={() => setIsMenuOpen(true)}
      />

      {/* Progress Bar */}
      {!isMenuOpen && (
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-900/20 z-40">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: CAROUSEL_INTERVAL / 1000, ease: "linear" }}
            key={currentIndex}
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          />
        </div>
      )}

      {/* Meteorological Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 200 }}
              onMouseLeave={() => setIsMenuOpen(false)}
              className="absolute top-0 right-0 w-[320px] h-full bg-blue-900/10 backdrop-blur-xl border-l border-blue-500/20 z-[120] flex flex-col shadow-[-20px_0_60px_rgba(0,100,255,0.1)] overflow-hidden"
            >
              {/* Menu Header (Title Integrated) */}
              <div className="relative w-full mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-400/90 shadow-[0_5px_15px_rgba(0,0,0,0.2)]" 
                     style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
                <h1 className="relative px-8 py-5 text-2xl font-bold text-white tracking-[0.15em] italic text-right">
                  南平气象服务站
                </h1>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col justify-between min-h-0">
                {CATEGORIES.map((category) => (
                  <div key={category.id} className="flex items-stretch mb-6 last:mb-0 flex-1">
                    {/* Vertical Category Label */}
                    <div className="bg-blue-500/50 backdrop-blur-md border-y border-l border-blue-300/30 flex items-center justify-center w-12 px-2 py-8 shadow-[-5px_0_15px_rgba(0,0,0,0.1)] rounded-l-md">
                      <span className="text-white font-bold text-lg leading-tight tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                        {category.name}
                      </span>
                    </div>
                    
                    {/* Sub-items List */}
                    <div className="flex-1 bg-blue-400/5 backdrop-blur-sm border border-blue-300/10 border-l-0 p-1 flex flex-col gap-1 rounded-r-md relative overflow-hidden justify-center">
                      {/* Grid Background Pattern */}
                      <div className="absolute inset-0 opacity-5 pointer-events-none" 
                           style={{ backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                      
                      {category.items.map((item) => {
                        const globalIndex = ALL_SCREENS.findIndex(s => s.id === item.id);
                        const isActive = currentIndex === globalIndex;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSwitch(globalIndex)}
                            className={`relative px-4 py-3 text-left transition-all duration-300 group rounded-sm ${
                              isActive 
                                ? 'bg-gradient-to-r from-cyan-400/90 to-blue-500/90 text-white shadow-[inset_0_0_15px_rgba(255,255,255,0.1)]' 
                                : 'text-blue-100/60 hover:text-white hover:bg-blue-400/10'
                            }`}
                          >
                            <span className={`text-base font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                              {item.title}
                            </span>
                            {isActive && (
                              <motion.div 
                                layoutId="active-glow"
                                className="absolute inset-0 border border-cyan-300/40 rounded-sm pointer-events-none"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preload images to prevent loading flickers during transition */}
      <div className="hidden">
        {ALL_SCREENS.map(screen => (
          <img 
            key={`preload-${screen.id}`} 
            src={getFullUrl(screen.url)} 
            alt="preload" 
            referrerPolicy="no-referrer"
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}} />
    </div>
  );
}
