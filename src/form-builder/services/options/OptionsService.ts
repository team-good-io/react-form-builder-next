import { fetchOptionsFromRemote } from "../../api/fetchOptionRemote";
import { Option } from "../../types";

interface OptionsService {
  fetch(url: string, labelKey?: string, valueKey?: string): Promise<Option[]>;
  getCached(url: string): Option[];
}

class DefaultOptionsService implements OptionsService {
  private static instance: DefaultOptionsService;

  private cache: Map<string, boolean | string> = new Map();

  private constructor(private logger: Console) {}

  public static getInstance(): OptionsService {
    if (!DefaultOptionsService.instance) {
      DefaultOptionsService.instance = new DefaultOptionsService(console);
    }
    return DefaultOptionsService.instance;
  }

  private setCache(url: string, result: Option[]): void {
    this.cache.set(url, JSON.stringify(result));
  }

  public getCached(url: string): Option[] {
    const cached = this.cache.get(url);
    if (typeof cached === 'string') {
      return JSON.parse(cached) as Option[];
    }
    return [];
  }

  public async fetch(url: string, labelKey: string = 'label', valueKey: string = 'value'): Promise<Option[]> {
    try {
      const response = await fetchOptionsFromRemote(url, labelKey, valueKey);
      this.setCache(url, response);
      return response;
    } catch (err) {
      this.logger.warn("OptionsService: Fetch failed", err);
      return []; // Default to empty array
    }
  }
}

const optionsService: OptionsService = DefaultOptionsService.getInstance();

export default optionsService;