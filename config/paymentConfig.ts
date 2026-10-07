export interface StorePaymentConfig {
  storeName: string;
  pixKey: string;
  pixKeyType: 'email' | 'cpf' | 'cnpj' | 'telefone' | 'aleatoria';
  beneficiaryName: string;
  bankName: string;
  city: string;
  whatsappNumber: string; // formato 5511999999999
  enablePixDirect: boolean;
  enableCreditCard: boolean;
  gatewayProvider: 'manual' | 'mercadopago' | 'asaas' | 'stripe';
  mercadoPagoPublicKey?: string;
}

export const DEFAULT_PAYMENT_CONFIG: StorePaymentConfig = {
  storeName: "AR Fragrance",
  pixKey: "stopacontato@gmail.com",
  pixKeyType: "email",
  beneficiaryName: "AR FRAGRANCE LTDA",
  bankName: "Banco Inter / Nubank / Itaú",
  city: "SAO PAULO",
  whatsappNumber: "5511987654321",
  enablePixDirect: true,
  enableCreditCard: true,
  gatewayProvider: "manual"
};

export const getStorePaymentConfig = (): StorePaymentConfig => {
  try {
    const saved = localStorage.getItem('arfragrance_payment_config') || localStorage.getItem('lelixir_payment_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.storeName?.includes("ÉLIXIR")) {
        parsed.storeName = "AR Fragrance";
      }
      if (parsed.beneficiaryName?.includes("LELIXIR") || parsed.beneficiaryName?.includes("ÉLIXIR")) {
        parsed.beneficiaryName = "AR FRAGRANCE LTDA";
      }
      return { ...DEFAULT_PAYMENT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PAYMENT_CONFIG;
};

export const saveStorePaymentConfig = (config: StorePaymentConfig) => {
  try {
    localStorage.setItem('arfragrance_payment_config', JSON.stringify(config));
  } catch (e) {
    console.error(e);
  }
};
