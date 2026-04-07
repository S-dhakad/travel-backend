# Booking, Cart & Bid Modules API Documentation

## Overview
This document covers the REST APIs and Socket.IO events for the Booking, Cart, and Bid modules of the GearGig application.

---

## 📦 Cart Module

### Base URL: `/cart`

### Authentication
All cart endpoints require authentication (`@UseGuards(AuthGuard)`)

### API Endpoints

#### 1. Add to Cart
- **Endpoint**: `POST /cart/add`
- **Description**: Add services to user's cart
- **Authentication**: Required
- **Request Body**:
```json
{
  "items": [
    {
      "serviceId": "string",
      "name": "string",
      "image": "string",
      "price": 100,
      "quantity": 1,
      "subtotal": 100
    }
  ]
}
```

#### 2. Get Cart
- **Endpoint**: `POST /cart/list`
- **Description**: Get user's cart items
- **Authentication**: Required
- **Request Body**:
```json
{
  "page": 1,
  "limit": 10
}
```

#### 3. Get Cart Summary
- **Endpoint**: `POST /cart/summary`
- **Description**: Get cart summary with total amount
- **Authentication**: Required
- **Request Body**: `{}`

#### 4. Update Cart
- **Endpoint**: `POST /cart/update`
- **Description**: Update cart items or quantities
- **Authentication**: Required
- **Request Body**:
```json
{
  "cartId": "string",
  "items": [
    {
      "serviceId": "string",
      "name": "string",
      "image": "string",
      "price": 100,
      "quantity": 2,
      "subtotal": 200
    }
  ]
}
```

#### 5. Remove from Cart
- **Endpoint**: `POST /cart/remove`
- **Description**: Remove item from cart
- **Authentication**: Required
- **Request Body**:
```json
{
  "cartId": "string",
  "serviceId": "string"
}
```

---

## 📅 Booking Module

### Base URL: `/booking`

### Authentication
All booking endpoints require authentication (`@UseGuards(AuthGuard)`)

### API Endpoints

#### 1. Create Booking
- **Endpoint**: `POST /booking/create`
- **Description**: Create a new booking
- **Authentication**: Required
- **Request Body**:
```json
{
  "serviceId": "string",
  "addressId": "string",
  "bookingDate": "2024-01-01T10:00:00Z",
  "timeSlot": "10:00-11:00",
  "totalAmount": 1000,
  "notes": "string"
}
```

