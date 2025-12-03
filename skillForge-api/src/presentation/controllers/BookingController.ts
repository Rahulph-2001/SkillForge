import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateBookingUseCase } from '../../application/useCases/booking/CreateBookingUseCase';

const prisma = new PrismaClient();

export class BookingController {
  /**
   * Create a new booking
   * POST /api/bookings
   */
  static async createBooking(req: Request, res: Response) {
    console.log('🟡 [BookingController] createBooking called');
    console.log('🟡 [BookingController] Request body:', JSON.stringify(req.body, null, 2));
    console.log('🟡 [BookingController] Request headers:', req.headers);
    
    try {
      const userId = (req as any).user?.id;
      console.log('🟡 [BookingController] User ID from token:', userId);
      
      if (!userId) {
        console.error('❌ [BookingController] No user ID found - Unauthorized');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { skillId, providerId, preferredDate, preferredTime, message } = req.body;
      console.log('🟡 [BookingController] Extracted fields:', {
        skillId,
        providerId,
        preferredDate,
        preferredTime,
        message,
      });

      // Validation
      if (!skillId || !providerId || !preferredDate || !preferredTime) {
        console.error('❌ [BookingController] Missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          received: { skillId, providerId, preferredDate, preferredTime },
        });
      }

      console.log('🟡 [BookingController] Creating use case...');
      const createBookingUseCase = new CreateBookingUseCase(prisma);
      
      const useCaseData = {
        learnerId: userId,
        skillId,
        providerId,
        preferredDate,
        preferredTime,
        message,
      };
      console.log('🟡 [BookingController] Use case data:', JSON.stringify(useCaseData, null, 2));
      
      console.log('🟡 [BookingController] Executing use case...');
      const booking = await createBookingUseCase.execute(useCaseData);
      
      console.log('✅ [BookingController] Booking created successfully:', JSON.stringify(booking, null, 2));

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error: any) {
      console.error('❌ [BookingController] Create booking error:', error);
      console.error('❌ [BookingController] Error message:', error.message);
      console.error('❌ [BookingController] Error stack:', error.stack);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create booking',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }

  /**
   * Get all bookings for the current user (as learner)
   * GET /api/bookings/my-bookings
   */
  static async getMyBookings(req: Request, res: Response) {
    console.log('🟡 [BookingController] getMyBookings called');
    console.log('🟡 [BookingController] User from request:', (req as any).user);
    
    try {
      const userId = (req as any).user?.id;
      console.log('🟡 [BookingController] User ID:', userId);
      
      if (!userId) {
        console.error('❌ [BookingController] No user ID - Unauthorized');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.log('🔍 [BookingController] Querying bookings for learner:', userId);
      const bookings = await prisma.booking.findMany({
        where: {
          learnerId: userId,
        },
        include: {
          skill: {
            select: {
              title: true,
              category: true,
            },
          },
          provider: {
            select: {
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log(`✅ [BookingController] Found ${bookings.length} bookings`);
      console.log('📊 [BookingController] Bookings data:', JSON.stringify(bookings, null, 2));

      return res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      console.error('❌ [BookingController] Get my bookings error:', error);
      console.error('❌ [BookingController] Error message:', error.message);
      console.error('❌ [BookingController] Error stack:', error.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Get upcoming sessions for the current user
   * GET /api/bookings/upcoming
   */
  static async getUpcomingSessions(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const bookings = await prisma.booking.findMany({
        where: {
          learnerId: userId,
          status: {
            in: ['pending', 'confirmed'],
          },
          preferredDate: {
            gte: today,
          },
        },
        include: {
          skill: {
            select: {
              title: true,
              category: true,
            },
          },
          provider: {
            select: {
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          preferredDate: 'asc',
        },
      });

      return res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      console.error('❌ [BookingController] Get upcoming sessions error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming sessions',
      });
    }
  }

  /**
   * Get a specific booking by ID
   * GET /api/bookings/:id
   */
  static async getBookingById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const booking = await prisma.booking.findFirst({
        where: {
          id,
          OR: [
            { learnerId: userId },
            { providerId: userId },
          ],
        },
        include: {
          skill: {
            select: {
              title: true,
              category: true,
              description: true,
            },
          },
          provider: {
            select: {
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
          learner: {
            select: {
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error: any) {
      console.error('❌ [BookingController] Get booking by ID error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch booking',
      });
    }
  }

  /**
   * Cancel a booking
   * PATCH /api/bookings/:id/cancel
   */
  static async cancelBooking(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const { reason } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const booking = await prisma.booking.findFirst({
        where: {
          id,
          OR: [
            { learnerId: userId },
            { providerId: userId },
          ],
        },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      if (booking.status === 'cancelled' || booking.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel a ${booking.status} booking`,
        });
      }

      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: {
          status: 'cancelled',
          cancelledReason: reason || null,
          cancelledBy: userId,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: updatedBooking,
      });
    } catch (error: any) {
      console.error('❌ [BookingController] Cancel booking error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to cancel booking',
      });
    }
  }
}
