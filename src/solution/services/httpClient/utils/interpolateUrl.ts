export function interpolateUrl(template: string, values: Record<string, unknown>): string {
  return template.replace(/{([^}]+)}/g, (_, key) => encodeURIComponent(String(values[key] ?? '')));
}
