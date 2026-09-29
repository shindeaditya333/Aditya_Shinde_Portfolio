const Offer = require('../models/Offer');
const Application = require('../models/Application');

// @desc    Create an offer
// @route   POST /api/offers
// @access  Private (RECRUITER, ADMIN)
const createOffer = async (req, res) => {
  try {
    const { application: applicationId, salary, benefits, joiningDate } = req.body;

    if (!applicationId) {
      return res.status(400).json({ message: 'Application ID is required' });
    }
    if (!salary || !joiningDate) {
      return res.status(400).json({ message: 'Salary and joining date are required' });
    }

    // Fetch the application and derive candidate + job from it
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (app.status !== 'SELECTED') {
      return res.status(400).json({ message: 'Offer can only be extended to a SELECTED candidate. Current status: ' + app.status });
    }

    const offer = new Offer({
      application: applicationId,
      candidate: app.candidate,  // derived from application
      job: app.job,              // derived from application
      salary,
      joiningDate,
      benefits: typeof benefits === 'string' ? benefits.split(',').map(s => s.trim()) : (benefits || []),
      issuedBy: req.user._id,
      status: 'EXTENDED'
    });

    const savedOffer = await offer.save();

    await Application.findByIdAndUpdate(applicationId, {
      offer: savedOffer._id,
      status: 'OFFERED'
    });

    res.status(201).json(savedOffer);
  } catch (error) {
    // Return 400 for Mongoose validation errors, 500 for others
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get candidate's offers
// @route   GET /api/offers/my
// @access  Private (CANDIDATE)
const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ candidate: req.user._id })
      .populate('job', 'title department')
      .populate('issuedBy', 'name');
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or Reject offer
// @route   PATCH /api/offers/:id/status
// @access  Private (CANDIDATE)
const updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const offer = await Offer.findById(req.params.id);

    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    if (offer.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    offer.status = status;
    await offer.save();

    if (status === 'ACCEPTED') {
      await Application.findByIdAndUpdate(offer.application, { status: 'HIRED' });
    }

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const PDFDocument = require('pdfkit');

// @desc    Download Offer PDF
// @route   GET /api/offers/:id/pdf
// @access  Private (CANDIDATE, RECRUITER, ADMIN)
const downloadOfferPDF = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('candidate', 'name email')
      .populate('job', 'title department location type')
      .populate('issuedBy', 'name');

    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    // Authorization: Candidate can only download offer
    if (req.user.role === 'CANDIDATE' && offer.candidate._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    const candidateNameSafe = offer.candidate.name.replace(/\s+/g, '_');
    const filename = `RecruitFlow_Offer_Letter_${candidateNameSafe}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.pipe(res);

    // Header - RecruitFlow Logo / Brand
    doc.font('Helvetica-Bold').fontSize(24).fillColor('#4F46E5').text('RecruitFlow', { align: 'left' });
    doc.fontSize(10).fillColor('#6B7280').text('123 Tech Park, Innovation Valley, CA 94043', { align: 'left' });
    doc.text('hr@recruitflow.com | www.recruitflow.com', { align: 'left' });

    doc.moveDown(1.5);

    // Document Title
    doc.font('Helvetica-Bold').fontSize(16).fillColor('#111827').text('OFFER OF EMPLOYMENT', { align: 'center', underline: true });
    doc.moveDown(1.5);

    // Date & Candidate Info
    doc.font('Helvetica').fontSize(11).fillColor('#374151');
    doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    doc.moveDown();

    doc.font('Helvetica-Bold').text(offer.candidate.name);
    doc.font('Helvetica').text(`Email: ${offer.candidate.email}`);
    doc.moveDown(1.5);

    // Greeting
    doc.text(`Dear ${offer.candidate.name},`);
    doc.moveDown();

    // Professional Wording & Offer Details
    doc.text(`We are thrilled to offer you the position of `, { continued: true });
    doc.font('Helvetica-Bold').text(`${offer.job.title}`, { continued: true });
    doc.font('Helvetica').text(` at RecruitFlow. We were highly impressed with your skills and believe you will be a valuable addition to our `, { continued: true });
    doc.font('Helvetica-Bold').text(`${offer.job.department}`, { continued: true });
    doc.font('Helvetica').text(` team.`);

    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Position Details:');
    doc.font('Helvetica').text(`• Job Title: ${offer.job.title}`);
    doc.text(`• Department: ${offer.job.department}`);
    doc.text(`• Employment Type: ${offer.job.type || 'Full-time'}`);
    if (offer.job.location) doc.text(`• Work Location: ${offer.job.location}`);
    doc.text(`• Joining Date: ${new Date(offer.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);

    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Compensation & Benefits:');
    doc.font('Helvetica').text(`Your starting annual salary will be `, { continued: true });
    doc.font('Helvetica-Bold').text(`$${offer.salary.toLocaleString()}`, { continued: true });
    doc.font('Helvetica').text(`, subject to standard payroll deductions and withholdings. You will be paid in accordance with the company's standard payroll schedule.`);

    doc.moveDown(0.5);

    const validBenefits = (offer.benefits || []).filter(b => b.trim() !== '');
    if (validBenefits.length > 0) {
      doc.text('In addition, you will be eligible for the following benefits:');
      validBenefits.forEach(b => {
        doc.text(`    - ${b}`);
      });
    }

    doc.moveDown(1.5);

    doc.text('Please note that this offer is contingent upon the successful completion of a background check and your agreement to our standard terms of employment. This letter does not constitute a contract of employment for any specific period of time.');

    doc.moveDown(1.5);

    doc.text('Sincerely,');
    doc.moveDown(0.5);

    doc.font('Helvetica-Oblique').fontSize(14).text('Digital Signature');
    doc.font('Helvetica').fontSize(11);

    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text(offer.issuedBy.name);
    doc.font('Helvetica').text('Human Resources');
    doc.text('RecruitFlow');

    doc.moveDown(2);

    // Acknowledgement Section
    doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Candidate Acknowledgement & Acceptance', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').text('By signing below, I accept this offer of employment and agree to the terms outlined above.', { align: 'center' });

    doc.moveDown(2);
    doc.text('___________________________                                    ___________________________');
    doc.text(`Signature: ${offer.candidate.name}                                          Date`, { indent: 20 });

    doc.end();
  } catch (error) {
    console.error("PDF Generation Error", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { createOffer, getMyOffers, updateOfferStatus, downloadOfferPDF };