#### 2. List Bookings
- **Endpoint**: `POST /booking/list`
- **Description**: Get list of bookings with filters
- **Authentication**: Required
- **Request Body**:
```json
{
  "page": 1,
  "limit": 10,
  "status": "PENDING|CONFIRMED|COMPLETED|CANCELLED",
  "serviceId": "string",
  "providerId": "string",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

#### 3. Get Available Slots
- **Endpoint**: `POST /booking/slots`
- **Description**: Get available time slots for a service
- **Authentication**: Required
- **Request Body**:
```json
{
  "serviceId": "string",
  "date": "2024-01-01"
}
```

#### 4. Get Booking Details
- **Endpoint**: `POST /booking/details`
- **Description**: Get detailed information about a booking
- **Authentication**: Required
- **Request Body**:
```json
{
  "bookingId": "string"
}
```

#### 5. Cancel Booking
- **Endpoint**: `POST /booking/cancel`
- **Description**: Cancel a booking
- **Authentication**: Required
- **Request Body**:
```json
{
  "bookingId": "string",
  "reason": "string"
}
```

#### 6. Upload Photos
- **Endpoint**: `POST /booking/upload-photos`
- **Description**: Upload photos for completed booking
- **Authentication**: Required
- **Request Body**:
```json
{
  "bookingId": "string",
  "photos": ["url1", "url2"]
}
```

#### 7. Select Bid
- **Endpoint**: `POST /booking/select-bid`
- **Description**: Select a bid for the booking
- **Authentication**: Required
- **Request Body**:
```json
{
  "bookingId": "string",
  "bidId": "string"
}
```

#### 8. Update Status
- **Endpoint**: `POST /booking/update-status`
- **Description**: Update booking status (Admin/Provider only)
- **Authentication**: Required + Permission
- **Request Body**:
```json
{
  "bookingId": "string",
  "status": "CONFIRMED|COMPLETED|CANCELLED",
  "notes": "string"
}
```

#### 9. Assign Provider
- **Endpoint**: `POST /booking/assign-provider`
- **Description**: Assign service provider to booking (Admin only)
- **Authentication**: Required + Permission
- **Request Body**:
```json
{
  "bookingId": "string",
  "providerId": "string"
}
```

---

## 💰 Bid Module

### Base URL: `/bid`

### Authentication
Most bid endpoints require authentication and permissions

### API Endpoints

#### 1. Create Bid
- **Endpoint**: `POST /bid/create`
- **Description**: Create a new bid for a service
- **Authentication**: Required
- **Request Body**:
```json
{
  "serviceId": "string",
  "proposedPrice": 1000,
  "description": "string",
  "bookingId": "string"
}
```

#### 2. List Franchise Bids
- **Endpoint**: `POST /bid/list/franchise`
- **Description**: Get bids for franchise management
- **Authentication**: Required + Permission (`bid:read`)
- **Request Body**:
```json
{
  "page": 1,
  "limit": 10,
  "status": "PENDING|ACCEPTED|REJECTED",
  "serviceId": "string"
}
```

#### 3. Create Counter Bid
- **Endpoint**: `POST /bid/counter`
- **Description**: Create a counter bid (Franchise only)
- **Authentication**: Required + Permission (`bid:update`)
- **Request Body**:
```json
{
  "bidId": "string",
  "counterPrice": 900,
  "message": "string"
}
```

#### 4. Accept Bid
- **Endpoint**: `POST /bid/accept`
- **Description**: Accept a bid or counter bid
- **Authentication**: Required + Permission (`bid:update`)
- **Request Body**:
```json
{
  "bidId": "string"
}
```

#### 5. Reject Bid
- **Endpoint**: `POST /bid/reject`
- **Description**: Reject a bid or counter bid
- **Authentication**: Required + Permission (`bid:update`)
- **Request Body**:
```json
{
  "bidId": "string",
  "reason": "string"
}
```

#### 6. List User Bids
- **Endpoint**: `POST /bid/list/user`
- **Description**: Get bids for a specific user
- **Authentication**: Required + Permission (`bid:read`)
- **Request Body**:
```json
{
  "page": 1,
  "limit": 10,
  "userId": "string"
}
```

#### 7. Get Bids by Booking
- **Endpoint**: `POST /bid/booking`
- **Description**: Get all bids for a specific booking
- **Authentication**: Required
- **Request Body**:
```json
{
  "bookingId": "string"
}
```

---

## 🔌 Socket.IO Events

### Connection
- **URL**: `ws://localhost:3000`
- **Query**: `?userId=USER_ID`

### Rooms
- `user_{userId}` - Personal room for each user
- `franchise_{userId}` - Franchise room
- `city_{cityName}` - City-based room for vendors

### Socket Events

#### 1. Create Bid
- **Emit**: `create_bid`
- **Data**:
```json
{
  "serviceId": "string",
  "proposedPrice": 1000,
  "description": "string",
  "bookingId": "string"
}
```
- **Listen**: 
  - `bid_created` - Confirmation to creator
  - `new_bid` - To nearby vendors (40km radius)
  - `bid_error` - Error response

#### 2. Create Counter Bid
- **Emit**: `create_counter_bid`
- **Data**:
```json
{
  "bidId": "string",
  "counterPrice": 900,
  "message": "string"
}
```
- **Listen**:
  - `counter_bid_created` - Confirmation to franchise
  - `counter_bid_received` - To original user
  - `bid_error` - Error response

