import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, CheckCheck, Calendar, MessageSquare, CreditCard, Users, Briefcase, Shield, Video, Star, Trash2 } from 'lucide-react';
import notificationService, { Notification, NotificationType } from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        page,
        limit: 10,
        ...(activeTab === 'unread' ? { isRead: false } : {}),
      };
      const response = await notificationService.getNotifications(filters);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setTotal(prev => prev - 1);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = 'w-5 h-5';
    const iconMap: Record<NotificationType, { icon: JSX.Element; bgColor: string; iconColor: string }> = {
      [NotificationType.SESSION_CONFIRMED]: { icon: <Calendar className={iconClass} />, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
      [NotificationType.SESSION_DECLINED]: { icon: <Calendar className={iconClass} />, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      [NotificationType.SESSION_CANCELLED]: { icon: <Calendar className={iconClass} />, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
      [NotificationType.SESSION_COMPLETED]: { icon: <Check className={iconClass} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      [NotificationType.RESCHEDULE_REQUESTED]: { icon: <Calendar className={iconClass} />, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      [NotificationType.RESCHEDULE_ACCEPTED]: { icon: <Check className={iconClass} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      [NotificationType.RESCHEDULE_DECLINED]: { icon: <Calendar className={iconClass} />, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      [NotificationType.NEW_MESSAGE]: { icon: <MessageSquare className={iconClass} />, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
      [NotificationType.CREDITS_EARNED]: { icon: <CreditCard className={iconClass} />, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
      [NotificationType.CREDITS_RECEIVED]: { icon: <CreditCard className={iconClass} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      [NotificationType.COMMUNITY_UPDATE]: { icon: <Users className={iconClass} />, bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
      [NotificationType.BOOKING_REQUEST]: { icon: <Calendar className={iconClass} />, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
      [NotificationType.PROFILE_VERIFIED]: { icon: <Shield className={iconClass} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      [NotificationType.PROJECT_APPLICATION_RECEIVED]: { icon: <Briefcase className={iconClass} />, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
      [NotificationType.PROJECT_APPLICATION_ACCEPTED]: { icon: <Check className={iconClass} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      [NotificationType.PROJECT_APPLICATION_REJECTED]: { icon: <Briefcase className={iconClass} />, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      [NotificationType.PROJECT_COMPLETION_REQUESTED]: { icon: <Briefcase className={iconClass} />, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      [NotificationType.PROJECT_COMPLETION_APPROVED]: { icon: <Check className={iconClass} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      [NotificationType.PROJECT_COMPLETION_REJECTED]: { icon: <Briefcase className={iconClass} />, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      [NotificationType.SKILL_APPROVED]: { icon: <Star className={iconClass} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      [NotificationType.SKILL_REJECTED]: { icon: <Star className={iconClass} />, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      [NotificationType.SKILL_BLOCKED]: { icon: <Star className={iconClass} />, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      [NotificationType.INTERVIEW_SCHEDULED]: { icon: <Video className={iconClass} />, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
      [NotificationType.SUBSCRIPTION_RENEWED]: { icon: <CreditCard className={iconClass} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      [NotificationType.PAYMENT_RECEIVED]: { icon: <CreditCard className={iconClass} />, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      [NotificationType.NEW_USER_REGISTERED]: { icon: <Users className={iconClass} />, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
      [NotificationType.NEW_SKILL_PENDING]: { icon: <Star className={iconClass} />, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      [NotificationType.NEW_REPORT_SUBMITTED]: { icon: <Shield className={iconClass} />, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      [NotificationType.WITHDRAWAL_REQUESTED]: { icon: <CreditCard className={iconClass} />, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      [NotificationType.PROJECT_ESCROW_RELEASE_REQUESTED]: { icon: <CreditCard className={iconClass} />, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    };
    return iconMap[type] || { icon: <Bell className={iconClass} />, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('all'); setPage(1); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'all'
            ? 'bg-foreground text-background'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
        >
          All <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{total}</span>
        </button>
        <button
          onClick={() => { setActiveTab('unread'); setPage(1); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'unread'
            ? 'bg-blue-600 text-white'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
        >
          Unread <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{unreadCount}</span>
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-muted rounded-xl h-24" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
          <p className="text-muted-foreground">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => {
            const iconConfig = getNotificationIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`group relative p-4 rounded-xl border transition-all ${notification.isRead
                  ? 'bg-card border-border'
                  : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 shadow-sm'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${iconConfig.bgColor}`}>
                    <div className={iconConfig.iconColor}>{iconConfig.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-semibold ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-0.5 ${notification.isRead ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark as read
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-red-500 transition-all"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;