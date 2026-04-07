# Handshake Key Implementation for GearGig Backend

## Overview
The handshake key system provides an additional layer of security for API endpoints. All protected routes require a valid handshake key to be included in the request headers.

## Features
- **Automatic Key Generation**: Generates a secure 32-byte hexadecimal key
- **Middleware Protection**: Global middleware protects all routes except public endpoints
- **Client Token System**: Optional client token generation for additional security
- **Token Expiration**: Client tokens expire after 5 minutes
- **Swagger Integration**: Handshake endpoints documented in Swagger UI

## Setup

### 1. Environment Configuration
Add the following to your `.env` file:
```env
HANDSHAKE_KEY=your-handshake-key-change-in-production
```

If no key is provided, a new one will be generated automatically on server startup.

### 2. Usage in API Requests
Include the handshake key in the request headers:
```bash
curl -X GET "http://localhost:7866/api/users" \
  -H "x-handshake-key: your-handshake-key"
```

## API Endpoints

### Get Handshake Key
```bash
GET /handshake/key
```
Returns the current handshake key.

### Validate Handshake Key
```bash
POST /handshake/validate
Headers: x-handshake-key: your-key
```
Validates if the provided handshake key is correct.

### Generate Client Token
```bash
POST /handshake/token
Headers: x-client-id: your-client-id
```
Generates a temporary client token (5-minute expiry).

### Validate Client Token
```bash
POST /handshake/token/validate
Headers: 
  x-client-id: your-client-id
  x-client-token: your-token
```
Validates a client token.

## Public Routes (No Handshake Required)
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/health`
- `/api/docs`
- `/api`
- `/health`
- `/handshake/*` (all handshake endpoints)

## Protected Routes (Handshake Required)
All other API endpoints require a valid handshake key in the `x-handshake-key` header.

## Security Features
- **HMAC-based Tokens**: Client tokens use HMAC-SHA256 for security
- **Time-based Expiration**: Tokens expire after 5 minutes
- **Request Logging**: All handshake attempts are logged
- **Error Handling**: Clear error messages for invalid/missing keys

## Implementation Details

### Middleware Flow
1. Request arrives at middleware
2. Check if route is public
3. If public: proceed to next handler
4. If protected: validate handshake key
5. If valid: proceed to next handler
6. If invalid: return 401 Unauthorized

### Key Generation
- Uses Node.js `crypto.randomBytes(32)`
- Returns 64-character hexadecimal string
- Stored in memory for the application lifetime

### Client Token System
- Optional additional security layer
- Tokens contain client ID and timestamp
- Validated using HMAC-SHA256
- Automatic expiration after 5 minutes

## Example Implementation

### Frontend Integration
```javascript
// Get handshake key
const response = await fetch('/handshake/key');
const { handshakeKey } = await response.json();

// Use handshake key in subsequent requests
const usersResponse = await fetch('/api/users', {
  headers: {
    'x-handshake-key': handshakeKey
  }
});
```

### Error Handling
```javascript
try {
  const response = await fetch('/api/users', {
    headers: {
      'x-handshake-key': handshakeKey
    }
  });
  
  if (response.status === 401) {
    // Refresh handshake key
    const newKey = await refreshHandshakeKey();
    // Retry request with new key
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

## Development Notes
- Handshake key changes on server restart if not set in environment
- All handshake attempts are logged for monitoring
- Middleware is applied globally in `main.ts`
- Swagger documentation includes handshake requirements
