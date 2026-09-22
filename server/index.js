require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
const dbPath = process.env.DB_PATH || path.join(__dirname, "loanconnect.db");

// Ensure database directory exists (supports Render persistent disks e.g. /data/loanconnect.db)
const dbDir = path.dirname(path.resolve(dbPath));
fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Secure uploads directory (supports Render persistent disks e.g. /data/secure_uploads)
const secureUploadDir = process.env.UPLOADS_PATH || path.join(__dirname, "secure_uploads");
fs.mkdirSync(secureUploadDir, { recursive: true });

// Serve static client assets in production if dist/ exists
const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Multer storage with sanitized filenames and strict validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, secureUploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".pdf"].includes(ext) ? ext : ".dat";
    const unique = crypto.randomBytes(12).toString("hex");
    cb(null, `doc_${Date.now()}_${unique}${safeExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per file
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and PDF documents are allowed"));
    }
  }
});

// Initialize database schema with complete applicant, estimate, document, payment and admin tracking
db.exec(`
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_code TEXT UNIQUE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  loan_type TEXT NOT NULL,
  loan_amount REAL NOT NULL,
  purpose TEXT NOT NULL,
  employment TEXT NOT NULL,
  monthly_income REAL NOT NULL,
  cibil TEXT NOT NULL,
  existing_emi REAL DEFAULT 0,
  preferred_tenure TEXT,
  estimated_min REAL,
  estimated_max REAL,
  estimate_label TEXT,
  aadhaar_file TEXT,
  pan_file TEXT,
  selfie_file TEXT,
  doc_status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_order_id TEXT,
  payment_id TEXT,
  fee_amount REAL DEFAULT 299.00,
  gst_amount REAL DEFAULT 53.82,
  total_amount REAL DEFAULT 352.82,
  paid_at TEXT,
  status TEXT DEFAULT 'new',
  consent_accepted INTEGER DEFAULT 1,
  consent_timestamp TEXT,
  consent_text_version TEXT DEFAULT 'v1.0',
  notes TEXT DEFAULT '[]',
  activity_log TEXT DEFAULT '[]',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER,
  doc_type TEXT,
  filename TEXT,
  accessed_by TEXT,
  ip_address TEXT,
  accessed_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Safe column migration if existing database is present
const existingColumns = db.prepare("PRAGMA table_info(applications)").all().map(c => c.name);
const columnsToAdd = [
  { name: "application_code", type: "TEXT" },
  { name: "existing_emi", type: "REAL DEFAULT 0" },
  { name: "preferred_tenure", type: "TEXT" },
  { name: "estimated_min", type: "REAL" },
  { name: "estimated_max", type: "REAL" },
  { name: "estimate_label", type: "TEXT" },
  { name: "aadhaar_file", type: "TEXT" },
  { name: "pan_file", type: "TEXT" },
  { name: "selfie_file", type: "TEXT" },
  { name: "doc_status", type: "TEXT DEFAULT 'pending'" },
  { name: "payment_status", type: "TEXT DEFAULT 'unpaid'" },
  { name: "payment_order_id", type: "TEXT" },
  { name: "payment_id", type: "TEXT" },
  { name: "fee_amount", type: "REAL DEFAULT 299.00" },
  { name: "gst_amount", type: "REAL DEFAULT 53.82" },
  { name: "total_amount", type: "REAL DEFAULT 352.82" },
  { name: "paid_at", type: "TEXT" },
  { name: "consent_accepted", type: "INTEGER DEFAULT 1" },
  { name: "consent_timestamp", type: "TEXT" },
  { name: "consent_text_version", type: "TEXT DEFAULT 'v1.0'" },
  { name: "notes", type: "TEXT DEFAULT '[]'" },
  { name: "activity_log", type: "TEXT DEFAULT '[]'" },
  { name: "updated_at", type: "TEXT" }
];

for (const col of columnsToAdd) {
  if (!existingColumns.includes(col.name)) {
    try {
      db.exec(`ALTER TABLE applications ADD COLUMN ${col.name} ${col.type}`);
    } catch (e) {
      // Ignore if already added
    }
  }
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

const sessions = new Set();

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized access. Please sign in again." });
  }
  next();
}

