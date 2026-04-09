const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// =======================
// ADMIN ONLY ROUTES
// =======================

// Create a payment + Generate PDF
router.post('/', verifyToken, authorizeRoles('admin'), paymentController.createPayment);

// Get ALL payments globally 
router.get('/', verifyToken, authorizeRoles('admin'), paymentController.getAdminPayments);

// Update specific payment
router.put('/:id/status', verifyToken, authorizeRoles('admin'), paymentController.updatePaymentStatus);

// Update entire payment & regenerate PDF
router.put('/:id', verifyToken, authorizeRoles('admin'), paymentController.updatePayment);

// Delete payment
router.delete('/:id', verifyToken, authorizeRoles('admin'), paymentController.deletePayment);


// =======================
// CLIENT ONLY ROUTES
// =======================

// Get payments bounded to a specific client ID
router.get('/client/:clientId', verifyToken, authorizeRoles('client'), paymentController.getClientPayments);

module.exports = router;
