"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