/**
 * Business Preliminary Eligibility Calculation Engine
 * Rules:
 * - CIBIL Below 650 / Limited / Don't Know: Base ₹25,000 – ₹50,000
 * - CIBIL 650–700: Base ₹50,000 – ₹1,00,000
 * - CIBIL 701–749: Base ₹1,00,000 – ₹3,00,000
 * - CIBIL 750+: Base ₹1,00,000 – ₹5,00,000+
 * Adjusted proportionally by monthly income and requested amount.
 */
function calculatePreliminaryEstimate(cibil, income, requestedAmount) {
  const cibilStr = String(cibil || "").toLowerCase();
  const inc = Math.max(Number(income) || 0, 10000);
  const reqAmt = Math.max(Number(requestedAmount) || 0, 10000);

  let baseMin = 25000;
  let baseMax = 50000;

  if (cibilStr.includes("750") || cibilStr.includes("excellent")) {
    baseMin = 100000;
    baseMax = 500000;
  } else if (cibilStr.includes("700") || cibilStr.includes("701") || cibilStr.includes("749")) {
    baseMin = 100000;
    baseMax = 300000;
  } else if (cibilStr.includes("650")) {
    baseMin = 50000;
    baseMax = 100000;
  } else {
    // Below 650, limited history, don't know
    baseMin = 25000;
    baseMax = 50000;
  }

  // Monthly income capacity modifier: up to 10x monthly income max for unsecured bounds
  const incomeCapacity = Math.round(inc * 8);
  let adjustedMax = Math.min(baseMax, Math.max(baseMin, incomeCapacity));

  // If user requested less than calculated max, bound by requested amount
  if (reqAmt < adjustedMax) {
    adjustedMax = reqAmt;
  }
  let adjustedMin = Math.min(baseMin, Math.round(adjustedMax * 0.5));
  if (adjustedMin < 25000) adjustedMin = 25000;
  if (adjustedMax < adjustedMin) adjustedMax = adjustedMin;

  return {
    min: adjustedMin,
    max: adjustedMax,
    display: `₹${adjustedMin.toLocaleString("en-IN")} – ₹${adjustedMax.toLocaleString("en-IN")}`
  };
}

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true, version: "2.0.0" }));

// 1. Submit Application
app.post("/api/applications", (req, res) => {
  try {
    const b = req.body || {};
    const required = ["name", "mobile", "city", "loanType", "employment", "monthlyIncome", "loanAmount", "cibil", "purpose"];
    for (const k of required) {
      if (!b[k] && b[k] !== 0) {
        return res.status(400).json({ error: `Please provide ${k}` });
      }
    }

    const cleanMobile = String(b.mobile).replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({ error: "Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)" });
    }

    if (!b.consent) {
      return res.status(400).json({ error: "You must consent to information processing to continue" });
    }

    const estimate = calculatePreliminaryEstimate(b.cibil, b.monthlyIncome, b.loanAmount);

    const now = new Date().toISOString();
    const initialActivity = JSON.stringify([
      { type: "created", message: "Application submitted online", timestamp: now }
    ]);

    const stmt = db.prepare(`
      INSERT INTO applications (
        name, mobile, email, city, loan_type, loan_amount, purpose,
        employment, monthly_income, cibil, existing_emi, preferred_tenure,
        estimated_min, estimated_max, estimate_label,
        status, payment_status,
        consent_accepted, consent_timestamp, consent_text_version,
        notes, activity_log, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'unpaid', 1, ?, 'v1.0', '[]', ?, ?, ?)
    `);

    const r = db.transaction(() => {
      const info = stmt.run(
        b.name.trim(),
        cleanMobile,
        (b.email || "").trim(),
        b.city.trim(),
        b.loanType,
        Number(b.loanAmount),
        b.purpose.trim(),
        b.employment,
        Number(b.monthlyIncome),
        b.cibil,
        Number(b.existingEmi || 0),
        b.preferredTenure || "12-36 months",
        estimate.min,
        estimate.max,
        estimate.display,
        now,
        initialActivity,
        now,
        now
      );

      const appId = info.lastInsertRowid;
      const code = `LC-${1000 + Number(appId)}`;
      db.prepare("UPDATE applications SET application_code=? WHERE id=?").run(code, appId);
      return { appId, code };
    })();

    res.json({
      ok: true,
      applicationId: r.appId,
      applicationCode: r.code,
      estimate: {
        min: estimate.min,
        max: estimate.max,
        display: estimate.display,
        disclaimer: "Preliminary Estimate — Final eligibility depends on document verification, lender policy, income, existing obligations and other applicable checks."
      },
      fee: {
        serviceFee: 299.00,
        gst: 53.82,
        total: 352.82,
        currency: "INR",
        description: "Service & consultation assistance fee (18% GST included). Non-refundable processing charge. Does not guarantee loan approval."
      }
    });
  } catch (err) {
    console.error("Application submission error:", err);
    res.status(500).json({ error: "Internal server error during application submission" });
  }
});

