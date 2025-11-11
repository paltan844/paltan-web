
export function formatSelectedLocation(raw: string): string {
  const parts = raw.split(',').map((s) => s.trim());

  const cleanedValues: string[] = [];

  for (let part of parts) {
    if (part.toLowerCase().includes('latitude') || part.toLowerCase().includes('longitude')) {
      continue;
    }

    if (part.includes(':')) {
      const [_, value] = part.split(':');
      if (value && value.trim() !== '') {
        cleanedValues.push(value.trim());
      }
    } else {
      if (part && part !== '') {
        cleanedValues.push(part);
      }
    }
  }

  return cleanedValues.join(', ');
}


export const formatAddressForBackend = (addressObj: Record<string, any>) => {
  const cleanedAddress: Record<string, any> = {};

  const numberFields = ['latitude', 'longitude', 'pincode', 'receiverMobile'];

  Object.entries(addressObj || {}).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return;
    }

    if (numberFields.includes(key)) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        cleanedAddress[key] = parsed;
      }
    } else if (typeof value === 'string') {
      cleanedAddress[key] = value.trim();
    } else {
      cleanedAddress[key] = value;
    }
  });

  return cleanedAddress;
};



export const capitalizeWords = (str: string = '') => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
