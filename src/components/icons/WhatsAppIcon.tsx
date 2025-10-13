import React from 'react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => {
  return (
    <img
      src="/icons/whatsapp.svg"
      alt="WhatsApp"
      className={className}
    />
  );
};

export default WhatsAppIcon;