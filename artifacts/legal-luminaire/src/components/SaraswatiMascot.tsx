/**
 * SaraswatiMascot Component
 * 
 * This component represents Saraswati, the Hindu goddess of knowledge, music, and arts.
 * In the context of Legal Luminaire, she serves as the educational mascot representing
 * wisdom, learning, and the pursuit of legal knowledge.
 * 
 * Integration: Used as a visual anchor and navigation guide throughout the application.
 */

import React from "react";
import { BookOpen, Sparkles, Scale } from "lucide-react";

interface SaraswatiMascotProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  showTooltip?: boolean;
  onClick?: () => void;
}

export function SaraswatiMascot({ 
  size = "md", 
  animated = true, 
  showTooltip = true,
  onClick 
}: SaraswatiMascotProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40
  };

  const animationClass = animated ? "animate-pulse" : "";

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${animationClass} cursor-pointer group`}
      onClick={onClick}
      role="button"
      aria-label="Saraswati - Goddess of Knowledge"
      tabIndex={0}
    >
      {/* Main icon representing knowledge */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-300">
        <BookOpen 
          size={iconSizes[size]} 
          className="text-amber-700" 
        />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-1.5 shadow-md">
        <Sparkles size={size === "sm" ? 12 : size === "md" ? 16 : 20} className="text-white" />
      </div>
      
      <div className="absolute -bottom-1 -left-1 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full p-1.5 shadow-md">
        <Scale size={size === "sm" ? 12 : size === "md" ? 16 : 20} className="text-white" />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <div className="font-semibold">Saraswati</div>
          <div className="text-gray-300">Goddess of Knowledge</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

// Compact version for use in headers/navbars
export function SaraswatiMascotCompact({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      className="flex items-center gap-2 cursor-pointer group"
      onClick={onClick}
      role="button"
      aria-label="Saraswati Mascot"
    >
      <div className="relative w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full flex items-center justify-center shadow-md border border-amber-300">
        <BookOpen size={16} className="text-amber-700" />
      </div>
      <span className="text-sm font-medium text-amber-700 group-hover:text-amber-800 transition-colors">
        Saraswati
      </span>
    </div>
  );
}

// Badge version for achievement/display
export function SaraswatiBadge({ level = 1 }: { level?: number }) {
  const levelColors = {
    1: "from-amber-100 to-orange-200 border-amber-300",
    2: "from-purple-100 to-indigo-200 border-purple-300", 
    3: "from-emerald-100 to-teal-200 border-emerald-300"
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${levelColors[level as keyof typeof levelColors]} rounded-full border shadow-sm`}>
      <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center">
        <BookOpen size={12} className="text-gray-700" />
      </div>
      <span className="text-xs font-semibold text-gray-700">
        Level {level}
      </span>
    </div>
  );
}