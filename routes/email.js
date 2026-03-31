const express = require('express');
const router = express.Router();
const mailgun = require('mailgun-js');
const pool = require('../db/pool');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads/assessments';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Safe filename: timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit per file
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Initialize Mailgun
const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    host: process.env.MAILGUN_REGION === 'eu' ? 'api.eu.mailgun.net' : 'api.mailgun.net'
});

/**
 * POST /api/send-email
 * Send contact form emails via Mailgun
 */
router.post('/send-email', async (req, res) => {
    try {
        const { name, email, phone, service, preferredDate, preferredTime, message } = req.body;

        // General contact form validation
        if (!name || !email || !phone) {
            return res.status(400).json({
                error: 'Name, email, and phone are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Build email HTML content
        const emailContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #3D6B82 0%, #5990AE 100%); color: white; padding: 30px; text-align: center; }
                    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
                    .field { margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px; }
                    .field:last-child { border-bottom: none; }
                    .label { font-weight: 700; color: #3D6B82; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; }
                    .value { font-size: 1.1em; color: #1f2937; }
                    .footer { background: #f9fafb; text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
                    .highlight { color: #AE7959; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 24px;">🎈 New Event Enquiry</h1>
                        <p style="margin: 5px 0 0; opacity: 0.9;">Ballooncini Haberfield</p>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">Client Name</div>
                            <div class="value">${name}</div>
                        </div>
                        <div class="field">
                            <div class="label">Contact Details</div>
                            <div class="value">
                                📧 <a href="mailto:${email}" style="color: #5990AE; text-decoration: none;">${email}</a><br>
                                📞 <a href="tel:${phone}" style="color: #5990AE; text-decoration: none;">${phone}</a>
                            </div>
                        </div>
                        <div class="field">
                            <div class="label">Service Interest</div>
                            <div class="value highlight">${service || 'General Enquiry'}</div>
                        </div>
                        ${preferredDate ? `
                        <div class="field">
                            <div class="label">Preferred Appointment</div>
                            <div class="value">📅 ${preferredDate} ${preferredTime ? `(${preferredTime})` : ''}</div>
                        </div>
                        ` : ''}
                        ${message ? `
                        <div class="field">
                            <div class="label">Additional Notes</div>
                            <div class="value" style="white-space: pre-wrap;">${message}</div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="footer">
                        <p>This enquiry was received via the Ballooncini website.</p>
                        <p>© ${new Date().getFullYear()} Ballooncini. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Save to database before sending email
        try {
            const query = `
                INSERT INTO callback_requests (
                    name, 
                    phone, 
                    email, 
                    message, 
                    service,
                    source,
                    preferred_contact_method
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `;
            
            // Format message to include preference details for DB storage
            let dbMessage = message || '';
            if (preferredDate || preferredTime) {
                dbMessage += `\n\n[Preferred Appointment: ${preferredDate || 'Not specified'} ${preferredTime || ''}]`;
            }

            const values = [
                name,
                phone,
                email,
                dbMessage,
                service || 'General Enquiry',
                'contact_form',
                'email' // Default to email as primary contact method for form submissions
            ];
            
            console.log('💾 Saving enquiry to database:', { name, service });
            const result = await pool.query(query, values);
            console.log(`✅ Enquiry saved to database (ID: ${result.rows[0].id})`);
        } catch (dbError) {
            console.error('❌ Database save error:', dbError);
            // Continue to send email even if DB fails, but log it
        }

        // Plain text version
        const textContent = `
New Event Enquiry - Ballooncini

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service || 'General Enquiry'}
${preferredDate ? `Preferred Date: ${preferredDate} ${preferredTime || ''}` : ''}

Message:
${message || 'No additional notes provided.'}

----------------------------------------
Received via Ballooncini Website
        `;

        const data = {
            from: 'Ballooncini <noreply@' + process.env.MAILGUN_DOMAIN + '>',
            to: process.env.EMAIL_TO,
            bcc: process.env.EMAIL_BCC,
            subject: `New Enquiry: ${name} - ${service || 'General'}`,

            text: textContent,
            html: emailContent
        };

        // Send email
        mg.messages().send(data, (error, body) => {
            if (error) {
                console.error('❌ Mailgun Error:', error);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            console.log('✅ Email sent successfully:', body);
            res.status(200).json({ success: true, message: 'Enquiry sent successfully' });
        });

    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/submit-assessment
 * Handle premium assessment form submissions with file upload
 */
router.post('/submit-assessment', (req, res, next) => {
    upload.array('smilePhotos', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(400).json({ error: `File upload error: ${err.message}` });
        } else if (err) {
            console.error('Unknown Upload Error:', err);
            return res.status(400).json({ error: 'Failed to upload files. Please try smaller images.' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { 
            ageGroup, 
            status, 
            concern, 
            biteType, 
            firstName, 
            lastName, 
            dob, 
            postcode, 
            email, 
            phone 
        } = req.body;
        
        const photos = req.files || []; // Array of uploaded files

        // Validation
        if (!email || !phone || !firstName) {
            return res.status(400).json({ error: 'Name, email, and phone are required' });
        }

        const name = `${firstName} ${lastName}`;
        const service = 'Event Enquiry';
        
        let photoInfo = 'No photos uploaded.';
        let photoLinks = [];
        
        if (photos.length > 0) {
            photoLinks = photos.map(p => `/uploads/assessments/${p.filename}`);
            photoInfo = `${photos.length} photo(s) uploaded: ${photos.map(p => p.originalname).join(', ')}`;
        }

        // Format details for DB message field
        const assessmentDetails = `
ENQUIRY DETAILS
------------------
• Event Type: ${ageGroup}
• Timeline: ${status}
• Service Interest: ${concern}
• Event Date: ${dob}
• Event Location: ${postcode}
• Photos: ${photoInfo}

(Submitted via Online Event Enquiry Form)
`.trim();

        // 1. Save to Database
        let dbId = null;
        try {
            const query = `
                INSERT INTO callback_requests (
                    name, 
                    phone, 
                    email, 
                    message, 
                    service,
                    source,
                    preferred_contact_method
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `;
            
            const values = [
                name,
                phone,
                email,
                assessmentDetails,
                service,
                'assessment',
                'email'
            ];
            
            const result = await pool.query(query, values);
            dbId = result.rows[0].id;
            console.log(`✅ Assessment saved to DB (ID: ${dbId})`);
        } catch (dbError) {
            console.error('❌ Database save error:', dbError);
        }

        // 2. Send Admin Email
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                    .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
                    .subtitle { opacity: 0.9; margin-top: 5px; font-size: 14px; }
                    .content { padding: 30px; }
                    .section { margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; }
                    .section:last-child { border-bottom: none; }
                    .section-title { color: #1e3a8a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 15px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                    .field { margin-bottom: 10px; }
                    .label { font-size: 12px; color: #6b7280; margin-bottom: 2px; }
                    .value { font-size: 16px; font-weight: 500; color: #111827; }
                    .highlight-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin-top: 10px; }
                    .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; }
                    .photo-preview { margin-top: 15px; padding: 10px; background: #f0fdf4; border: 1px dashed #16a34a; border-radius: 6px; color: #15803d; font-size: 13px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Event Enquiry Received</h1>
                        <div class="subtitle">Ballooncini - Event Decoration Lead</div>
                    </div>
                    <div class="content">
                        <div class="section">
                            <div class="section-title">Client Details</div>
                            <div class="grid">
                                <div class="field">
                                    <div class="label">Full Name</div>
                                    <div class="value">${name}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Event Date</div>
                                    <div class="value">${dob}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Email</div>
                                    <div class="value"><a href="mailto:${email}">${email}</a></div>
                                </div>
                                <div class="field">
                                    <div class="label">Phone</div>
                                    <div class="value"><a href="tel:${phone}">${phone}</a></div>
                                </div>
                                <div class="field">
                                    <div class="label">Location</div>
                                    <div class="value">${postcode}</div>
                                </div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">Event Details</div>
                            <div class="field">
                                <div class="label">Event Type</div>
                                <div class="value">${ageGroup}</div>
                            </div>
                            <div class="field">
                                <div class="label">Timeline</div>
                                <div class="value">${status}</div>
                            </div>
                            <div class="field">
                                <div class="label">Service Interest</div>
                                <div class="value">${concern}</div>
                            </div>
                            ${photos.length > 0 ? `
                            <div class="photo-preview">
                                📸 <strong>${photos.length} Inspiration Photo(s) Included</strong><br>
                                See attachments.
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="footer">
                        <p>ID: #${dbId || 'Pending'} • Received via Online Event Enquiry</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const data = {
            from: 'Ballooncini <noreply@' + process.env.MAILGUN_DOMAIN + '>',
            to: process.env.EMAIL_TO,
            bcc: process.env.EMAIL_BCC,
            subject: `New Event Enquiry: ${name} - ${ageGroup} ${photos.length > 0 ? '📷' : ''}`,

            text: assessmentDetails,
            html: emailHtml,
            attachment: photos.map(p => p.path)
        };

        mg.messages().send(data, (error, body) => {
            if (error) {
                console.error('❌ Mailgun Error:', error);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            res.status(200).json({ success: true, message: 'Assessment received' });
        });

    } catch (error) {
        console.error('❌ Assessment Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