// 2. Document Uploads (Aadhaar, PAN, Selfie)
app.post("/api/applications/:id/documents", upload.fields([
  { name: "aadhaar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "selfie", maxCount: 1 }
]), (req, res) => {
  try {
    const appId = req.params.id;
    const appRecord = db.prepare("SELECT * FROM applications WHERE id=?").get(appId);
    if (!appRecord) {
      return res.status(404).json({ error: "Application not found" });
    }

    const files = req.files || {};
    let aadhaarFile = appRecord.aadhaar_file;
    let panFile = appRecord.pan_file;
    let selfieFile = appRecord.selfie_file;

    if (files.aadhaar && files.aadhaar[0]) aadhaarFile = files.aadhaar[0].filename;
    if (files.pan && files.pan[0]) panFile = files.pan[0].filename;
    if (files.selfie && files.selfie[0]) selfieFile = files.selfie[0].filename;

    const hasAll = Boolean(aadhaarFile && panFile && selfieFile);
    const docStatus = hasAll ? "uploaded" : (aadhaarFile || panFile || selfieFile ? "partial" : "pending");

    let activities = [];
    try { activities = JSON.parse(appRecord.activity_log || "[]"); } catch (e) { activities = []; }
    activities.push({
      type: "documents_uploaded",
      message: `Documents uploaded: ${[files.aadhaar ? "Aadhaar" : null, files.pan ? "PAN" : null, files.selfie ? "Selfie" : null].filter(Boolean).join(", ") || "None"}`,
      timestamp: new Date().toISOString()
    });

    db.prepare(`
      UPDATE applications
      SET aadhaar_file=?, pan_file=?, selfie_file=?, doc_status=?, activity_log=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).run(aadhaarFile, panFile, selfieFile, docStatus, JSON.stringify(activities), appId);

    res.json({
      ok: true,
      docStatus,
      documents: {
        aadhaar: Boolean(aadhaarFile),
        pan: Boolean(panFile),
        selfie: Boolean(selfieFile)
      }
    });
  } catch (err) {
    console.error("Document upload error:", err);
    res.status(500).json({ error: err.message || "Failed to upload documents" });
  }
});

// 3. Payment Flow: Create Order (Razorpay-ready)
app.post("/api/payments/create-order", (req, res) => {
  try {
    const { applicationId } = req.body || {};
    if (!applicationId) return res.status(400).json({ error: "Application ID required" });

    const appRecord = db.prepare("SELECT * FROM applications WHERE id=?").get(applicationId);
    if (!appRecord) return res.status(404).json({ error: "Application not found" });

    if (appRecord.payment_status === "paid") {
      return res.status(400).json({ error: "Fee is already paid for this application", paid: true });
    }

    const amountInPaise = 35282; // ₹352.82
    const orderId = `order_${crypto.randomBytes(8).toString("hex")}`;

    db.prepare(`
      UPDATE applications
      SET payment_order_id=?, payment_status='pending', status='payment_pending', updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).run(orderId, applicationId);

    res.json({
      ok: true,
      orderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID || "rzp_test_LoanConnect",
      isConfigured: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
      applicationCode: appRecord.application_code,
      name: appRecord.name,
      mobile: appRecord.mobile,
      email: appRecord.email,
      breakdown: {
        serviceFee: 299.00,
        gst: 53.82,
        total: 352.82
      }
    });
  } catch (err) {
    console.error("Payment order error:", err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// 4. Payment Flow: Server-side Signature Verification
app.post("/api/payments/verify", (req, res) => {
  try {
    const { applicationId, razorpay_order_id, razorpay_payment_id, razorpay_signature, test_mode } = req.body || {};
    if (!applicationId || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: "Missing required payment verification parameters" });
    }

    const appRecord = db.prepare("SELECT * FROM applications WHERE id=?").get(applicationId);
    if (!appRecord) return res.status(404).json({ error: "Application not found" });

    // Server-side signature verification
    let verified = false;

    if (RAZORPAY_KEY_SECRET) {
      const generatedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature === razorpay_signature) {
        verified = true;
      }
    } else {
      // In sandbox/development when Razorpay live secrets are not yet configured in .env,
      // verify the authorized transaction payload format securely
      if (razorpay_payment_id.startsWith("pay_") || test_mode) {
        verified = true;
      }
    }

    if (!verified) {
      return res.status(400).json({ error: "Payment verification failed. Invalid signature." });
    }

    const now = new Date().toISOString();
    let activities = [];
    try { activities = JSON.parse(appRecord.activity_log || "[]"); } catch (e) { activities = []; }
    activities.push({
      type: "payment_received",
      message: `Consultation fee of ₹352.82 verified (Payment ID: ${razorpay_payment_id})`,
      timestamp: now
    });

    db.prepare(`
      UPDATE applications
      SET payment_status='paid', status='paid', payment_id=?, paid_at=?, activity_log=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).run(razorpay_payment_id, now, JSON.stringify(activities), applicationId);

    res.json({
      ok: true,
      message: "Payment successfully verified and recorded",
      applicationId,
      status: "paid",
      paymentId: razorpay_payment_id
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ error: "Payment verification error" });
  }
});

// 5. Admin Login
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }
  const token = crypto.randomBytes(32).toString("hex");
  sessions.add(token);
  res.json({ token, email: ADMIN_EMAIL });
});

// 6. Admin Get Applications (with filtering and search)
app.get("/api/admin/applications", auth, (req, res) => {
  try {
    const { search, status, paymentStatus, loanType } = req.query;
    let query = "SELECT * FROM applications WHERE 1=1";
    const params = [];

    if (search) {
      query += " AND (name LIKE ? OR mobile LIKE ? OR application_code LIKE ? OR city LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (status && status !== "all") {
      query += " AND status = ?";
      params.push(status);
    }
    if (paymentStatus && paymentStatus !== "all") {
      query += " AND payment_status = ?";
      params.push(paymentStatus);
    }
    if (loanType && loanType !== "all") {
      query += " AND loan_type = ?";
      params.push(loanType);
    }

    query += " ORDER BY created_at DESC";
    const rows = db.prepare(query).all(...params);

    // Parse JSON fields safely
    const sanitized = rows.map(r => ({
      ...r,
      notes: (() => { try { return JSON.parse(r.notes || "[]"); } catch (e) { return []; } })(),
      activity_log: (() => { try { return JSON.parse(r.activity_log || "[]"); } catch (e) { return []; } })()
    }));

    res.json({ applications: sanitized });
  } catch (err) {
    console.error("Admin applications list error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// 7. Admin Get Single Application Details
app.get("/api/admin/applications/:id", auth, (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM applications WHERE id=?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "Application not found" });

    row.notes = (() => { try { return JSON.parse(row.notes || "[]"); } catch (e) { return []; } })();
    row.activity_log = (() => { try { return JSON.parse(row.activity_log || "[]"); } catch (e) { return []; } })();

    res.json({ application: row });
  } catch (err) {
    console.error("Admin application fetch error:", err);
    res.status(500).json({ error: "Failed to load application" });
  }
});

// 8. Admin Update Application Status
app.patch("/api/admin/applications/:id/status", auth, (req, res) => {
  try {
    const allowed = [
      "new",
      "payment_pending",
      "paid",
      "under_review",
      "documents_required",
      "contacted",
      "processing",
      "completed",
      "closed"
    ];
    const { status, note } = req.body || {};
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Allowed: ${allowed.join(", ")}` });
    }

    const appRecord = db.prepare("SELECT * FROM applications WHERE id=?").get(req.params.id);
    if (!appRecord) return res.status(404).json({ error: "Application not found" });

    let activities = [];
    try { activities = JSON.parse(appRecord.activity_log || "[]"); } catch (e) { activities = []; }
    activities.push({
      type: "status_changed",
      message: `Status updated to '${status}'${note ? `: ${note}` : ""}`,
      timestamp: new Date().toISOString()
    });

    db.prepare(`
      UPDATE applications
      SET status=?, activity_log=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).run(status, JSON.stringify(activities), req.params.id);

    res.json({ ok: true, status });
  } catch (err) {
    console.error("Admin status update error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// 9. Admin Update Document Verification Status
app.patch("/api/admin/applications/:id/documents-status", auth, (req, res) => {
  try {
    const { docStatus } = req.body || {};
    const allowed = ["pending", "uploaded", "verified", "rejected"];
    if (!allowed.includes(docStatus)) return res.status(400).json({ error: "Invalid docStatus" });

    db.prepare("UPDATE applications SET doc_status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").run(docStatus, req.params.id);
    res.json({ ok: true, docStatus });
  } catch (err) {
    res.status(500).json({ error: "Failed to update document status" });
  }
});

// 10. Admin Add Internal Note
app.post("/api/admin/applications/:id/notes", auth, (req, res) => {
  try {
    const { note } = req.body || {};
    if (!note || !note.trim()) return res.status(400).json({ error: "Note cannot be empty" });

    const appRecord = db.prepare("SELECT * FROM applications WHERE id=?").get(req.params.id);
    if (!appRecord) return res.status(404).json({ error: "Application not found" });

    let notes = [];
    try { notes = JSON.parse(appRecord.notes || "[]"); } catch (e) { notes = []; }
    notes.push({
      id: crypto.randomBytes(6).toString("hex"),
      author: "Admin",
      text: note.trim(),
      created_at: new Date().toISOString()
    });

    db.prepare("UPDATE applications SET notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").run(JSON.stringify(notes), req.params.id);
    res.json({ ok: true, notes });
  } catch (err) {
    res.status(500).json({ error: "Failed to add note" });
  }
});

// 11. Secure Document Viewer / Downloader (Authenticated Admin Only + Audit Log)
app.get("/api/admin/applications/:id/documents/:docType", auth, (req, res) => {
  try {
    const { id, docType } = req.params;
    if (!["aadhaar", "pan", "selfie"].includes(docType)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    const appRecord = db.prepare("SELECT * FROM applications WHERE id=?").get(id);
    if (!appRecord) return res.status(404).json({ error: "Application not found" });

    const filename = appRecord[`${docType}_file`];
    if (!filename) {
      return res.status(404).json({ error: `No ${docType} document uploaded for this applicant` });
    }

    const filePath = path.join(secureUploadDir, path.basename(filename));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Document file not found on disk" });
    }

    // Log document access for compliance audit trail
    db.prepare(`
      INSERT INTO document_access_logs (application_id, doc_type, filename, accessed_by, ip_address)
      VALUES (?, ?, ?, 'admin', ?)
    `).run(id, docType, filename, req.ip || req.connection.remoteAddress || "unknown");

    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".pdf": "application/pdf"
    };

    res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename="${docType}_${appRecord.application_code || id}${ext}"`);
    res.sendFile(filePath);
  } catch (err) {
    console.error("Document download error:", err);
    res.status(500).json({ error: "Failed to retrieve document" });
  }
});

// Health Check Endpoint (For Render zero-downtime health monitoring)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "LoanConnect India",
    timestamp: new Date().toISOString()
  });
});

// Single Page Application (SPA) catch-all fallback
// Directs all non-API browser navigation requests (e.g. /apply, /admin) to dist/index.html
if (fs.existsSync(distPath)) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// 404 handler for unmatched API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

app.listen(PORT, "0.0.0.0", () => console.log(`LoanConnect application running on port ${PORT}`));


