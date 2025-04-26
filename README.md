Node.js + Express + MongoDB backend for managing health programs and clients.

---

## Setup Instructions

1. **Clone**
   ```bash
   git clone https://github.com/Onesmus123/CEMA-healthsystem.git
   cd backend
   ```

2. **Install**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```
   MONGO_URI=your-mongodb-uri
   PORT=5000
   ```

4. **Run**
   ```bash
   nodemon server.js
   ```

---

## API Endpoints (use Postman)

| Method | Endpoint | Description |
|:------:|:--------:|:-----------:|
| POST   | /api/programs | Create a health program |
| GET    | /api/programs | List all health programs |
| POST   | /api/clients | Register a client |
| GET    | /api/clients/:email | Get client by email |
| PUT    | /api/clients/:email/enroll | Enroll client in programs |


---

Would you also like an even *ultra-minimal* version (literally 5 lines)? 🚀