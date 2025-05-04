export async function getAvailability({type, value}: {type: string, value: string}): Promise<boolean> {
  const response = await fetch(`/api/check-email.json?type=${type}&value=${value}`);
  const data = await response.json()
  return data?.isAvailable ?? false;
}