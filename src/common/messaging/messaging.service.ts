import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  WhatsAppResponse,
  WhatsAppAttachment,
} from '../type/messaging.type';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  private readonly whatsappBusinessConfig = {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
    apiBaseUrl: 'https://graph.facebook.com/v18.0',
  };

  constructor(private readonly configService: ConfigService) {
    this.validateWhatsAppConfig();
  }

  private validateWhatsAppConfig(): void {
    if (!this.whatsappBusinessConfig.accessToken) {
      this.logger.warn('WhatsApp Business access token is not configured');
    }
    if (!this.whatsappBusinessConfig.phoneNumberId) {
      this.logger.warn('WhatsApp Business phone number ID is not configured');
    }
    if (!this.whatsappBusinessConfig.businessAccountId) {
      this.logger.warn('WhatsApp Business account ID is not configured');
    }
  }

  async sendWhatsApp(
    mobile: string,
    message: string,
    attachments: WhatsAppAttachment = {},
  ): Promise<WhatsAppResponse> {
    try {
      // Use only WhatsApp Business API
      return await this.sendWhatsAppBusiness(mobile, message, attachments);
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to send WhatsApp message',
      };
    }
  }

  private async sendWhatsAppBusiness(
    mobile: string,
    message: string,
    attachments: WhatsAppAttachment = {},
  ): Promise<WhatsAppResponse> {
    try {
      this.logger.log(`Sending WhatsApp Business message to ${mobile}`);

      // Format phone number for WhatsApp (must include country code)
      let phoneNumber = mobile.replace(/\D/g, ''); // Remove all non-digits

      // If number doesn't start with country code, assume India (91)
      if (phoneNumber.length === 10) {
        phoneNumber = '91' + phoneNumber;
      }

      // Ensure it starts with + for consistency
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+' + phoneNumber;
      }

      const payload = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          body: message
        }
      };

      const response = await axios.post(
        `${this.whatsappBusinessConfig.apiBaseUrl}/${this.whatsappBusinessConfig.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.whatsappBusinessConfig.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`WhatsApp Business message sent successfully`);
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error(`WhatsApp Business API failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendVerificationCode(
    mobile: string,
    code: string,
    useTemplate: boolean = true
  ): Promise<{ success: boolean; error?: string }> {
    try {
      this.logger.log(`Sending verification code to ${mobile}`);

      // Format phone number for WhatsApp (must include country code)
      let phoneNumber = mobile.replace(/\D/g, ''); // Remove all non-digits

      // If number doesn't start with country code, assume India (91)
      if (phoneNumber.length === 10) {
        phoneNumber = '91' + phoneNumber;
      }

      // Ensure it starts with +
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+' + phoneNumber;
      }

      if (useTemplate) {
        // Try using the template first
        const payload = {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'template',
          template: {
            name: 'verification_code',
            language: {
              code: 'en_US'
            },
            components: [
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: code
                  }
                ]
              }
            ]
          }
        };

        this.logger.debug('WhatsApp Template Payload:', JSON.stringify(payload, null, 2));

        try {
          const response = await axios.post(
            `${this.whatsappBusinessConfig.apiBaseUrl}/${this.whatsappBusinessConfig.phoneNumberId}/messages`,
            payload,
            {
              headers: {
                'Authorization': `Bearer ${this.whatsappBusinessConfig.accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );

          this.logger.log(`Verification code sent successfully via template to ${phoneNumber}`);
          return { success: true };
        } catch (templateError: any) {
          const apiError = templateError.response?.data?.error?.message || templateError.message;
          this.logger.warn(`Template failed, falling back to text message: ${apiError}`);

          // Fallback to regular text message
          const message = `${code} is your verification code. For your security, do not share this code.`;
          return await this.sendWhatsAppText(mobile, message);
        }
      } else {
        // Send as regular text message
        const message = `${code} is your verification code. For your security, do not share this code.`;
        return await this.sendWhatsAppText(mobile, message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to send verification code';
      this.logger.error(`Failed to send verification code to ${mobile}: ${errorMessage}`, error.stack);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private async sendWhatsAppText(
    mobile: string,
    message: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Format phone number for WhatsApp (must include country code)
      let phoneNumber = mobile.replace(/\D/g, ''); // Remove all non-digits

      // If number doesn't start with country code, assume India (91)
      if (phoneNumber.length === 10) {
        phoneNumber = '91' + phoneNumber;
      }

      // Ensure it starts with +
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+' + phoneNumber;
      }

      const payload = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          body: message
        }
      };

      const response = await axios.post(
        `${this.whatsappBusinessConfig.apiBaseUrl}/${this.whatsappBusinessConfig.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.whatsappBusinessConfig.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`Verification code sent successfully via text message to ${mobile}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to send text message';
      this.logger.error(`Failed to send text message to ${mobile}: ${errorMessage}`, error.stack);
      return {
        success: false,
        error: errorMessage
      };
    }
  }


  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendLoginOTP(
    mobile: string,
  ): Promise<{ success: boolean; otp?: string; error?: string }> {
    try {
      const otp = this.generateOTP();
      const message = `Your LudoKing login OTP is: ${otp}. This OTP will expire in 5 minutes. Please do not share this OTP with anyone.`;

      const result = await this.sendWhatsApp(mobile, message);

      if (result.success) {
        return { success: true, otp };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to send OTP',
      };
    }
  }
}
