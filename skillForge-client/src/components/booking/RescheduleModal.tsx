import { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  currentDate: string;
  currentTime: string;
  skillTitle: string;
  onReschedule: (sessionId: string, newDate: string, newTime: string, reason: string) => Promise<void>;
}

interface TimePickerState {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
}

export default function RescheduleModal({
  isOpen,
  onClose,
  sessionId,
  currentDate,
  currentTime,
  skillTitle,
  onReschedule,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState('');
  const [time, setTime] = useState<TimePickerState>({
    hour: '',
    minute: '',
    period: 'AM',
  });
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ date?: string; time?: string; reason?: string }>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: { date?: string; time?: string; reason?: string } = {};

    if (!newDate) {
      newErrors.date = 'Please select a new date';
    } else {
      const selectedDate = new Date(newDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!time.hour || !time.minute) {
      newErrors.time = 'Please select a new time';
    } else {
      const hour = parseInt(time.hour);
      const minute = parseInt(time.minute);
      if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
        newErrors.time = 'Invalid time format';
      }
    }

    if (!reason.trim()) {
      newErrors.reason = 'Please provide a reason for rescheduling';
    } else if (reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTime24Hour = (): string => {
    let hour = parseInt(time.hour);
    const minute = time.minute.padStart(2, '0');

    if (time.period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (time.period === 'AM' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minute}`;
  };

  const handleSubmit = async () => {
    console.log('🔵 [RescheduleModal] Submit button clicked');
    console.log('🔵 [RescheduleModal] Form data:', {
      sessionId,
      newDate,
      time,
      reason,
    });

    if (!validateForm()) {
      console.log('❌ [RescheduleModal] Validation failed:', errors);
      return;
    }

    console.log('✅ [RescheduleModal] Validation passed');

    setIsSubmitting(true);
    try {
      const formattedTime = formatTime24Hour();
      console.log('🔵 [RescheduleModal] Formatted time (24h):', formattedTime);

      await onReschedule(sessionId, newDate, formattedTime, reason);

      console.log('✅ [RescheduleModal] Reschedule request successful');

      // Reset form
      setNewDate('');
      setTime({ hour: '', minute: '', period: 'AM' });
      setReason('');
      setErrors({});
      onClose();
    } catch (error: any) {
      console.error('❌ [RescheduleModal] Reschedule failed:', error);
      console.error('❌ [RescheduleModal] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewDate('');
    setTime({ hour: '', minute: '', period: 'AM' });
    setReason('');
    setErrors({});
    onClose();
  };

  const handleHourChange = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    if (numValue === '' || (parseInt(numValue) >= 1 && parseInt(numValue) <= 12)) {
      setTime({ ...time, hour: numValue });
      setErrors({ ...errors, time: undefined });
    }
  };

  const handleMinuteChange = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    if (numValue === '' || (parseInt(numValue) >= 0 && parseInt(numValue) <= 59)) {
      setTime({ ...time, minute: numValue });
      setErrors({ ...errors, time: undefined });
    }
  };

  const formatCurrentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrentTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Reschedule Session</h2>
            <p className="text-sm text-muted-foreground mt-1">{skillTitle}</p>
          </div>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Current Schedule Info */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Current Schedule</p>
                <p className="text-primary mt-1">
                  {formatCurrentDate(currentDate)} at {formatCurrentTime(currentTime)}
                </p>
              </div>
            </div>
          </div>

          {/* New Preferred Date */}
          <div>
            <label htmlFor="new-date" className="block text-sm font-medium text-foreground mb-2">
              <CalendarIcon size={16} className="inline mr-1" />
              New Preferred Date
            </label>
            <input
              id="new-date"
              type="date"
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value);
                setErrors({ ...errors, date: undefined });
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 bg-background border ${errors.date ? 'border-destructive' : 'border-border'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-foreground placeholder-muted-foreground`}
              placeholder="dd-mm-yyyy"
            />
            {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
          </div>

          {/* New Preferred Time */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Clock size={16} className="inline mr-1" />
              New Preferred Time
            </label>
            <div className="flex items-center gap-2">
              {/* Hour */}
              <input
                type="text"
                value={time.hour}
                onChange={(e) => handleHourChange(e.target.value)}
                maxLength={2}
                placeholder="HH"
                className={`w-16 px-3 py-2 bg-background border ${errors.time ? 'border-destructive' : 'border-border'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-center font-medium text-foreground placeholder-muted-foreground`}
              />
              <span className="text-muted-foreground font-bold">:</span>
              {/* Minute */}
              <input
                type="text"
                value={time.minute}
                onChange={(e) => handleMinuteChange(e.target.value)}
                maxLength={2}
                placeholder="MM"
                className={`w-16 px-3 py-2 bg-background border ${errors.time ? 'border-destructive' : 'border-border'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-center font-medium text-foreground placeholder-muted-foreground`}
              />
              {/* AM/PM Toggle */}
              <div className="flex border border-border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTime({ ...time, period: 'AM' })}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${time.period === 'AM'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground hover:bg-muted'
                    }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setTime({ ...time, period: 'PM' })}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-l border-border ${time.period === 'PM'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground hover:bg-muted'
                    }`}
                >
                  PM
                </button>
              </div>
            </div>
            {errors.time && <p className="text-xs text-destructive mt-1">{errors.time}</p>}
            <p className="text-xs text-muted-foreground mt-1">Enter time in 12-hour format</p>
          </div>

          {/* Reason for Rescheduling */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-foreground mb-2">
              Reason for Rescheduling <span className="text-destructive">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrors({ ...errors, reason: undefined });
              }}
              rows={4}
              className={`w-full px-3 py-2 bg-background border ${errors.reason ? 'border-destructive' : 'border-border'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none text-foreground placeholder-muted-foreground`}
              placeholder="Please explain why you need to reschedule this session..."
            />
            {errors.reason && <p className="text-xs text-destructive mt-1">{errors.reason}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              {reason.length}/10 characters minimum
            </p>
          </div>

          {/* Info Message */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-xs text-amber-600">
              <strong>Note:</strong> Your reschedule request will be sent to the provider for approval.
              The session will remain scheduled at the current time until the provider accepts your request.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending Request...' : 'Request Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
}
