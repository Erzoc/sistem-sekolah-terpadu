import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function success<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message,
  } as ApiResponse<T>);
}

export function error(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponse,
    { status }
  );
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponse,
    { status: 401 }
  );
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponse,
    { status: 403 }
  );
}

export function notFound(message = 'Not found') {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponse,
    { status: 404 }
  );
}

export function serverError(message = 'Internal server error') {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponse,
    { status: 500 }
  );
}

// ⬇ ADD THESE ALIASES FOR BACKWARD COMPATIBILITY
export const successResponse = success;
export const errorResponse = error;