#### 3. Accept Bid
- **Emit**: `accept_bid`
- **Data**:
```json
{
  "bidId": "string"
}
```
- **Listen**:
  - `bid_accepted` - Confirmation to user
  - `bid_accepted` - To franchise (if counter bid)
  - `bidding_closed` - To all users
  - `bid_error` - Error response

#### 4. Reject Bid
- **Emit**: `reject_bid`
- **Data**:
```json
{
  "bidId": "string"
}
```
- **Listen**:
  - `bid_rejected` - Confirmation to user
  - `bid_rejected` - To franchise (if counter bid)
  - `bid_error` - Error response

#### 5. Booking Notifications
- **Listen**: `new_booking_request` - To nearby vendors when new booking is created

---

## 📊 Flow Summary

### Cart Flow
1. User adds services to cart (`POST /cart/add`)
2. User views cart (`POST /cart/list`)
3. User updates quantities (`POST /cart/update`)
4. User proceeds to booking

### Booking Flow
1. User creates booking from cart (`POST /booking/create`)
2. System notifies nearby vendors via socket
3. Vendors can place bids
4. User selects bid (`POST /booking/select-bid`)
5. Booking status updates

### Bid Flow
1. Service provider creates bid (`POST /bid/create` or socket)
2. Franchise can create counter bid (`POST /bid/counter`)
3. User accepts/rejects bid (`POST /bid/accept` or `POST /bid/reject`)
4. Real-time notifications via socket events

---

## 🔧 Error Handling

All endpoints return standardized response format:
```json
{
  "success": true|false,
  "message": "string",
  "data": {},
  "error": "string"
}
```

### Common Error Codes
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `400` - Bad Request (validation errors)
- `500` - Internal Server Error

---

## 🚀 Usage Examples

### cURL Examples

#### Add to Cart
```bash
curl -X POST http://localhost:3000/cart/add \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "serviceId": "507f1f77bcf86cd799439011",
        "name": "Home Cleaning",
        "image": "http://example.com/image.jpg",
        "price": 500,
        "quantity": 1,
        "subtotal": 500
      }
    ]
  }'
```

#### Create Booking
```bash
curl -X POST http://localhost:3000/booking/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "507f1f77bcf86cd799439011",
    "addressId": "507f1f77bcf86cd799439012",
    "bookingDate": "2024-01-15T10:00:00Z",
    "timeSlot": "10:00-11:00",
    "totalAmount": 500
  }'
```

#### Create Bid
```bash
curl -X POST http://localhost:3000/bid/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "507f1f77bcf86cd799439011",
    "proposedPrice": 450,
    "description": "I can do this for less"
  }'
```

### Socket.IO Client Example (JavaScript)
```javascript
const socket = io('http://localhost:3000', {
  query: { userId: 'USER_ID_HERE' }
});

// Listen for new bids
socket.on('new_bid', (data) => {
  console.log('New bid received:', data);
});

// Create a bid
socket.emit('create_bid', {
  serviceId: 'SERVICE_ID',
  proposedPrice: 1000,
  description: 'Best service guaranteed'
});

// Listen for bid creation confirmation
socket.on('bid_created', (data) => {
  console.log('Bid created:', data);
});
```

---

## 📝 Notes

1. **Authentication**: All API endpoints require JWT token in Authorization header
2. **Permissions**: Some endpoints require specific permissions (bid:read, bid:update)
3. **Real-time**: Bid notifications are sent in real-time using Socket.IO
4. **Location-based**: Vendors receive notifications based on proximity (40km radius)
5. **Rate Limiting**: Consider implementing rate limiting for bid creation
6. **Validation**: All inputs are validated using class-validator decorators

---

## 🔄 Integration Points

- **WhatsApp Integration**: OTP notifications for booking confirmations
- **Location Services**: Used for finding nearby vendors
- **Payment Gateway**: Integration for booking payments
- **File Upload**: S3 integration for booking photos
- **User Management**: Role-based access control

---

*Last Updated: February 2026*
