import type { Option } from '../../types';

export async function fetchOptionsFromRemote(
  url: string,
  labelKey: string = 'label',
  valueKey: string = 'value',
): Promise<Option[]> {
  const response = await fetch(url);
  const data = await response.json()
  return data.map((item: unknown) => {
    const typedItem = item as Record<string, unknown>;
    return {
      label: typedItem[labelKey],
      value: typedItem[valueKey],
      ref: typedItem,
    };
  });
}
