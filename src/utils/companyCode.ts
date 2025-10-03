/**
 * Generate a unique company code in format: GR-XXXXXX
 * where X is an uppercase alphanumeric character
 */
export function generateCompanyCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'GR-';
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

/**
 * Validate company code format
 */
export function validateCompanyCodeFormat(code: string): boolean {
  const pattern = /^GR-[A-Z0-9]{6}$/;
  return pattern.test(code);
}

/**
 * Format company code input (auto-add GR- prefix and uppercase)
 */
export function formatCompanyCodeInput(input: string): string {
  // Remove any existing prefix
  let clean = input.replace(/^GR-/i, '').toUpperCase();
  
  // Remove non-alphanumeric
  clean = clean.replace(/[^A-Z0-9]/g, '');
  
  // Limit to 6 characters
  clean = clean.substring(0, 6);
  
  // Add prefix if there's content
  return clean ? `GR-${clean}` : '';
}

