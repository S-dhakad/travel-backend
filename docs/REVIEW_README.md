# ⭐ Review & Rating System - Complete Guide

## 📋 Overview

GearGig में comprehensive review और rating system implement किया गया है जो users को service providers को rate करने की सुविधा देता है। यह system service completion के बाद review submit करने पर based है।

## 🎯 Key Features

### ✅ Review Management
- **Create Review** - Users can rate service providers (1-5 stars)
- **Update Review** - Edit pending reviews
- **Delete Review** - Remove own reviews
- **Admin Approval** - Reviews need admin approval before going live

### ✅ Rating Calculations
- **Automatic Rating Updates** - Real-time rating calculations
- **Service Ratings** - Per-service average ratings
- **Provider Ratings** - Overall provider ratings
- **Rating Distribution** - 1-5 star breakdown

### ✅ Review Filtering
- **Status-based** - Pending/Approved/Rejected
- **Rating-based** - Filter by star rating
- **Search** - Search in review comments
- **Pagination** - Efficient data loading

## 🏗️ Architecture

```
User Service → Creates Review → Admin Approval → Rating Updates → Public Display
```

## 📁 File Structure

```
src/review/
├── review.controller.ts    # REST API endpoints
├── review.service.ts       # Business logic & rating calculations
├── review.module.ts        # Module configuration
├── dto/review.dto.ts       # Data transfer objects
└── schemas/review.schema.ts # MongoDB schema
```

## 🗄️ Database Schema

### Review Schema
```typescript
{
  userId: ObjectId,           // Who wrote the review
  serviceProviderId: ObjectId,  // Service provider being reviewed
  serviceId: ObjectId,         // Service being reviewed
  bidId?: ObjectId,           // Related bid (optional)
  rating: number (1-5),       // Star rating
  comment: string,            // Review text
  status: 'pending'|'approved'|'rejected',
  adminResponse?: string,     // Admin comments
  approvedBy?: ObjectId,      // Admin who approved
  approvedAt?: Date,          // Approval timestamp
  createBy?: ObjectId,        // Creator
  updatedBy?: ObjectId,       // Last updater
}
```

### Updated Service Schema
```typescript
{
  // ... existing fields
  averageRating: number,      // Average rating (0-5)
  totalReviews: number,       // Total approved reviews
}
```

### Updated User Schema
```typescript
{
  // ... existing fields
  averageRating: number,      // Provider's average rating
  totalReviews: number,       // Total reviews received
}
```

## 🔧 API Endpoints

### 👤 User Endpoints

#### Create Review
```http
POST /review/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceProviderId": "service_provider_id",
  "serviceId": "service_id",
  "bidId": "bid_id", // optional
  "rating": 5,
  "comment": "Excellent service!"
}
```

#### Update Review
```http
PUT /review/update/:reviewId
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review text"
}
```

#### Delete Review
```http
DELETE /review/delete/:reviewId
Authorization: Bearer <token>
```

#### Get My Reviews
```http
GET /review/my-reviews?page=1&limit=10&status=approved
Authorization: Bearer <token>
```

### 🌐 Public Endpoints

#### Get Service Provider Reviews
```http
GET /review/service-provider/:serviceProviderId?page=1&limit=10&rating=5
```

#### Get Service Reviews
```http
GET /review/service/:serviceId?page=1&limit=10&search=excellent
```

### 👨‍💼 Admin Endpoints

#### Approve/Reject Review
```http
POST /review/admin/approve
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "reviewId": "review_id",
  "status": "approved",
  "adminResponse": "Review approved successfully"
}
```

#### Get All Reviews (Admin)
```http
GET /review/admin/all?page=1&limit=10&status=pending&serviceProviderId=xxx
Authorization: Bearer <admin-token>
```

## 📊 Rating Calculations

### Automatic Rating Updates
जब admin review approve करता है, तो system automatically rating updates करता है:

```typescript
// Service Rating Update
await updateServiceRating(serviceId) {
  const stats = await ReviewModel.aggregate([
    { $match: { serviceId, status: 'approved' } },
    { $group: {
      _id: '$serviceId',
      averageRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 }
    }}
  ]);
  
  await ServiceModel.findByIdAndUpdate(serviceId, {
    averageRating: Math.round(stats.averageRating * 10) / 10,
    totalReviews: stats.totalReviews
  });
}

// Provider Rating Update
await updateServiceProviderRating(serviceProviderId) {
  // Similar aggregation for provider ratings
}
```

### Rating Distribution
```typescript
// 5-star breakdown for display
const distribution = [1, 2, 3, 4, 5].map(stars => ({
  stars,
  count: reviews.filter(r => r.rating === stars).length
}));
```

## 🎯 User Flow

### 1. Service Completion
```
User gets service → Service marked complete → Review option available
```

### 2. Review Creation
```
User navigates to review → Selects rating (1-5) → Writes comment → Submits
```

### 3. Admin Approval
```
Review goes to pending → Admin reviews → Approves/Rejects → Rating updates
```

### 4. Public Display
```
Approved review visible → Service rating updates → Provider rating updates
```

## 🔐 Security & Permissions

### Role-based Access
```typescript
// Users can:
- Create reviews (only for services they used)
- Update/delete own reviews (only pending ones)
- View their own reviews

// Admins can:
- Approve/reject any review
- View all reviews with filters
- Add admin responses

// Public can:
- View approved reviews
- See ratings and distributions
```

