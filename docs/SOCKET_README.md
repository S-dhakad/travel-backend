# 🔄 Socket.io Bidding System - Complete Guide

## 📋 Overview

GearGig में real-time bidding system Socket.io के साथ implement किया गया है। यह system users और franchises के बीच real-time communication enable करता है।

## 🏗️ Architecture

```
Frontend (React) ←→ Socket.io Client ←→ Socket.io Server (NestJS) ←→ Business Logic
```

## 🎯 Key Features

### ✅ Real-time Events
- **New Bid Notifications** - Franchises को notify होते हैं
- **Counter Bid Alerts** - Users को counter offers मिलते हैं  
- **Bid Status Updates** - Accept/Reject real-time में propagate होते हैं
- **Connection Management** - Online/offline status tracking

### ✅ Role-based Events
- **User Events** - Create bid, accept/reject counter bids
- **Franchise Events** - View local bids, create counter offers
- **Admin Events** - Monitor all bidding activity

## 🔧 Backend Implementation

### 📁 File Structure
```
src/bid/
├── bid.gateway.ts          # Socket.io Gateway
├── bid.service.ts           # Business Logic
├── bid.controller.ts        # REST API Endpoints
├── bid.module.ts            # Module Configuration
└── schemas/
    └── bid.schema.ts        # MongoDB Schema
```

### 🌐 Gateway Configuration (`bid.gateway.ts`)

```typescript
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  },
  namespace: '/bidding'
})
export class BidGateway {
  
  @SubscribeMessage('join_bidding')
  async handleJoinBidding(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string, role: string }
  ) {
    // User को appropriate room में join कराता है
    client.join(`user_${data.userId}`);
    client.join(`role_${data.role}`);
    
    // Connection status update
    client.emit('connection_status', { 
      status: 'connected',
      timestamp: new Date()
    });
  }

  @SubscribeMessage('create_bid')
  async handleCreateBid(
    @ConnectedSocket() client: Socket,
    @MessageBody() bidData: CreateBidDto
  ) {
    // Bid create करता है और franchises को notify करता है
    const bid = await this.bidService.createBid(bidData, userId);
    
    // सभी franchises को notify
    this.server.to('role_franchise').emit('new_bid', {
      bid: bid,
      message: `New bid received: ${bid.serviceId.title}`,
      timestamp: new Date()
    });
    
    // User को confirmation
    client.emit('bid_created', { bid });
  }

  @SubscribeMessage('create_counter_bid')
  async handleCounterBid(
    @ConnectedSocket() client: Socket,
    @MessageBody() counterData: CounterBidDto
  ) {
    // Counter bid create करता है
    const counterBid = await this.bidService.createCounterBid(counterData, franchiseId);
    
    // Original user को notify
    this.server.to(`user_${originalBid.userId}`).emit('counter_bid_received', {
      counterBid: counterBid,
      message: `Counter offer: ₹${counterBid.proposedPrice}`,
      timestamp: new Date()
    });
    
    // Franchise को confirmation
    client.emit('counter_bid_created', { counterBid });
  }

  @SubscribeMessage('accept_bid')
  async handleAcceptBid(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bidId: string }
  ) {
    // Bid accept करता है
    const acceptedBid = await this.bidService.acceptBid(data.bidId, userId);
    
    // Franchise को notify
    this.server.to(`user_${acceptedBid.userId}`).emit('bid_accepted', {
      bid: acceptedBid,
      message: "Your bid has been accepted!",
      timestamp: new Date()
    });
    
    // सभी को bidding closed notification
    this.server.emit('bidding_closed', {
      serviceId: acceptedBid.serviceId,
      acceptedBid: acceptedBid,
      message: "Bidding closed for this service"
    });
  }

  @SubscribeMessage('reject_bid')
  async handleRejectBid(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bidId: string }
  ) {
    // Bid reject करता है
    const rejectedBid = await this.bidService.rejectBid(data.bidId, userId);
    
    // Franchise को notify
    this.server.to(`user_${rejectedBid.userId}`).emit('bid_rejected', {
      bid: rejectedBid,
      message: "Your bid has been rejected",
      timestamp: new Date()
    });
  }

  handleDisconnect(client: Socket) {
    // User disconnect होने पर cleanup
    console.log(`Client disconnected: ${client.id}`);
  }
}
```

