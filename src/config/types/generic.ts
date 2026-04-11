export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Status = "active" | "inactive" | "suspended" | "pending" | "deleted";

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

export type TimeFilter = "today" | "7d" | "30d" | "custom";
