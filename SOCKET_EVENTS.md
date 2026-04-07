# GearGig Socket.IO Events Documentation

This document outlines the Socket.IO events used in the GearGig application for real-time bidding and notifications between Users, Service Providers (Vendors/Franchises), and the Server.

## 1. Connection

**Endpoint:** `/` (Standard Socket.IO connection)
**Transports:** Polling / WebSocket

### Handshake Query Parameters
When connecting, the client **MUST** provide the `userId`.

```json
{
  "query": {
    "userId": "User_Mongo_ID"
  }
}
```

### Room Auto-Joining Logic
- **Users:** Automatically joined to `user_{userId}`.
- **Vendors/Franchise:** 
  - Joined to `user_{userId}`.
  - Joined to `franchise_{userId}`.
  - Joined to `city_{cityName}` (e.g., `city_mumbai`) based on their profile location.

---

## 2. Client -> Server Events (Emitted by App)

These events are sent from the Flutter App to the Backend.

### `create_bid`
Sent by a **User** to initiate a bid for a service.

**Payload:**
```json
{
  "serviceId": "Service_Mongo_ID",
  "proposedPrice": 500,
  "description": "I need this urgently",
  "bookingId": "Booking_Mongo_ID" // Optional, if linked to a specific booking request
}
```

### `create_counter_bid`
Sent by a **Franchise/Vendor** to counter a user's bid.

**Payload:**
```json
{
  "bidId": "Original_Bid_Mongo_ID",
  "counterPrice": 600,
  "message": "Final offer including material"
}
```

### `accept_bid`
Sent by a **User** to accept a vendor's bid or counter-bid.

**Payload:**
```json
{
  "bidId": "Bid_Mongo_ID"
}
```

### `reject_bid`
Sent by a **User** to reject a bid.

**Payload:**
```json
{
  "bidId": "Bid_Mongo_ID"
}
```

---

## 3. Server -> Client Events (Listened by App)

The Flutter App should listen for these events to update the UI in real-time.

### `bid_created`
Confirmation to the **User** that their bid was successfully created.

**Payload:**
```json
{
  "success": true,
  "message": "Bid created successfully",
  "bid": { ...bidObject }
}
```

### `new_bid`
Sent to **Nearby Vendors** (via Geo-radius or City Room) when a user creates a bid.

**Payload:**
```json
{
  "bid": { ...bidObject },
  "message": "New bid received near you for service: House Cleaning"
}
```

### `counter_bid_received`
Sent to the **User** when a vendor/franchise sends a counter-offer.

**Payload:**
```json
{
  "counterBid": { ...bidObject },
  "message": "Counter bid received: 600"
}
```

### `counter_bid_created`
Confirmation to the **Franchise** that their counter-bid was sent.

**Payload:**
```json
{
  "success": true,
  "message": "Counter bid sent successfully",
  "counterBid": { ...bidObject }
}
```

### `bid_accepted`
Sent to both **User** and **Franchise** when a bid is accepted.

**Payload:**
```json
{
  "success": true,
  "message": "Bid accepted successfully", // or "Your counter bid was accepted!"
  "bid": { ...bidObject, "status": "accepted" }
}
```

### `bid_rejected`
Sent to both **User** and **Franchise** when a bid is rejected.

**Payload:**
```json
{
  "success": true,
  "message": "Bid rejected successfully", // or "Your counter bid was rejected"
  "bid": { ...bidObject, "status": "rejected" }
}
```

### `bidding_closed`
Broadcasted to everyone involved when a bid is successfully accepted for a service.

**Payload:**
```json
{
  "serviceId": "Service_Mongo_ID",
  "acceptedBid": { ...bidObject },
  "message": "Bidding closed for this service"
}
```

### `bid_error`
Sent to the sender if any operation fails.

**Payload:**
```json
{
  "success": false,
  "message": "Error description here"
}
```

### `new_booking_request`
Sent to **Nearby Vendors** when a user creates a "Bidding" booking (`isBidding: true`).

**Payload:**
```json
{
  "booking": { ...bookingObject },
  "message": "New booking request near you!"
}
```

---

## 4. Typical Bidding Flow

1.  **User** connects socket with `userId`.
2.  **Vendors** connect socket with `userId` (server joins them to City/Location rooms).
3.  **User** emits `create_bid` for a service.
    *   Server emits `bid_created` to User.
    *   Server calculates nearby vendors -> emits `new_bid` to them.
4.  **Vendor** sees `new_bid`, emits `create_counter_bid`.
    *   Server emits `counter_bid_created` to Vendor.
    *   Server emits `counter_bid_received` to User.
5.  **User** receives `counter_bid_received`, decides to accept.
6.  **User** emits `accept_bid`.
    *   Server emits `bid_accepted` to User.
    *   Server emits `bid_accepted` to Vendor.
    *   Server emits `bidding_closed`.
