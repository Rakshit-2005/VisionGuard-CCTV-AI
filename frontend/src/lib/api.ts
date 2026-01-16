// src/lib/api.ts
// export const API_BASE_URL = "http://127.0.0.1:8000";

// export async function apiRequest(
//   endpoint: string,
//   options: RequestInit = {}
// ) {
//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     ...options,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.detail || "Something went wrong");
//   }

//   return data;
// }

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Request failed');
  }
  const data = await res.json();
  return data;
}