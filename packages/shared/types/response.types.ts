// Generic API Response type
export type ApiResponse<T> = {
  success: true;
  result: T;
  message?: string;
};


 export type ApiError = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, any>;
  };
};


 export type ApiResult<T> = ApiResponse<T> | ApiError;


 export interface User {
  id: number;
  name: string;
  email: string;
}

// Example API function with proper error handling
// async function fetchUser(id: number): Promise<ApiResult<User>> {
//   try {
//     const response = await fetch(`/api/users/${id}`);
    
//     if (!response.ok) {
//       // Handle HTTP errors
//       return {
//         success: false,
//         error: {
//           message: `HTTP error! status: ${response.status}`,
//           code: response.status.toString(),
//         }
//       };
//     }
    
//     const data = await response.json();
    
//     // Successful response
//     return {
//       success: true,
//       data: data as User,
//     };
//   } catch (error) {
//     // Handle network or parsing errors
//     return {
//       success: false,
//       error: {
//         message: error instanceof Error ? error.message : 'Unknown error occurred',
//       }
//     };
//   }
// }
