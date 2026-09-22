# LoanConnect India — Loan Assistance Platform

A modern, high-conversion Indian fintech website and administrative management portal for loan assistance across all credit profiles (Good CIBIL, Low CIBIL, Urgently needed, Salaried, Self-employed, Business, and Limited credit history).

---

## Key Features & Conversion Journey

1. **High-Conversion Light & Fresh Hero**:
   - Compelling loan-focused headline: *"Need a Loan? Let’s Find the Right Option for You."*
   - Clear inclusion of both Good CIBIL and Low CIBIL borrowers without false guarantees.
   - Urgency copy: *"Need funds urgently? Complete your profile and get a preliminary eligibility range in minutes."*
   - Interactive Eligibility Preview card with animated rupee elements.
   - **Zero upfront fee mentions** in hero, navigation, or initial loan cards.

2. **Categorized Loan Assistance ("What Do You Need Funds For?")**:
   - 6 Interactive Categories: Personal Loan, Business Loan, Home Loan, Loan Against Property (LAP), Vehicle Loan, and Other Financial Needs.
   - Preselects target loan category when clicking *"Check Eligibility →"*.

3. **CIBIL Perspective & Education**:
   - Clear breakdown for CIBIL 750+, CIBIL 650–749, and Below 650 / Limited credit history.
   - Truthful lending disclosures: no false claims of "100% approval" or "guaranteed disbursement".

4. **4-Step Mobile-First Application**:
   - **Step 1: Loan Requirement** (Category, amount with quick-select chips, purpose, city).
   - **Step 2: Personal Details** (Full name, validated 10-digit Indian mobile, email, employment, monthly income).
   - **Step 3: Credit Profile** (CIBIL range, existing EMIs, preferred tenure).
   - **Step 4: Initial Documents & Consent** (Aadhaar, PAN, and Selfie photo with file validation, preview, and replace options).
   - Action Button: *"Check My Eligibility →"*.

5. **Preliminary Eligibility Calculation Engine**:
   - Computes reference range dynamically:
     - Below 650 / Limited: Base ₹25,000 – ₹50,000
     - 650–700: Base ₹50,000 – ₹1,00,000
     - 701–749: Base ₹1,00,000 – ₹3,00,000
     - 750+: Base ₹1,00,000 – ₹5,00,000+
   - Proportional adjustment factoring in monthly income capacity and requested principal.
   - Clear preliminary estimate disclaimer.

6. **Post-Result Fee Disclosure**:
   - Disclosed **only after** the preliminary estimate is computed and shown.
   - Itemized breakdown: Service Fee ₹299.00 + 18% GST ₹53.82 = **Total ₹352.82**.
   - Clear non-guarantee disclosure stating the fee is for service/consultation assistance.

7. **Production-Grade Razorpay Architecture**:
   - `/api/payments/create-order`: Generates payment order for ₹352.82.
   - `/api/payments/verify`: Performs server-side cryptographic HMAC-SHA256 signature verification.
   - Status updates only upon successful verification.

8. **Enterprise Admin Dashboard & Applicant Dossier**:
   - Metrics: Total, New, Paid, Under Review, Contacted, Completed, Closed.
   - Live search (name, mobile, code, city) and filtering (status, payment, category).
   - Detailed Applicant Profile:
     - Complete personal, loan, and credit profiles.
     - Authenticated private document viewer for Aadhaar, PAN, and Selfie with audit logging.
     - Document verification status updater (Pending / Uploaded / Verified / Rejected).
     - Internal Notes box with timestamped notes.
     - Complete application status lifecycle selector.

---

## Quick Start (Local Development)

### Requirements
- Node.js 18+

### 1. Install & Build
```bash
npm install
npm run build
```

### 2. Run Locally
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Application Flow**: http://localhost:5173/apply
- **Admin Portal**: http://localhost:5173/admin
- **Backend API**: http://localhost:5000

---

## Automated QA Validation

Run the end-to-end automated test suite to verify all business rules, CIBIL tiers, payment verification, document security, and admin endpoints:

```bash
node server/test_qa.js
```

---

## Admin Credentials

- **Email**: `admin@example.com` (configurable in `.env`)
- **Password**: `ChangeMe123!` (configurable in `.env`)

---

## Environment Variables (.env)

```ini
PORT=5000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
DB_PATH=./server/loanconnect.db

# Optional Live Razorpay Configuration
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
BUSINESS_NAME=LoanConnect India
SERVICE_FEE_INR=299
GST_PERCENT=18
```

---

## Deploying to Render (1-Click or Manual)

This project is 100% **Render Deployment Ready** as a unified full-stack Node.js + React web service.

### Option 1: Render Blueprint (Recommended)
1. Push this repository to **GitHub** or **GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Select your repository. Render automatically reads `render.yaml` and configures:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. Click **Apply**. Render will build and deploy your app with a free HTTPS URL (e.g. `https://loanconnect-india.onrender.com`).

---

### Option 2: Manual Web Service Setup
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub/GitLab repository.
4. Configure the service settings:
   - **Name**: `loanconnect-india`
   - **Runtime**: `Node`
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `ADMIN_EMAIL`: `admin@example.com`
   - `ADMIN_PASSWORD`: `<your-secure-password>`
   - `PORT`: `10000` (Render sets this automatically)
6. (Optional) If you want persistent SQLite data across re-deploys on paid plans:
   - Add a Render Disk mounted to `/data`
   - Set `DB_PATH=/data/loanconnect.db` and `UPLOADS_PATH=/data/secure_uploads`
7. Click **Create Web Service**.

---

## Security & Compliance Notice

- Sensitive documents (Aadhaar, PAN, Selfie) are stored in a private directory (`server/secure_uploads`) and are never exposed publicly through static asset folders.
- Administrative access to documents is protected via Bearer authentication and logged in `document_access_logs`.
- All loan assessments explicitly state that loans are subject to lender verification, policy, and approval.