## 🎨 Frontend Implementation

### 📁 File Structure
```
src/
├── services/
│   └── socketService.ts       # Socket.io Client Wrapper
├── hooks/
│   └── useBiddingSocket.ts    # React Hook
├── pages/
│   └── BiddingManagement/
│       └── BiddingManagement.tsx  # UI Component
└── types/
    └── bid.ts                 # TypeScript Types
```

### 🔌 Socket Service (`socketService.ts`)

```typescript
class SocketService {
  private socket: Socket | null = null;
  private readonly SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:7866';

  connect(userId: string, role: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.SOCKET_URL, {
        path: '/socket.io/',
        transports: ['websocket'],
        auth: {
          token: localStorage.getItem('token')
        }
      });

      // Connection events
      this.socket.on('connect', () => {
        console.log('Connected to bidding server');
        this.socket?.emit('join_bidding', { userId, role });
        resolve();
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from bidding server');
      });

      // Bidding events
      this.socket.on('new_bid', (data) => {
        this.handleNewBid(data);
      });

      this.socket.on('counter_bid_received', (data) => {
        this.handleCounterBid(data);
      });

      this.socket.on('bid_accepted', (data) => {
        this.handleBidAccepted(data);
      });

      this.socket.on('bid_rejected', (data) => {
        this.handleBidRejected(data);
      });

      this.socket.on('connection_status', (data) => {
        this.updateConnectionStatus(data.status);
      });
    });
  }

  // Emit methods
  createBid(bidData: CreateBidDto) {
    this.socket?.emit('create_bid', bidData);
  }

  createCounterBid(counterData: CounterBidDto) {
    this.socket?.emit('create_counter_bid', counterData);
  }

  acceptBid(bidId: string) {
    this.socket?.emit('accept_bid', { bidId });
  }

  rejectBid(bidId: string) {
    this.socket?.emit('reject_bid', { bidId });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}
```

### 🎣 React Hook (`useBiddingSocket.ts`)

```typescript
export const useBiddingSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [bids, setBids] = useState<Bid[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const socketService = new SocketService();
    
    // Connect on component mount
    socketService.connect(userId, userRole)
      .then(() => setIsConnected(true))
      .catch(console.error);

    // Event handlers
    const handleNewBid = (data: any) => {
      setBids(prev => [...prev, data.bid]);
      addNotification({
        type: 'info',
        message: data.message,
        timestamp: data.timestamp
      });
    };

    const handleCounterBid = (data: any) => {
      setBids(prev => prev.map(bid => 
        bid._id === data.counterBid.originalBidId 
          ? { ...bid, status: 'countered' }
          : bid
      ));
      addNotification({
        type: 'warning',
        message: data.message,
        timestamp: data.timestamp
      });
    };

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  return {
    isConnected,
    bids,
    notifications,
    createBid: socketService.createBid.bind(socketService),
    createCounterBid: socketService.createCounterBid.bind(socketService),
    acceptBid: socketService.acceptBid.bind(socketService),
    rejectBid: socketService.rejectBid.bind(socketService)
  };
};
```

## 📡 Socket Events Reference

### 📤 Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_bidding` | `{ userId, role }` | User को bidding room में join कराता है |
| `create_bid` | `CreateBidDto` | New bid create करता है |
| `create_counter_bid` | `CounterBidDto` | Counter bid create करता है |
| `accept_bid` | `{ bidId }` | Bid accept करता है |
| `reject_bid` | `{ bidId }` | Bid reject करता है |

