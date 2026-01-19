'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Clock } from 'lucide-react';

export interface NotificationData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // milliseconds, default 5000
}

interface NotificationToastProps {
  notification: NotificationData | null;
  onClose: () => void;
}

export default function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setIsExiting(false);

      const duration = notification.duration || 8000; // 8 segundos por defecto para notificaciones KYC

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Duración de la animación de salida
  };

  if (!notification || !isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-600" />,
    error: <AlertCircle className="w-6 h-6 text-red-600" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-600" />,
    info: <Clock className="w-6 h-6 text-blue-600" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          ${colors[notification.type]}
          ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
          border-2 rounded-xl shadow-2xl p-4 max-w-md min-w-[320px]
        `}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {icons[notification.type]}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className={`font-bold text-base mb-1 ${textColors[notification.type]}`}>
              {notification.title}
            </h4>
            <p className={`text-sm ${textColors[notification.type]}`}>
              {notification.message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-out-right {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }

        .animate-slide-out-right {
          animation: slide-out-right 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
