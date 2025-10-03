/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Calculate password strength
 * Returns: 0 (weak), 1 (fair), 2 (good), 3 (strong)
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  return Math.min(3, Math.floor(strength / 1.5));
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(strength: number): string {
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return labels[strength] || 'Weak';
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(strength: number): string {
  const colors = ['text-red-500', 'text-orange-500', 'text-blue-500', 'text-emerald-500'];
  return colors[strength] || 'text-red-500';
}