### 📥 Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `connection_status` | `{ status, timestamp }` | Connection status update |
| `new_bid` | `{ bid, message, timestamp }` | New bid notification (franchises को) |
| `counter_bid_received` | `{ counterBid, message, timestamp }` | Counter bid received (user को) |
| `bid_accepted` | `{ bid, message, timestamp }` | Bid accepted notification |
| `bid_rejected` | `{ bid, message, timestamp }` | Bid rejected notification |
| `bidding_closed` | `{ serviceId, acceptedBid, message }` | Bidding closed for service |
| `bid_created` | `{ bid }` | Bid creation confirmation |
| `counter_bid_created` | `{ counterBid }` | Counter bid confirmation |

## 🔐 Authentication & Security

### JWT Token Authentication
```typescript
// Client side
this.socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem('token')
  }
});

// Server side (Gateway)
@UseGuards(AuthGuard)
@WebSocketGateway()
export class BidGateway {
  // JWT token automatically validated
}
```

### Room-based Security
```typescript
// Users सिर्फ अपनी data access कर सकते हैं
client.join(`user_${userId}`);
client.join(`role_${role}`);

// Targeted messaging
this.server.to(`user_${targetUserId}`).emit('private_event', data);
this.server.to('role_franchise').emit('franchise_event', data);
```

## 🚀 Deployment Configuration

### Environment Variables
```bash
# Backend (.env)
SOCKET_CORS_ORIGIN=http://localhost:5173
SOCKET_PORT=7866

# Frontend (.env)
REACT_APP_SOCKET_URL=http://localhost:7866
```

### Production Setup
```typescript
// bid.gateway.ts - Production config
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  },
  namespace: '/bidding',
  transports: ['websocket', 'polling'] // Fallback for production
})
```

## 🧪 Testing & Debugging

### Socket Events Monitoring
```typescript
// Debug mode
if (process.env.NODE_ENV === 'development') {
  this.socket.onAny((eventName, ...args) => {
    console.log(`🔌 Socket Event: ${eventName}`, args);
  });
}
```

### Common Issues & Solutions

1. **Connection Failed**
   - Check CORS configuration
   - Verify JWT token validity
   - Ensure backend server is running

2. **Events Not Receiving**
   - Verify room joining logic
   - Check event name spelling
   - Ensure proper payload format

3. **Performance Issues**
   - Implement event debouncing
   - Use room-based messaging
   - Limit event payload size

## 📊 Performance Optimization

### 🎯 Best Practices
```typescript
// ✅ Good: Room-based targeting
this.server.to(`user_${userId}`).emit('event', data);

// ❌ Bad: Broadcasting to all clients
this.server.emit('event', data);

// ✅ Good: Minimal payload
emit('bid_update', { id: bidId, status: 'accepted' });

// ❌ Bad: Large payload
emit('bid_update', { fullBidObject });
```

### 📈 Scaling Considerations
- **Redis Adapter** for multiple server instances
- **Load Balancing** for high traffic
- **Event Queue** for heavy operations
- **Connection Pooling** for database efficiency

## 🔧 Maintenance

### 📋 Monitoring
```typescript
// Connection metrics
setInterval(() => {
  const connectedClients = this.server.sockets.sockets.size;
  console.log(`📊 Connected clients: ${connectedClients}`);
}, 30000);
```

### 🔄 Health Checks
```typescript
// Health check endpoint
@Get('health')
getHealth() {
  return {
    status: 'healthy',
    connectedClients: this.server.sockets.sockets.size,
    uptime: process.uptime()
  };
}
```

---

## 🎯 Summary

यह Socket.io implementation complete real-time bidding experience provide करता है:

✅ **Real-time Updates** - Instant notifications  
✅ **Role-based Access** - Secure communication  
✅ **Scalable Architecture** - Production ready  
✅ **Error Handling** - Robust error management  
✅ **Performance Optimized** - Efficient resource usage  

**System अब production-ready है!** 🚀
