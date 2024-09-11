import express from 'express';
import { getWallet } from '../controllers/walletController';
import { authenticateJWT } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { walletSchema } from '../utils/validationSchemas';

const router = express.Router();

/**
 * @swagger
 * /api/wallets/{userId}:
 *   get:
 *     summary: Get a user's wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose wallet to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Server error
 */
router.get('/:userId', authenticateJWT, validateRequest(walletSchema), getWallet);

/**
 * @swagger
 * components:
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         balance:
 *           type: number
 */

export default router;
