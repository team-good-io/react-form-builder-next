import { getAvailability } from "../../api/getAvailability";

interface AvailabilityService {
  fetch(type: string, value: string): Promise<boolean | string>;
  getCached(type: string, value: string): boolean | string | undefined;
}

class DefaultAvailabilityService implements AvailabilityService {
  private static instance: DefaultAvailabilityService;

  private cache: Map<string, boolean | string> = new Map();

  private constructor(private logger: Console) {}

  public static getInstance(): AvailabilityService {
    if (!DefaultAvailabilityService.instance) {
      DefaultAvailabilityService.instance = new DefaultAvailabilityService(console);
    }
    return DefaultAvailabilityService.instance;
  }

  private setCache(type: string, value: string, result: boolean): void {
    this.cache.set(`${type}:${value}`, result);
  }

  public getCached(type: string, value: string): boolean | string | undefined {
    return this.cache.get(`${type}:${value}`);
  }

  public async fetch(type: string, value: string): Promise<boolean | string> {
    try {
      const response = await getAvailability({ type, value });
      this.setCache(type, value, response);
      return response;
    } catch (err) {
      this.logger.warn("AvailabilityService: Fetch failed", err);
      return true; // Default to true on error
    }
  }
}

const availabilityService: AvailabilityService = DefaultAvailabilityService.getInstance();

export default availabilityService;