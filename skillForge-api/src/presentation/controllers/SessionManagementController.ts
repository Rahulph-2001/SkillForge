

import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { AcceptBookingUseCase } from '../../application/useCases/booking/AcceptBookingUseCase';
import { DeclineBookingUseCase } from '../../application/useCases/booking/DeclineBookingUseCase';
import { CancelBookingUseCase } from '../../application/useCases/booking/CancelBookingUseCase';
import { RescheduleBookingUseCase } from '../../application/useCases/booking/RescheduleBookingUseCase';
import { AcceptRescheduleUseCase } from '../../application/useCases/booking/AcceptRescheduleUseCase';
import { DeclineRescheduleUseCase } from '../../application/useCases/booking/DeclineRescheduleUseCase';
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
    @inject(TYPES.AcceptRescheduleUseCase)
    private readonly acceptRescheduleUseCase: AcceptRescheduleUseCase,
    @inject(TYPES.DeclineRescheduleUseCase)
    private readonly declineRescheduleUseCase: DeclineRescheduleUseCase,
    @inject(TYPES.GetProviderBookingsUseCase)
    private readonly getProviderBookingsUseCase: GetProviderBookingsUseCase
  ) {}

  /**
   * Get all bookings for provider with statistics
   * GET /api/sessions/provider
   */
  async getProviderSessions(req: Request, res: Response): Promise<Response> {
    try {
      const providerId = req.user?.id;
      const { status } = req.query;

      if (!providerId) {
        console.error(' [SessionManagementController] No provider ID found');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await this.getProviderBookingsUseCase.execute({
        providerId,
        status: status as string,
      });

      if (!result.success) {
        console.error(' [SessionManagementController] Use case failed:', result.message);
        return res.status(400).json(result);
      }
      
      return res.status(200).json({
        success: true,
        data: {
          sessions: result.bookings,
          stats: result.stats,
        },
      });
    } catch (error: any) {
      console.error(' [SessionManagementController] Error:', error);
      console.error(' [SessionManagementController] Error stack:', error.stack);
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
    try {
      const providerId = req.user?.id;
      const { bookingId } = req.params;

      if (!providerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const booking = await this.acceptBookingUseCase.execute({
        bookingId,
        providerId,
      });

      return res.status(200).json({
        success: true,
        message: 'Booking accepted successfully',
        data: booking,
      });
    } catch (error: any) {
      console.error(' [SessionManagementController] Error:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to accept booking',
      });
    }
  }

  
  async declineBooking(req: Request, res: Response): Promise<Response> {
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

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error(' [SessionManagementController] Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to decline booking',
      });
    }
  }

 
  async cancelBooking(req: Request, res: Response): Promise<Response> {
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

      await this.cancelBookingUseCase.execute({
        bookingId,
        userId,
        reason,
      });

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
      });
    } catch (error: any) {
      console.error('❌ [SessionManagementController] Error:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to cancel booking',
      });
    }
  }

  /**
   * Request reschedule for a booking
   * POST /api/sessions/:bookingId/reschedule
   */
  async rescheduleBooking(req: Request, res: Response): Promise<Response> {
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

  /**
   * Accept a reschedule request
   * POST /api/sessions/:bookingId/reschedule/accept
   */
  async acceptReschedule(req: Request, res: Response): Promise<Response> {
    try {
      const providerId = req.user?.id;
      const { bookingId } = req.params;

      if (!providerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await this.acceptRescheduleUseCase.execute({
        bookingId,
        providerId,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error('❌ [SessionManagementController] Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to accept reschedule',
      });
    }
  }

  /**
   * Decline a reschedule request
   * POST /api/sessions/:bookingId/reschedule/decline
   */
  async declineReschedule(req: Request, res: Response): Promise<Response> {
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

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: 'Reason is required to decline a reschedule request',
        });
      }

      const result = await this.declineRescheduleUseCase.execute({
        bookingId,
        providerId,
        reason,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error('❌ [SessionManagementController] Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to decline reschedule',
      });
    }
  }
}
