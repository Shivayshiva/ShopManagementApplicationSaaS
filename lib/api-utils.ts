import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message })
  }, { status });
}

export function errorResponse(
  error: string,
  status: number = 500
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error
  }, { status });
}

export function validationError(field: string): NextResponse<ApiResponse> {
  return errorResponse(`${field} is required`, 400);
}

export function notFoundError(resource: string): NextResponse<ApiResponse> {
  return errorResponse(`${resource} not found`, 404);
}

export function conflictError(message: string): NextResponse<ApiResponse> {
  return errorResponse(message, 409);
}

export function unauthorizedError(): NextResponse<ApiResponse> {
  return errorResponse('Unauthorized', 401);
}

export function forbiddenError(): NextResponse<ApiResponse> {
  return errorResponse('Forbidden', 403);
}

// Utility function to handle async operations with error catching
export async function handleApiError<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'An error occurred'
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    const result = await operation();
    return successResponse(result);
  } catch (error) {
    console.error('API Error:', error);
    return errorResponse(errorMessage);
  }
}

// Utility function to validate required fields
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return field;
    }
  }
  return null;
}

// Utility function to build pagination response
export function buildPaginationResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
} 