import { loginUser, registerUser, updatePassword } from '../services/auth.service.js';
import { validatePassword, validateUserInput } from '../validators/index.js';

export async function registerController(req, res, next) {
  try {
    const errors = validateUserInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(' ') });
    }

    const result = await registerUser(req.body);

    if (result.error === 'EMAIL_EXISTS') {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    if (result.error === 'INVALID_ROLE') {
      return res.status(400).json({ message: 'Public registration is available only for Normal User and Store Owner accounts.' });
    }

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const result = await loginUser(email, password);

    if (!result) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function passwordController(req, res, next) {
  try {
    const passwordError = validatePassword(req.body.password);

    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    await updatePassword(req.user.id, req.body.password);
    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    return next(error);
  }
}
