import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../type/response.type';

@Injectable()
export class ResponseService {
  success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
    };
  }

  created<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  notFound(message: string = 'Resource not found'): ApiResponse {
    return {
      success: false,
      message,
    };
  }

  badRequest(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
    };
  }

  forbidden(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
    };
  }
}
