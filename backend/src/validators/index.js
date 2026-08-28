export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export function validateName(value) {
  if (typeof value !== 'string') {
    return 'Name is required.';
  }

  const length = value.trim().length;
  if (length < 20 || length > 60) {
    return 'Name must be between 20 and 60 characters.';
  }

  return null;
}

export function validateEmail(value) {
  if (typeof value !== 'string' || !emailRegex.test(value.trim())) {
    return 'Enter a valid email address.';
  }

  return null;
}

export function validateAddress(value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 'Address is required.';
  }

  if (value.trim().length > 400) {
    return 'Address cannot exceed 400 characters.';
  }

  return null;
}

export function validatePassword(value) {
  if (typeof value !== 'string' || !passwordRegex.test(value)) {
    return 'Password must be 8-16 characters and include an uppercase letter and a special character.';
  }

  return null;
}

export function validateUserInput(data = {}, includePassword = true) {
  const errors = [];

  for (const error of [
    validateName(data.name),
    validateEmail(data.email),
    validateAddress(data.address),
    includePassword ? validatePassword(data.password) : null,
  ]) {
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

export function validateStoreInput(data = {}) {
  const errors = [];

  for (const error of [
    validateName(data.name),
    validateEmail(data.email),
    validateAddress(data.address),
  ]) {
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

export function validateRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}
