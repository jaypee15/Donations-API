import express from 'express';
import { createDonation, getDonationCount, getDonationsByPeriod, getSingleDonation } from '../controllers/donationController';
import { authenticateJWT } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { donationSchema, donationPeriodSchema } from '../utils/validationSchemas';

const router = express.Router();

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: Create a new donation
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - donorId
 *               - beneficiaryId
 *               - amount
 *             properties:
 *               donorId:
 *                 type: string
 *               beneficiaryId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Donation created successfully
 *       400:
 *         description: Insufficient balance or invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticateJWT, validateRequest(donationSchema), createDonation);

/**
 * @swagger
 * /api/donations/count/{userId}:
 *   get:
 *     summary: Get donation count for a user
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/count/:userId', authenticateJWT, getDonationCount);

/**
 * @swagger
 * /api/donations/period/{userId}:
 *   get:
 *     summary: Get paginated donations for a user within a specific period
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalDonations:
 *                   type: integer
 *                 donations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Donation'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/period/:userId', authenticateJWT, validateRequest(donationPeriodSchema, 'query'), getDonationsByPeriod);

/**
 * @swagger
 * /api/donations/{donationId}:
 *   get:
 *     summary: Get a single donation by ID
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: donationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Donation not found
 *       500:
 *         description: Server error
 */
router.get('/:donationId', authenticateJWT, getSingleDonation);

/**
 * @swagger
 * components:
 *   schemas:
 *     Donation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         donorId:
 *           type: string
 *         beneficiaryId:
 *           type: string
 *         amount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export default router;
