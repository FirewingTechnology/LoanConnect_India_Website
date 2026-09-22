// End-to-End QA Validation Script for LoanConnect India
const fs = require("fs");
const path = require("path");

async function runTests() {
  console.log("=== STARTING LOANCONNECT INDIA QA TESTS ===");

  // Start the server process if not running, or require app directly
  const express = require("express");
  const Database = require("better-sqlite3");
  
  // Test 1: Start backend test server instance
  process.env.PORT = "5055";
  process.env.DB_PATH = path.join(__dirname, "test_loanconnect.db");
  process.env.ADMIN_EMAIL = "admin@loanconnect.test";
  process.env.ADMIN_PASSWORD = "SecretAdminPass123!";
  
  // Clean up any old test db
  if (fs.existsSync(process.env.DB_PATH)) {
    try { fs.unlinkSync(process.env.DB_PATH); } catch (e) {}
  }

  const server = require("./index.js");
  const baseUrl = "http://localhost:5055/api";

  // Give server 500ms to start
  await new Promise(r => setTimeout(r, 600));

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(healthData.ok === true, "Health endpoint returns ok: true");

    // 2. Test User 1: CIBIL Below 650
    const user1Payload = {
      name: "Ramesh Sharma",
      mobile: "9876543210",
      email: "ramesh@example.com",
      city: "Jaipur",
      loanType: "personal",
      loanAmount: "50000",
      purpose: "Medical emergency",
      employment: "Salaried",
      monthlyIncome: "25000",
      cibil: "Below 650",
      existingEmi: "3000",
      preferredTenure: "12 to 24 months",
      consent: true
    };

    const user1Res = await fetch(`${baseUrl}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user1Payload)
    });
    const user1Data = await user1Res.json();
    assert(user1Res.status === 200, "User 1 (Below 650 CIBIL) submission succeeded");
    assert(user1Data.applicationCode && user1Data.applicationCode.startsWith("LC-"), "User 1 assigned applicationCode");
    assert(user1Data.estimate.min === 25000 && user1Data.estimate.max === 50000, "User 1 estimate falls in base ₹25,000 - ₹50,000 range");
    assert(user1Data.fee.serviceFee === 299 && user1Data.fee.gst === 53.82 && user1Data.fee.total === 352.82, "Fee calculation is exactly ₹299 + ₹53.82 GST = ₹352.82");

    // 3. Test User 2: CIBIL 650–700
    const user2Payload = {
      name: "Priya Patel",
      mobile: "8765432109",
      email: "priya@example.com",
      city: "Ahmedabad",
      loanType: "business",
      loanAmount: "100000",
      purpose: "Shop inventory",
      employment: "Business Owner",
      monthlyIncome: "60000",
      cibil: "650–699",
      existingEmi: "5000",
      preferredTenure: "24 to 36 months",
      consent: true
    };

    const user2Res = await fetch(`${baseUrl}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user2Payload)
    });
    const user2Data = await user2Res.json();
    assert(user2Res.status === 200, "User 2 (650-699 CIBIL) submission succeeded");
    assert(user2Data.estimate.max >= 50000 && user2Data.estimate.max <= 100000, "User 2 estimate matches 650-700 tier (max ₹1,00,000)");

    // 4. Test User 3: CIBIL 750+
    const user3Payload = {
      name: "Amitabh Verma",
      mobile: "7654321098",
      email: "amitabh@example.com",
      city: "Bengaluru",
      loanType: "home",
      loanAmount: "450000",
      purpose: "Home renovation",
      employment: "Salaried",
      monthlyIncome: "120000",
      cibil: "750+",
      existingEmi: "12000",
      preferredTenure: "36 to 60 months",
      consent: true
    };

    const user3Res = await fetch(`${baseUrl}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user3Payload)
    });
    const user3Data = await user3Res.json();
    assert(user3Res.status === 200, "User 3 (750+ CIBIL) submission succeeded");
    assert(user3Data.estimate.max >= 300000, "User 3 estimate reflects high tier CIBIL 750+");

    // 5. Validation Test: Invalid Indian Mobile
    const invalidMobileRes = await fetch(`${baseUrl}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user1Payload, mobile: "1234567890" })
    });
    assert(invalidMobileRes.status === 400, "Rejects invalid non-Indian mobile number (starts with 1)");

    // 6. Validation Test: Missing Consent
    const noConsentRes = await fetch(`${baseUrl}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user1Payload, consent: false })
    });
    assert(noConsentRes.status === 400, "Rejects application without consent");

    // 7. Test Payment Flow: Create Order & Verify
    const orderRes = await fetch(`${baseUrl}/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: user1Data.applicationId })
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 200 && orderData.orderId, "Payment order created with orderId");
    assert(orderData.amount === 35282, "Payment order amount in paise is 35282 (₹352.82)");

    const verifyRes = await fetch(`${baseUrl}/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: user1Data.applicationId,
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: "pay_test_987654321",
        razorpay_signature: "test_sig",
        test_mode: true
      })
    });
    const verifyData = await verifyRes.json();
    assert(verifyRes.status === 200 && verifyData.status === "paid", "Server-side payment verification succeeded and status updated to paid");

    // 8. Admin Login Test
    const adminLoginRes = await fetch(`${baseUrl}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@loanconnect.test", password: "SecretAdminPass123!" })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.token, "Admin login succeeded with Bearer token");
    const adminToken = adminLoginData.token;

    // 9. Unauthorized Admin API Test
    const unauthRes = await fetch(`${baseUrl}/admin/applications`);
    assert(unauthRes.status === 401, "Admin applications endpoint rejects unauthorized requests");

    // 10. Admin Applications List & Search
    const adminListRes = await fetch(`${baseUrl}/admin/applications?search=Ramesh`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminListData = await adminListRes.json();
    assert(adminListRes.status === 200, "Admin applications list loaded successfully");
    assert(adminListData.applications.some(a => a.name === "Ramesh Sharma"), "Admin search found applicant 'Ramesh Sharma'");

    // 11. Admin Update Application Status
    const updateStatusRes = await fetch(`${baseUrl}/admin/applications/${user1Data.applicationId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: "contacted", note: "Called customer regarding documents" })
    });
    const updateStatusData = await updateStatusRes.json();
    assert(updateStatusRes.status === 200 && updateStatusData.status === "contacted", "Admin status updated to 'contacted'");

    // 12. Admin Add Note
    const addNoteRes = await fetch(`${baseUrl}/admin/applications/${user1Data.applicationId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ note: "Customer requested morning callback." })
    });
    const addNoteData = await addNoteRes.json();
    assert(addNoteRes.status === 200 && addNoteData.notes.length > 0, "Admin internal note recorded successfully");

    // 13. Admin Single Application Details
    const detailRes = await fetch(`${baseUrl}/admin/applications/${user1Data.applicationId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const detailData = await detailRes.json();
    assert(detailRes.status === 200 && detailData.application.payment_status === "paid", "Application profile reflects verified 'paid' payment status");
    assert(detailData.application.status === "contacted", "Application profile reflects updated 'contacted' status");

  } catch (err) {
    console.error("Test execution encountered an error:", err);
    failed++;
  } finally {
    console.log("\n=================================");
    console.log(`TOTAL PASSED: ${passed} | TOTAL FAILED: ${failed}`);
    console.log("=================================");

    // Clean up test db
    setTimeout(() => {
      if (fs.existsSync(process.env.DB_PATH)) {
        try { fs.unlinkSync(process.env.DB_PATH); } catch (e) {}
      }
      process.exitCode = failed > 0 ? 1 : 0;
      process.exit(process.exitCode);
    }, 200);
  }
}

runTests();
