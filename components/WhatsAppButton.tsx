'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '51906237356'; // Código de país + número
  const message = 'Hola, quiero hacer una consulta sobre los servicios de QoriCash.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
      aria-label="Contactar por WhatsApp"
    >
      {/* Ícono de WhatsApp */}
      <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />

      {/* Efecto de pulso */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping"></span>
    </a>
  );
}
