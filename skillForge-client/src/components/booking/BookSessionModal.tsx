import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { bookingService } from '../../services/bookingService';

interface BookSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillTitle: string;
  providerId: string;
  providerName: string;
  sessionCost: number;
  userBalance: number;
  onBookSession: (bookingData: BookingData) => Promise<void>;
  availability?: {
    weeklySchedule: any;
    blockedDates: any[];
    timezone: string;
  };
}

export interface BookingData {
  preferredDate: string;
  preferredTime: string;
  message: string;
}

interface TimePickerState {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
}

export default function BookSessionModal({
  isOpen,
  onClose,
  providerId,
  providerName,
  sessionCost,
  userBalance,
  onBookSession,
  availability,
}: BookSessionModalProps) {
  const [preferredDate, setPreferredDate] = useState('');
  const [time, setTime] = useState<TimePickerState>({
    hour: '',
    minute: '',
    period: 'AM',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ date?: string; time?: string }>({});
  const [occupiedSlots, setOccupiedSlots] = useState<{ start: string; end: string }[]>([]);

  useEffect(() => {
    if (preferredDate && isOpen) {
      // Fetch occupied slots for the selected date
      // We pass the date as both start and end to get slots for that day
      // Ideally backend handles timezone, but for now we pass simple date string
      bookingService.getOccupiedSlots(providerId, preferredDate, preferredDate)
        .then(slots => {
          console.log('Booked slots:', slots);
          setOccupiedSlots(slots);
        })
        .catch(err => console.error('Failed to fetch slots', err));
    }
  }, [preferredDate, isOpen, providerId]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: { date?: string; time?: string } = {};

    if (!preferredDate) {
      newErrors.date = 'Please select a preferred date';
    } else {
      const selectedDate = new Date(preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      } else if (availability) {
        // Check blocked dates
        const isBlocked = availability.blockedDates.some(d => d.date === preferredDate);
        if (isBlocked) {
          newErrors.date = 'Provider is unavailable on this date';
        } else {
          // Check weekly schedule
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayName = days[selectedDate.getDay()];
          const daySchedule = availability.weeklySchedule[dayName];
          if (!daySchedule || !daySchedule.enabled) {
            newErrors.date = `Provider is not available on ${dayName}s`;
          }
        }
      }
    }

    if (!time.hour || !time.minute) {
      newErrors.time = 'Please select a preferred time';
    } else {
      const hour = parseInt(time.hour);
      const minute = parseInt(time.minute);
      if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
        newErrors.time = 'Invalid time format';
      } else if (preferredDate) {
        const formattedTime = formatTime24Hour();
        const selectedDateTime = new Date(`${preferredDate}T${formattedTime}`);

        // 1. Check availability (Weekly Schedule)
        if (availability) {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayName = days[selectedDateTime.getDay()];
          const daySchedule = availability.weeklySchedule[dayName];

          if (daySchedule && daySchedule.enabled && daySchedule.slots) {
            const isTimeValid = daySchedule.slots.some((slot: any) => {
              const slotStart = new Date(`${preferredDate}T${slot.start}`);
              const slotEnd = new Date(`${preferredDate}T${slot.end}`);
              // Assuming 1 hour duration if not passed, but industrial needs strict check.
              // We'll use 60 mins as default for validation
              const sessionEnd = new Date(selectedDateTime.getTime() + 60 * 60 * 1000);
              return selectedDateTime >= slotStart && sessionEnd <= slotEnd;
            });

            if (!isTimeValid) {
              newErrors.time = 'Selected time is outside working hours';
            }
          }
        }

        // 2. Check Overlaps (Occupied Slots)
        if (!newErrors.time && occupiedSlots.length > 0) {
          const sessionEnd = new Date(selectedDateTime.getTime() + 60 * 60 * 1000); // 1 Hour default
          const hasOverlap = occupiedSlots.some(slot => {
            const bookedStart = new Date(slot.start);
            const bookedEnd = new Date(slot.end);
            return selectedDateTime < bookedEnd && sessionEnd > bookedStart;
          });

          if (hasOverlap) {
            newErrors.time = 'This time slot is already booked';
          }
        }
      }
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
    console.log('🔵 [BookSessionModal] Submit button clicked');
    console.log('🔵 [BookSessionModal] Form data:', {
      preferredDate,
      time,
      message,
      sessionCost,
      userBalance,
    });

    if (!validateForm()) {
      console.log('❌ [BookSessionModal] Validation failed:', errors);
      return;
    }

    console.log('✅ [BookSessionModal] Validation passed');

    setIsSubmitting(true);
    try {
      const formattedTime = formatTime24Hour();
      console.log('🔵 [BookSessionModal] Formatted time (24h):', formattedTime);

      const bookingData = {
        preferredDate,
        preferredTime: formattedTime,
        message,
      };

      console.log('🔵 [BookSessionModal] Sending booking data:', bookingData);

      await onBookSession(bookingData);

      console.log('✅ [BookSessionModal] Booking successful');

      // Reset form
      setPreferredDate('');
      setTime({ hour: '', minute: '', period: 'AM' });
      setMessage('');
      setErrors({});
      onClose();
    } catch (error: any) {
      console.error('❌ [BookSessionModal] Booking failed:', error);
      console.error('❌ [BookSessionModal] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      // If backend returns validation error, show it
      if (error.response?.status === 400) {
        setErrors(prev => ({ ...prev, form: error.response.data.message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setPreferredDate('');
    setTime({ hour: '', minute: '', period: 'AM' });
    setMessage('');
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

  const hasInsufficientBalance = userBalance < sessionCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Book a Session</h2>
            <p className="text-sm text-gray-600 mt-1">
              Schedule a 1 hour session with {providerName}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Global Error */}
          {(errors as any).form && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{(errors as any).form}</span>
            </div>
          )}

          {/* Preferred Date */}
          <div>
            <label htmlFor="preferred-date" className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon size={16} className="inline mr-1" />
              Preferred Date
            </label>
            <input
              id="preferred-date"
              type="date"
              value={preferredDate}
              onChange={(e) => {
                setPreferredDate(e.target.value);
                setErrors({ ...errors, date: undefined });
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              placeholder="dd-mm-yyyy"
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>

          {/* Preferred Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Preferred Time
            </label>
            <div className="flex items-center gap-2">
              {/* Hour */}
              <input
                type="text"
                value={time.hour}
                onChange={(e) => handleHourChange(e.target.value)}
                maxLength={2}
                placeholder="HH"
                className={`w-16 px-3 py-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center font-medium`}
              />
              <span className="text-gray-500 font-bold">:</span>
              {/* Minute */}
              <input
                type="text"
                value={time.minute}
                onChange={(e) => handleMinuteChange(e.target.value)}
                maxLength={2}
                placeholder="MM"
                className={`w-16 px-3 py-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center font-medium`}
              />
              {/* AM/PM Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTime({ ...time, period: 'AM' })}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${time.period === 'AM'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setTime({ ...time, period: 'PM' })}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${time.period === 'PM'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  PM
                </button>
              </div>
            </div>
            {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
            <p className="text-xs text-gray-500 mt-1">Enter time in 12-hour format</p>
          </div>

          {/* Message (Optional) */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              placeholder="Any specific topics or questions you'd like to cover?"
            />
          </div>

          {/* Cost Summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600">Session cost:</span>
              <span className="font-semibold text-gray-900">{sessionCost} credits</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Your balance:</span>
              <span className={`font-semibold ${hasInsufficientBalance ? 'text-red-600' : 'text-gray-900'}`}>
                {userBalance} credits
              </span>
            </div>
            {hasInsufficientBalance && (
              <p className="text-xs text-red-500 mt-2">
                Insufficient credits. Please purchase more credits to book this session.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || hasInsufficientBalance}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Booking...' : 'Send Booking Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
