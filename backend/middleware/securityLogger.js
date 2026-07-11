import { securityLogger } from '../config/logger.js';

export const logSecurityEvent = (eventType, details) => {
  securityLogger.info({
    event: eventType,
    timestamp: new Date().toISOString(),
    ...details
  });
};

export const logFailedLogin = (email, ip, userAgent) => {
  logSecurityEvent('FAILED_LOGIN', {
    email,
    ip,
    userAgent
  });
};

export const logSuccessfulLogin = (userId, email, ip, userAgent) => {
  logSecurityEvent('SUCCESSFUL_LOGIN', {
    userId,
    email,
    ip,
    userAgent
  });
};

export const logAccountLockout = (email, ip, userAgent) => {
  logSecurityEvent('ACCOUNT_LOCKOUT', {
    email,
    ip,
    userAgent
  });
};

export const logSuspiciousActivity = (activity, ip, details) => {
  logSecurityEvent('SUSPICIOUS_ACTIVITY', {
    activity,
    ip,
    details
  });
};

export const logRateLimitExceeded = (ip, endpoint) => {
  logSecurityEvent('RATE_LIMIT_EXCEEDED', {
    ip,
    endpoint
  });
};

export const logUnauthorizedAccess = (ip, endpoint, userAgent) => {
  logSecurityEvent('UNAUTHORIZED_ACCESS', {
    ip,
    endpoint,
    userAgent
  });
};
