const Payment = require('../models/Payment');
const Project = require('../models/Project');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure bills directory exists
const billsDir = path.join(__dirname, '..', 'uploads', 'bills');
if (!fs.existsSync(billsDir)) {
    fs.mkdirSync(billsDir, { recursive: true });
}

// Helper to generate Invoice ID
const generateBillNumber = () => {
    return 'INV-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000);
};

// Create a new Payment
exports.createPayment = async (req, res) => {
    try {
        const { projectId, clientId, amount, paymentMode, notes } = req.body;
        const addedBy = req.user.id; // From auth middleware

        if (!projectId || !clientId || !amount || !paymentMode) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const project = await Project.findById(projectId).populate('clientId');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const billNumber = generateBillNumber();
        const billFilename = `${billNumber}.pdf`;
        const billFilePath = path.join(billsDir, billFilename);
        const billRelativeUrl = `/uploads/bills/${billFilename}`;

        // 1. Generate PDF
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(fs.createWriteStream(billFilePath));

        // Format PDF Content
        doc.fontSize(20).text('INVOICE / PAYMENT RECEIPT', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Bill Number: ${billNumber}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        doc.text(`Company Name: Client Management Portal`);
        doc.text(`Client Name: ${project.clientId ? project.clientId.name : 'Unknown Client'}`);
        doc.text(`Project Name: ${project.name}`);
        doc.moveDown();

        doc.text(`Payment Mode: ${paymentMode}`);
        doc.text(`Amount Paid: Rs. ${amount}`, { underline: true });

        if (notes) {
            doc.moveDown();
            doc.text(`Notes: ${notes}`);
        }

        doc.moveDown();
        doc.moveDown();
        doc.text('_______________________', { align: 'right' });
        doc.text('Authorized Signature    ', { align: 'right' });

        doc.end();

        // 2. Create Payment Record
        const payment = new Payment({
            projectId,
            clientId,
            amount: Number(amount),
            paymentMode,
            paymentStatus: 'completed',
            billNumber,
            billFile: billRelativeUrl,
            notes,
            addedBy
        });

        await payment.save();

        // 3. Update Project Budget Metrics
        project.totalPaid += Number(amount);
        project.remainingAmount = project.totalBudget - project.totalPaid;

        if (project.totalPaid >= project.totalBudget) {
            project.paymentStatus = 'completed';
        } else if (project.totalPaid > 0) {
            project.paymentStatus = 'partial';
        }

        await project.save();

        res.status(201).json({ message: "Payment recorded successfully", payment });
    } catch (err) {
        console.error("Payment Creation Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Admin: Get all Payments
exports.getAdminPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('projectId', 'name totalBudget totalPaid')
            .populate('clientId', 'name email')
            .populate('addedBy', 'username')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Client: Get their own strictly
exports.getClientPayments = async (req, res) => {
    try {
        // Technically, the token already has user ID. We guarantee via middleware or here.
        const clientId = req.params.clientId;
        const payments = await Payment.find({ clientId: clientId })
            .populate('projectId', 'name')
            .sort({ createdAt: -1 });

        // Provide summary stats
        const projectSummaries = await Project.find({ clientId: clientId }).select('name totalBudget totalPaid remainingAmount paymentStatus');

        res.json({ payments, projectSummaries });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Payment Status (Admin Only)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const { paymentStatus } = req.body;

        const payment = await Payment.findByIdAndUpdate(paymentId, { paymentStatus }, { new: true });
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        res.json({ message: "Payment status updated", payment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Payment Details and Regenerate PDF (Admin Only)
exports.updatePayment = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const { amount, paymentMode, notes } = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        const oldAmount = payment.amount;
        const newAmount = Number(amount);

        // Update payment fields
        payment.amount = newAmount;
        payment.paymentMode = paymentMode;
        payment.notes = notes;
        await payment.save();

        const project = await Project.findById(payment.projectId).populate('clientId');
        if (project) {
            // Adjust project totals
            project.totalPaid = project.totalPaid - oldAmount + newAmount;
            project.remainingAmount = project.totalBudget - project.totalPaid;

            if (project.totalPaid >= project.totalBudget) {
                project.paymentStatus = 'completed';
            } else if (project.totalPaid > 0) {
                project.paymentStatus = 'partial';
            } else {
                project.paymentStatus = 'pending';
            }
            await project.save();

            // Regenerate PDF
            const billFilePath = path.join(__dirname, '..', payment.billFile);
            const doc = new PDFDocument({ margin: 50 });
            doc.pipe(fs.createWriteStream(billFilePath));

            // Format PDF Content
            doc.fontSize(20).text('INVOICE / PAYMENT RECEIPT', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Bill Number: ${payment.billNumber}`);
            doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`);
            doc.moveDown();

            doc.text(`Company Name: Client Management Portal`);
            doc.text(`Client Name: ${project.clientId ? project.clientId.name : 'Unknown Client'}`);
            doc.text(`Project Name: ${project.name}`);
            doc.moveDown();

            doc.text(`Payment Mode: ${paymentMode}`);
            doc.text(`Amount Paid: Rs. ${newAmount}`, { underline: true });

            if (notes) {
                doc.moveDown();
                doc.text(`Notes: ${notes}`);
            }

            doc.moveDown();
            doc.moveDown();
            doc.text('_______________________', { align: 'right' });
            doc.text('Authorized Signature    ', { align: 'right' });

            doc.end();
        }

        res.json({ message: "Payment updated successfully", payment });
    } catch (err) {
        console.error("Payment Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Delete Payment (Admin Only)
exports.deletePayment = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const payment = await Payment.findById(paymentId);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        const project = await Project.findById(payment.projectId);
        if (project) {
            project.totalPaid -= payment.amount;
            project.remainingAmount = project.totalBudget - project.totalPaid;

            if (project.totalPaid >= project.totalBudget) {
                project.paymentStatus = 'completed';
            } else if (project.totalPaid > 0) {
                project.paymentStatus = 'partial';
            } else {
                project.paymentStatus = 'pending';
            }
            await project.save();
        }

        // Delete the PDF if exists
        const billFilePath = path.join(__dirname, '..', payment.billFile);
        if (fs.existsSync(billFilePath)) {
            fs.unlinkSync(billFilePath);
        }

        await Payment.findByIdAndDelete(paymentId);
        res.json({ message: "Payment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
