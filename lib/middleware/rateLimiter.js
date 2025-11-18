import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter pour les tentatives de connexion admin
const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 tentatives maximum
  duration: 15 * 60, // par période de 15 minutes
  blockDuration: 15 * 60, // blocage de 15 minutes après dépassement
});

// Rate limiter pour les webhooks (protection DoS)
const webhookLimiter = new RateLimiterMemory({
  points: 100, // 100 requêtes
  duration: 60, // par minute
});

export async function checkLoginRateLimit(identifier) {
  try {
    await loginLimiter.consume(identifier);
    return { allowed: true };
  } catch (error) {
    return { 
      allowed: false, 
      retryAfter: Math.round(error.msBeforeNext / 1000)
    };
  }
}

export async function checkWebhookRateLimit(identifier) {
  try {
    await webhookLimiter.consume(identifier);
    return { allowed: true };
  } catch (error) {
    return { 
      allowed: false, 
      retryAfter: Math.round(error.msBeforeNext / 1000)
    };
  }
}
