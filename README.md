## Social Post 

A robust RESTful API for a social media application built with Node.js, Express, and MongoDB. Features JWT authentication, file uploads, and error handling.

### Prerequisites
- Node.js 14+ installed
- MongoDB installed and running
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/social-backend.git

# Navigate to project directory
cd social-backend

# Install dependencies
npm install

# Create uploads directory
mkdir uploads

# Start MongoDB (if local)
mongod

# Start development server
npm run dev

# Server runs at http://localhost:5000
```

##  Environment Variables

Create `.env` file in root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/social-post-app

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

##  Built With

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express | 4.18.2 | Web framework |
| MongoDB | 8.0+ | Database |
| Mongoose | 8.0.0 | ODM for MongoDB |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication |
| Multer | 1.4.5 | File upload handling |
| dotenv | 16.3.1 | Environment variables |
| CORS | 2.8.5 | Cross-origin support |

##  API Endpoints

### Authentication

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Posts

#### Get All Posts
```http
GET /api/posts

Response: 200 OK
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "user": {
        "_id": "...",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "username": "johndoe",
      "text": "Hello World!",
      "image": "/uploads/image-123456.jpg",
      "likes": [],
      "comments": [],
      "likesCount": 0,
      "commentsCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Post
```http
GET /api/posts/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "text": "Post content",
    "likes": [...],
    "comments": [...]
  }
}
```

#### Create Post (Text Only)
```http
POST /api/posts
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- text: "This is my post!"

Response: 201 Created
{
  "success": true,
  "message": "Post created successfully",
  "data": { /* post object */ }
}
```

#### Create Post (With Image)
```http
POST /api/posts
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- text: "Check out this image!"
- image: [file]

Response: 201 Created
```

#### Like/Unlike Post
```http
PUT /api/posts/:id/like
Authorization: Bearer YOUR_JWT_TOKEN

Response: 200 OK
{
  "success": true,
  "message": "Post liked", // or "Post unliked"
  "data": { /* updated post */ }
}
```

#### Add Comment
```http
POST /api/posts/:id/comment
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "text": "Great post!"
}

Response: 201 Created
{
  "success": true,
  "message": "Comment added successfully",
  "data": { /* post with new comment */ }
}
```

#### Delete Post
```http
DELETE /api/posts/:id
Authorization: Bearer YOUR_JWT_TOKEN

Response: 200 OK
{
  "success": true,
  "message": "Post deleted successfully"
}
```

#### Delete Comment
```http
DELETE /api/posts/:id/comment/:commentId
Authorization: Bearer YOUR_JWT_TOKEN

Response: 200 OK
{
  "success": true,
  "message": "Comment deleted successfully"
}
```














