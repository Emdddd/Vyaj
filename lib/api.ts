export type ActionStatus = "available" | "coming_soon" | "unavailable";

export type TripPlanRequest = {
  destination: string;
  duration: string;
  travellers: string;
  style: string;
  notes?: string;
};

export type ItineraryActivity = {
  time?: string;
  title: string;
  description: string;
  location?: string;
  estimatedCost?: string;
};

export type ItineraryDay = {
  day: number;
  title: string;
  summary: string;
  activities: ItineraryActivity[];
};

export type Itinerary = {
  tripTitle: string;
  destination: string;
  overview: string;
  days: ItineraryDay[];
  estimatedBudget?: { currency?: string; perPerson?: string; notes?: string };
  tips?: string[];
  assumptions?: string[];
};

export type ActionResponse<T> = {
  status: ActionStatus;
  feature: string;
  message?: string;
  data?: T;
  itinerary?: Itinerary;
};

export class ApiError extends Error {
  constructor(message: string, readonly status?: number, readonly retryable = true) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE = (process.env.NEXT_PUBLIC_VYAJ_API_URL || "https://vyaj-travel-api.kholymad.workers.dev").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 28_000;

export async function postAction<T>(
  action: string,
  payload: unknown,
  options: { signal?: AbortSignal } = {},
): Promise<ActionResponse<T>> {
  if (!API_BASE) {
    throw new ApiError("The travel service is not connected yet. Please try again later.", undefined, false);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener("abort", abortFromCaller, { once: true });

  try {
    const response = await fetch(`${API_BASE}/api/v1/actions/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    let body: ActionResponse<T> & { error?: string };
    try {
      body = await response.json();
    } catch {
      throw new ApiError("We couldn't read the response. Please try again.", response.status);
    }
    if (!response.ok) {
      throw new ApiError(body.error || "That didn't work just now. Please try again.", response.status, response.status >= 500 || response.status === 429);
    }
    if (!body || !["available", "coming_soon", "unavailable"].includes(body.status)) {
      throw new ApiError("We received an unexpected response. Please try again.");
    }
    return body;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("That took longer than expected. Please try again.", 504);
    }
    throw new ApiError("We couldn't connect just now. Check your connection and try again.");
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abortFromCaller);
  }
}
