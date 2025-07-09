// src/lib/colors.ts

export const colors = {
  primary: {
    50: '#f0f9f4',
    100: '#dcf2e3',
    200: '#bce5cb',
    300: '#8fd1a8',
    400: '#5cb67d',
    500: '#1a3e2e', // Main primary color from your palette
    600: '#16352a',
    700: '#132c24',
    800: '#11241f',
    900: '#0e1e1a',
  },
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#002b5b', // Main secondary color from your palette
    600: '#002452',
    700: '#001e45',
    800: '#001938',
    900: '#00142c',
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#ffa500', // Main accent color from your palette
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#32cd32', // Main success color from your palette
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
};

export const gradients = {
  primary: 'bg-gradient-to-r from-green-800 to-blue-900',
  card: 'bg-gradient-to-br from-white to-gray-50',
  button: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
  accent: 'bg-gradient-to-r from-orange-400 to-yellow-500',
};