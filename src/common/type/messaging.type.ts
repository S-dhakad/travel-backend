export interface MessagingConfig {
  whatsappUrl: string;
  whatsappApiKey: string;
}

export interface WhatsAppResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface WhatsAppAttachment {
  imageUrl?: string;
  pdfUrl?: string;
}
