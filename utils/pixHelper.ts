/**
 * PIX Helper for Brazilian Instant Payments (BR Code standard)
 */

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function calculateCRC16(payload: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixPayload(params: {
  key: string;
  name: string;
  city: string;
  amount: number;
  txId?: string;
}): string {
  const { key, name, city, amount, txId = '***' } = params;

  // Clean strings
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").slice(0, 25).toUpperCase();
  const cleanCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").slice(0, 15).toUpperCase();
  const formattedAmount = amount.toFixed(2);

  // Payload format indicator
  let payload = formatField('00', '01');

  // Point of Initiation Method: 12 (Dynamic) or 11 (Static)
  payload += formatField('01', '12');

  // Merchant Account Information (GUI + Key)
  const merchantInfo = formatField('00', 'br.gov.bcb.pix') + formatField('01', key);
  payload += formatField('26', merchantInfo);

  // Merchant Category Code
  payload += formatField('52', '0000');

  // Transaction Currency (986 = BRL)
  payload += formatField('53', '986');

  // Transaction Amount
  payload += formatField('54', formattedAmount);

  // Country Code
  payload += formatField('58', 'BR');

  // Merchant Name
  payload += formatField('59', cleanName);

  // Merchant City
  payload += formatField('60', cleanCity);

  // Additional Data Field Template (txid)
  const additionalData = formatField('05', txId);
  payload += formatField('62', additionalData);

  // CRC16 Checksum
  payload += '6304';
  const checksum = calculateCRC16(payload);

  return payload + checksum;
}

export function getQrCodeImageUrl(data: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(data)}`;
}
