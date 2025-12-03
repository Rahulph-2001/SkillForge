

import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { AcceptBookingUseCase } from '../../application/useCases/booking/AcceptBookingUseCase';
import { DeclineBookingUseCase } from '../../application/useCases/booking/DeclineBookingUseCase';
import { CancelBookingUseCase } from '../../application/useCases/booking/CancelBookingUseCase';
import { RescheduleBookingUseCase } from '../../application/useCases/booking/RescheduleBookingUseCase';
import { GetProviderBookingsUseCase } from '../../application/useCases/booking/GetProviderBookingsUseCase';

@injectable()
export class SessionManagementController {
  constructor(
    @inject(TYPES.AcceptBookingUseCase)
    private readonly acceptBookingUseCase: AcceptBookingUseCase,
    @inject(TYPES.DeclineBookingUseCase)
    private readonly declineBookingUseCase: DeclineBookingUseCase,
    @inject(TYPES.CancelBookingUseCase)
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    @inject(TYPES.RescheduleBookingUseCase)
    private readonly rescheduleBookingUseCase: RescheduleBookingUseCase,
    @inject(TYPES.GetProviderBookingsUseCase)
    private readonly getProviderBookingsUseCase: GetProviderBookingsUseCase
  ) {}

  /**
   * Get all bookings for provider with statistics
   * GET /api/sessions/provider
   */
  async getProviderSessions(req: Request, res: Response): Promise<Response> {
    console.log('🟡 [SessionManagementController] getProviderSessions called');
    console.log('🟡 [SessionManagementController] req.user:', req.user);

    try {
      const providerId = req.user?.id;
      const { status } = req.query;

      console.log('🟡 [SessionManagementController] Provider ID:', providerId);
      console.log('🟡 [SessionManagementController] Status filter:', status);

      if (!providerId) {
        console.error('❌ [SessionManagementController] No provider ID found');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.log('🟡 [SessionManagementController] Executing GetProviderBookingsUseCase...');
      const result = await this.getProviderBookingsUseCase.execute({
        providerId,
        status: status as string,
      });

      console.log('🟡 [SessionManagementController] Use case result:', JSON.stringify(result, null, 2));

      if (!result.success) {
        console.error('❌ [SessionManagementController] Use case failed:', result.message);
        return res.status(400).json(result);
      }

      console.log('✅ [SessionManagementController] Sessions retrieved successfully');
      console.log('📊 [SessionManagementController] Bookings count:', result.bookings?.length);
      console.log('📊 [SessionManagementController] Stats:', result.stats);
      
      return res.status(200).json({
        success: true,
        data: {
          sessions: result.bookings,
          stats: result.stats,
        },
      });
    } catch (error: any) {
      console.error('❌ [SessionManagementController] Error:', error);
      console.error('❌ [SessionManagementController] Error stack:', error.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve sessions',
      });
    }
  }

  /**
   * Accept a booking request
   * POST /api/sessions/:bookingId/accept
   */
  async acceptBooking(req: Request, res: Response): Promise<Response> {
    console.log('🟡 [SessionManagementController] acceptBooking called');

    try {
      const providerId = req.user?.id;
      const { bookingId } = req.params;

      if (!providerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await this.acceptBookingUseCase.execute({
        bookingId,
        providerId,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      console.log('✅ [SessionManagementController] Booking accepted successfully');
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.booking,
      });
    } catch (error: any) {
      console.error('❌ [SessionManagementController] Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to accept booking',
      });
    }
  }

  /**
   * Decline a booking request
   * POST /api/sessions/:bookingId/decline
   */
  async declineBooking(req: Request, res: Response): Promise<Response> {
    console.log('🟡 [SessionManagementController] declineBooking called');

    try {
      const providerId = req.user?.id;
      const { bookingId } = req.params;
      const { reason } = req.body;

      if (!providerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await this.declineBookingUseCase.execute({
        bookingId,
        providerId,
        reason,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      console.log('✅ [SessionManagementController] Booking declined successfully');
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error('❌ [SessionManagementController] Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to decline booking',
      });
    }
  }

  /**
   * Cancel a booking
   * POST /api/sessions/:bookingId/cancel
   */
  async cancelBooking(req: Request, res: Response): Promise<Response> {
    console.log('🟡 [SessionManagementController] cancelBooking called');

    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;
      const { reason } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await this.cancelBookingUseCase.execute({
        bookingId,
        userId,
        reason,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      console.log('✅ [SessionManagementController] Booking cancelled successfully');
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error('❌ [SessionManagementController] Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to cancel booking',
      });
    }
  }

  /**
   * Request reschedule for a booking
   * POST /api/sessions/:bookingId/reschedule
   */
  async rescheduleBooking(req: Request, res: Response): Promise<Response> {
    console.log('🟡 [SessionManagementController] rescheduleBooking called');

    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;
      const { newDate, newTime, reason } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      if (!newDate || !newTime || !reason) {
        return res.status(400).json({
          success: false,
          message: 'New date, time, and reason are required',
        });
      }

      const result = await this.rescheduleBookingUseCase.execute({
        bookingId,
        userId,
        newDate,
        newTime,
        reason,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      console.log('✅ [SessionManagementController] Reschedule requested successfully');
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error('❌ [SessionManagementController] Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to request reschedule',
      });
    }
  }
}
