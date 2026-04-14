const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const htmlToPdf = require('html-pdf-node');
const ejs = require('ejs');
const Agreement = require('../models/Agreement');
const { cloudinary, storage } = require('../config/cloudinary');

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg', 
            'image/png', 
            'image/webp'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, Word Documents, and Images are allowed.'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB Limit
});


// Helper to generate PDF from HTML
const generatePDF = async (agreement) => {
    const filename = `contract-${agreement._id}-${Date.now()}.pdf`;
    
    // Add signature indicator info to the HTML before rendering
    let contentWithSigs = agreement.content;
    if (agreement.adminSigned || agreement.clientSigned) {
        contentWithSigs += `
        <div style="margin-top: 20px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px dashed #eee; padding-top: 10px;">
            Digital Signature Log:<br>
            ${agreement.adminSigned ? `Admin Signed on ${new Date(agreement.adminSignedAt).toLocaleString()} | ` : ''}
            ${agreement.clientSigned ? `Client Signed on ${new Date(agreement.clientSignedAt).toLocaleString()}` : ''}
        </div>`;
    }

    const options = { format: 'A4', margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } };
    const file = { content: contentWithSigs };
    
    return new Promise((resolve, reject) => {
        htmlToPdf.generatePdf(file, options).then(pdfBuffer => {
            // Upload PDF buffer directly to Cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: 'client-management/generated-contracts',
                    public_id: filename.replace('.pdf', ''),
                    format: 'pdf'
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary PDF Upload Error:", error);
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );
            uploadStream.end(pdfBuffer);
        }).catch(err => {
            console.error("PDF Generate Error Detail:", err);
            reject(err);
        });
    });
};

// @route   POST /api/agreements/upload (Manual)
router.post('/upload', verifyToken, upload.single('agreementFile'), async (req, res) => {
    try {
        const { projectName, uploadedByRole, uploadedByName, clientId } = req.body;

        if (!projectName) {
            return res.status(400).json({ message: 'Project Name is required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const fileUrl = req.file.path; // This is the Cloudinary URL from multer-storage-cloudinary
        
        const newAgreement = await Agreement.create({
            projectName,
            type: 'manual',
            status: 'Active',
            fileUrl,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadedByRole: uploadedByRole || (req.user.role === 'client' ? 'client' : 'admin'),
            uploadedByName: uploadedByName || 'Unknown',
            clientId: clientId || (req.user.role === 'client' ? req.user.id : null),
            adminId: req.user.role === 'admin' ? req.user.id : null,
            clientSigned: true, 
            adminSigned: true
        });

        res.status(201).json({ message: 'Agreement uploaded successfully', agreement: newAgreement });
    } catch (error) {
        console.error('Agreement Upload Error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

// @route   POST /api/agreements/digital
router.post('/digital', verifyToken, async (req, res) => {
    try {
        const { projectName, content, uploadedByRole, uploadedByName, clientId, contractorName, location, contactNumber, totalCost, area, agreementNumber, meetingPlace, clientAddress, plotDetails } = req.body;

        if (!projectName) {
            return res.status(400).json({ message: 'Project Name is required.' });
        }

        // Use EJS template if content is not provided or standard
        let finalContent = content;
        if (!content || content.includes('Standard Agreement terms applied')) {
            const templatePath = path.join(__dirname, '../views/agreement.ejs');
            finalContent = await ejs.renderFile(templatePath, { 
                agreement: { projectName, uploadedByName, contractorName, location, contactNumber, totalCost, area, agreementNumber, meetingPlace, clientAddress, plotDetails, _id: 'TEMP' }
            });
        }

        const newAgreement = await Agreement.create({
            projectName,
            type: 'digital',
            content: finalContent,
            status: 'Unsigned',
            uploadedByRole: uploadedByRole || (req.user.role === 'client' ? 'client' : 'admin'),
            uploadedByName: uploadedByName || 'Unknown',
            clientId: clientId || (req.user.role === 'client' ? req.user.id : null),
            adminId: req.user.role === 'admin' ? req.user.id : (clientId ? null : null), // Can be improved
            contractorName: contractorName || '',
            location,
            contactNumber,
            totalCost,
            area,
            agreementNumber,
            meetingPlace,
            clientAddress,
            plotDetails
        });

        res.status(201).json({ message: 'Digital contract created successfully', agreement: newAgreement });
    } catch (error) {
        console.error('Digital Contract Error:', error);
        res.status(500).json({ message: 'Server error during creation' });
    }
});

// @route   PUT /api/agreements/:id (Update Content)
router.put('/:id', async (req, res) => {
    try {
        const { content, projectName, lastEditedBy } = req.body;
        const agreement = await Agreement.findById(req.params.id);
        if (!agreement) return res.status(404).json({ message: 'Agreement not found' });

        if (agreement.status === 'Active') {
            return res.status(400).json({ message: 'Cannot edit an active (fully signed) agreement.' });
        }

        // Update fields
        if (content) agreement.content = content;
        if (projectName) agreement.projectName = projectName;
        if (lastEditedBy) agreement.lastEditedBy = lastEditedBy;
        
        agreement.updatedAt = new Date();

        // Reset signatures if content changed significantly
        if (content && content !== agreement.content) {
            agreement.adminSigned = false;
            agreement.clientSigned = false;
            agreement.status = 'Unsigned';
        }

        await agreement.save();
        res.status(200).json({ message: 'Agreement updated successfully', agreement });
    } catch (error) {
        console.error('Update Agreement Error:', error);
        res.status(500).json({ message: 'Server error during update' });
    }
});

// @route   PUT /api/agreements/:id/sign
router.put('/:id/sign', async (req, res) => {
    try {
        const { role } = req.body; // 'admin' or 'client'
        const agreement = await Agreement.findById(req.params.id);
        if (!agreement) return res.status(404).json({ message: 'Agreement not found' });

        if (role === 'admin') {
            agreement.adminSigned = true;
            agreement.adminSignedAt = new Date();
        } else if (role === 'client') {
            agreement.clientSigned = true;
            agreement.clientSignedAt = new Date();
        } else {
            return res.status(400).json({ message: 'Invalid role for signature' });
        }

        if (agreement.adminSigned && agreement.clientSigned) {
            agreement.status = 'Active';
            const pdfUrl = await generatePDF(agreement);
            agreement.fileUrl = pdfUrl;
            agreement.originalName = `contract-${agreement.projectName.replace(/\\s+/g, '-')}.pdf`;
        } else {
            agreement.status = 'Partially Signed';
        }

        await agreement.save();
        res.status(200).json({ message: 'Agreement signed successfully', agreement });
    } catch (error) {
        console.error('Sign Agreement Error:', error);
        res.status(500).json({ message: 'Server error during signing' });
    }
});

// @route   GET /api/agreements
router.get('/', verifyToken, async (req, res) => {
    try {
        let query = {};
        // If client, only show their own agreements
        if (req.user.role === 'client') {
            query = { clientId: req.user.id };
        } else if (req.user.role === 'admin') {
            // Admin only sees agreements they initiated/uploaded
            query = { adminId: req.user.id };
        }
        const agreements = await Agreement.find(query).sort({ updatedAt: -1 });
        res.status(200).json(agreements);
    } catch (error) {
        console.error('Failed to fetch agreements:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/agreements/:id
router.delete('/:id', async (req, res) => {
    try {
        await Agreement.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Agreement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during deletion' });
    }
});
module.exports = router;
