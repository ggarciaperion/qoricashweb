'use client';

export default function WhatsAppButton() {
  const phoneNumber = '51906237356'; // Código de país + número
  const message = 'Hola, quiero hacer una consulta sobre los servicios de QoriCash.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
      aria-label="Contactar por WhatsApp"
    >
      {/* Ícono de WhatsApp personalizado */}
      <img
        src="/whatsapp-icon.png"
        alt="WhatsApp"
        className="w-16 h-16 rounded-full"
      />
    </a>
  );
}
