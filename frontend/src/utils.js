export const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserForm(form, includePassword = true) {
  const errors = {};
  const nameLength = form.name?.trim().length || 0;

  if (nameLength < 20 || nameLength > 60) {
    errors.name = 'Name must be between 20 and 60 characters.';
  }

  if (!emailPattern.test(form.email?.trim() || '')) {
    errors.email = 'Enter a valid email address.';
  }

  const addressLength = form.address?.trim().length || 0;
  if (addressLength === 0 || addressLength > 400) {
    errors.address = 'Address is required and cannot exceed 400 characters.';
  }

  if (includePassword && !passwordPattern.test(form.password || '')) {
    errors.password = 'Use 8-16 characters with an uppercase letter and a special character.';
  }

  return errors;
}

export function validateStoreForm(form) {
  return validateUserForm({ ...form, password: 'Temp@123' }, false);
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export function roleLabel(role) {
  const labels = {
    admin: 'Administrator',
    user: 'Normal User',
    owner: 'Store Owner',
  };
  return labels[role] || role;
}