### Validation Rules
```typescript
// Review Validation
- Rating: 1-5 (required)
- Comment: Max 1000 characters (required)
- One review per user per service
- Only pending reviews can be updated
- Only own reviews can be deleted
```

## 📈 Performance Optimization

### Database Indexes
```typescript
// Review Schema Indexes
ReviewSchema.index({ userId: 1, serviceId: 1 }, { unique: true });
ReviewSchema.index({ serviceProviderId: 1, status: 1 });
ReviewSchema.index({ serviceId: 1, status: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ createdAt: -1 });

// Service Schema Indexes
ServiceSchema.index({ averageRating: -1 });
ServiceSchema.index({ totalReviews: -1 });

// User Schema Indexes
UserSchema.index({ averageRating: -1 });
UserSchema.index({ totalReviews: -1 });
```

### Efficient Queries
```typescript
// Aggregation for rating stats
const ratingStats = await ReviewModel.aggregate([
  { $match: { serviceId, status: 'approved' } },
  { $group: {
    _id: '$serviceId',
    averageRating: { $avg: '$rating' },
    totalReviews: { $sum: 1 }
  }}
]);
```

## 🎨 Frontend Integration

### Review Component Structure
```typescript
// Review Form Component
interface ReviewFormProps {
  serviceProviderId: string;
  serviceId: string;
  bidId?: string;
  onSubmit: (review: CreateReviewDto) => void;
}

// Rating Display Component
interface RatingDisplayProps {
  rating: number;
  totalReviews: number;
  distribution?: RatingDistribution[];
  showDetails?: boolean;
}

// Review List Component
interface ReviewListProps {
  reviews: Review[];
  onLoadMore: () => void;
  hasMore: boolean;
}
```

### API Integration
```typescript
// Review Service
class ReviewService {
  async createReview(data: CreateReviewDto) {
    return await api.post('/review/create', data);
  }

  async getServiceProviderReviews(id: string, params?: ReviewListDto) {
    return await api.get(`/review/service-provider/${id}`, { params });
  }

  async getServiceReviews(id: string, params?: ReviewListDto) {
    return await api.get(`/review/service/${id}`, { params });
  }
}
```

## 🧪 Testing

### Unit Tests
```typescript
describe('ReviewService', () => {
  it('should create review successfully', async () => {
    const reviewData = {
      serviceProviderId: 'provider_id',
      serviceId: 'service_id',
      rating: 5,
      comment: 'Great service!'
    };
    
    const result = await reviewService.createReview(reviewData, mockRequest);
    expect(result.success).toBe(true);
  });

  it('should calculate ratings correctly', async () => {
    await reviewService.adminApproveReview(approveData, adminRequest);
    
    const service = await serviceModel.findById(serviceId);
    expect(service.averageRating).toBeGreaterThan(0);
  });
});
```

### Integration Tests
```typescript
describe('ReviewController', () => {
  it('POST /review/create should create review', async () => {
    return request(app)
      .post('/review/create')
      .set('Authorization', `Bearer ${userToken}`)
      .send(reviewData)
      .expect(201);
  });

  it('GET /review/service/:id should return reviews', async () => {
    return request(app)
      .get('/review/service/service_id')
      .expect(200);
  });
});
```

## 📊 Monitoring & Analytics

### Review Metrics
```typescript
// Review Statistics
interface ReviewStats {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  averageRating: number;
  ratingDistribution: RatingDistribution[];
}

// Admin Dashboard Data
async getReviewDashboard() {
  const stats = await Promise.all([
    this.reviewModel.countDocuments({ status: 'pending' }),
    this.reviewModel.countDocuments({ status: 'approved' }),
    this.reviewModel.countDocuments({ status: 'rejected' }),
    this.reviewModel.aggregate([{ $group: { _id: null, avgRating: { $avg: '$rating' } } }])
  ]);
  
  return {
    pending: stats[0],
    approved: stats[1],
    rejected: stats[2],
    averageRating: stats[3][0]?.avgRating || 0
  };
}
```

## 🚀 Deployment Considerations

### Environment Variables
```bash
# Review System Configuration
REVIEW_AUTO_APPROVE=false        # Manual approval required
REVIEW_MIN_RATING=1              # Minimum rating
REVIEW_MAX_RATING=5              # Maximum rating
REVIEW_COMMENT_MAX_LENGTH=1000   # Max comment length
```

### Performance Tips
1. **Use Aggregation** for rating calculations
2. **Implement Caching** for popular services
3. **Background Jobs** for rating updates
4. **Database Indexes** for fast queries
5. **Pagination** for large review lists

## 🔧 Maintenance

### Regular Tasks
```typescript
// Clean up old pending reviews
async cleanupOldPendingReviews() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  await this.reviewModel.updateMany(
    { status: 'pending', createdAt: { $lt: thirtyDaysAgo } },
    { status: 'rejected', adminResponse: 'Auto-rejected due to age' }
  );
}

// Recalculate ratings (data integrity)
async recalculateAllRatings() {
  const services = await this.serviceModel.find({});
  
  for (const service of services) {
    await this.updateServiceRating(service._id.toString());
  }
}
```

---

## 🎯 Summary

यह Review & Rating system complete functionality provide करता है:

✅ **User Reviews** - 1-5 star rating system  
✅ **Admin Approval** - Content moderation  
✅ **Auto Calculations** - Real-time rating updates  
✅ **Public Display** - Service & provider ratings  
✅ **Search & Filter** - Advanced review filtering  
✅ **Performance** - Optimized queries & indexes  
✅ **Security** - Role-based access control  

**System अब production-ready है!** 🚀
