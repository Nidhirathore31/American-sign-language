const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TestResult {
  id: number;
  userId: number;
  score: number;
  total: number;
  percentage: number;
  results: Array<{
    signId: number;
    signName: string;
    correct: boolean;
    feedback: string;
  }>;
  createdAt: string;
}

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return authToken;
};

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const authAPI = {
  register: async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    const data = await fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    // Don't store token on registration - user should login separately
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    return data;
  },
};

export const testAPI = {
  saveTest: async (
    score: number,
    total: number,
    results: Array<{
      signId: number;
      signName: string;
      correct: boolean;
      feedback: string;
    }>
  ): Promise<TestResult> => {
    return fetchAPI("/test", {
      method: "POST",
      body: JSON.stringify({ score, total, results }),
    });
  },

  getHistory: async (): Promise<TestResult[]> => {
    return fetchAPI("/test/history");
  },

  getTestResult: async (id: number): Promise<TestResult> => {
    return fetchAPI(`/test/${id}`);
  },
};
