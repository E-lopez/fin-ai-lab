import { jwtDecode } from "jwt-decode"

interface TokenPayload {
  exp: number;
  iat?: number;
  iss?: string;
  token_use?: string;
  email?: string;
}

export function userTokenVerifier() {

  const validateToken: (accessToken?: string) => {
    validated: boolean;
    reason?: string;
    email?: string;
  } = (accessToken: string = "") => {
    if(!accessToken) return { validated: false, reason: 'No token found' };
    
    try {
      // Check token format (3 parts separated by dots)
      const parts = accessToken.split('.');
      if (parts.length !== 3) return { validated: false, reason: 'Invalid token format' };
      
      const decodedToken = jwtDecode<TokenPayload>(accessToken);
      if (!decodedToken) return { validated: false, reason: 'Invalid token' };

      const currentTime = Date.now() / 1000;

      const userEmail = decodedToken.email || undefined;
      if(!userEmail) return { validated: false, reason: 'Email not found in token' };
      
      // 1. Check expiration
      if (!decodedToken.exp || decodedToken.exp <= currentTime) return { validated: false, reason: 'Token expired', userEmail };

      // 2. Check issued time (not in future)
      if (decodedToken.iat && decodedToken.iat > currentTime + 60) return { validated: false, reason: 'Invalid issued time' };

      // 3. Check issuer if present
      if (decodedToken.iss && !decodedToken.iss.includes('kredilatam.com')) return { validated: false, reason: 'Invalid issuer' };

      // 4. Check token use
      if (decodedToken.token_use && decodedToken.token_use !== 'access') return { validated: false, reason: 'Invalid token use' };

      // 5. Check token age (not older than 24 hours)
      if (decodedToken.iat && (currentTime - decodedToken.iat) > 86400) return { validated: false, reason: 'Token too old' };

      return { validated: true, userEmail };
    } catch (error) {
      console.error("Invalid token:", error);
      return { validated: false, reason: 'Invalid token' };
    }
  }

  return {
    validateToken,
  }
}