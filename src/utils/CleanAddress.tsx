export const cleanAddress = (address: string) => {
  if (!address) {return '';}

  const addressWithoutReceiver = address.split('Receiver:')[0].trim();

  const parts = addressWithoutReceiver
    .split(',')
    .map(part => part.trim())
    .filter((part, index, self) => {
      const normalized = part.toLowerCase().replace(/\s+/g, '');
      const isDuplicate = self.findIndex(p => p.toLowerCase().replace(/\s+/g, '') === normalized) !== index;
      const isPincode = /^\d{5,6}$/.test(part);
      const isMobile = /^\d{10,}$/.test(part);
      return part && !isDuplicate && !isPincode && !isMobile;
    });

  return parts.join(', ');
};
