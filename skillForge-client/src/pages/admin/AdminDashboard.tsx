

import { useEffect, useState } from 'react';
import { adminDashboardService, AdminDashboardStats } from '../../services/adminDashboardService';

const Icons = {
    Users: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
    Skills: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9h12M6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3M6 9v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"></path>
        </svg>
    ),
    Sessions: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
    Revenue: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
    ),
    CreditSales: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    ),
    CreditsRedeemed: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
        </svg>
    ),
    NetRevenue: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    ),
    ProfitMargin: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
        </svg>
    ),
    Wallet: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
            <circle cx="19" cy="14" r="2"></circle>
        </svg>
    ),
    Warning: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.04h16.94a2 2 0 0 0 1.71-3.04L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    ),
    Zap: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    ),
    TrendingUp: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    ),
    CheckCircle: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    ),
    Clock: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
    X: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
    ),
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminDashboardService.getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
            <div className="min-h-screen bg-muted/40 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Icons.Users,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            change: `${stats.userGrowthPercentage >= 0 ? '+' : ''}${stats.userGrowthPercentage}%`,
            active: `${stats.activeUsers.toLocaleString()} active`,
        },
        {
            label: "Total Skills",
            value: stats.totalSkills.toLocaleString(),
            icon: Icons.Skills,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            change: `${stats.skillGrowthPercentage >= 0 ? '+' : ''}${stats.skillGrowthPercentage}%`,
            active: `${stats.pendingSkillsCount} pending approval`,
        },
        {
            label: "Total Sessions",
            value: stats.totalSessions.toLocaleString(),
            icon: Icons.Sessions,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            change: `${stats.sessionGrowthPercentage >= 0 ? '+' : ''}${stats.sessionGrowthPercentage}%`,
            active: `${stats.sessionsThisWeek} this week`,
        },
        {
            label: "Total Revenue",
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: Icons.Revenue,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            change: `${stats.revenueGrowthPercentage >= 0 ? '+' : ''}${stats.revenueGrowthPercentage}%`,
            active: `₹${stats.revenueThisWeek.toLocaleString()} this week`,
        },
    ]

    const revenueCards = [
        {
            title: "Credit Sales Revenue",
            amount: `₹${stats.creditSalesRevenue.toLocaleString()}`,
            desc: `This month ${stats.creditsSoldCount} credits sold`,
            color: "border-l-4 border-l-green-500",
            icon: Icons.CreditSales,
        },
        {
            title: "Credits Redeemed",
            amount: `₹${stats.creditsRedeemedAmount.toLocaleString()}`,
            desc: `${stats.creditsRedeemedCount} credits redeemed`,
            color: "border-l-4 border-l-orange-500",
            icon: Icons.CreditsRedeemed,
        },
        {
            title: "Net Revenue",
            amount: `₹${stats.netRevenue.toLocaleString()}`,
            desc: "Sales - Redemptions",
            color: "border-l-4 border-l-purple-500",
            icon: Icons.NetRevenue,
        },
        {
            title: "Profit Margin",
            amount: `${stats.profitMargin}%`,
            desc: "Healthy margin",
            color: "border-l-4 border-l-teal-500",
            icon: Icons.ProfitMargin,
        },
    ]

    const walletStats = [
        { title: "Total Wallet Balance", amount: `₹${stats.totalWalletBalance.toLocaleString()}`, desc: "Across all users", icon: Icons.Wallet },
        { title: "Credits Redeemed", amount: `₹${stats.creditsRedeemedThisMonth.toLocaleString()}`, desc: "This month", icon: Icons.CheckCircle },
        { title: "Pending Withdrawals", amount: `₹${stats.pendingWithdrawals.toLocaleString()}`, desc: `${stats.pendingWithdrawalsCount} requests`, icon: Icons.Clock },
        { title: "Completed Withdrawals", amount: `₹${stats.completedWithdrawals.toLocaleString()}`, desc: "This month", icon: Icons.CheckCircle },
    ]

    const recentUsers = stats.recentUsers.map(user => ({
        name: user.name,
        location: user.location || 'Unknown',
        credits: `${user.credits} credits`
    }));

    const recentSessions = stats.recentSessions.map(session => ({
        title: session.skillTitle,
        instructor: session.providerName,
        status: session.status
    }));

    return (
        <div className="min-h-screen bg-muted/40">
            {/* Reusable Admin Navbar */}


            {/* Main Content */}
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Platform overview and management</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((card, idx) => (
                        <div
                            key={idx}
                            className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${card.bgColor} p-3 rounded-lg ${card.color}`}>
                                    <card.icon />
                                </div>
                                <span className="text-green-500 font-semibold text-sm">{card.change}</span>
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-1">{card.value}</h3>
                            <p className="text-muted-foreground text-sm font-medium">{card.label}</p>
                            <p className="text-muted-foreground text-xs mt-2">{card.active}</p>
                        </div>
                    ))}
                </div>

                {/* Revenue Flow & Financial Overview */}
                <div className="bg-card rounded-lg border border-border p-6 mb-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <div className="text-primary">
                                    <Icons.TrendingUp />
                                </div>
                                Revenue Flow & Financial Overview
                            </h2>
                            <p className="text-muted-foreground text-sm">Platform revenue from credit sales and financial health</p>
                        </div>
                        <button className="text-primary hover:text-primary/90 font-semibold text-sm">Manage Credits</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {revenueCards.map((card, idx) => (
                            <div key={idx} className={`${card.color} bg-muted/40 p-4 rounded-lg`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-muted-foreground">
                                        <card.icon />
                                    </div>
                                    <p className="text-muted-foreground text-sm font-medium">{card.title}</p>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-1">{card.amount}</h3>
                                <p className="text-muted-foreground text-xs">{card.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Revenue Model Info */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="flex gap-2 mb-2">
                            <div className="text-primary flex-shrink-0">
                                <Icons.CheckCircle />
                            </div>
                            <p className="font-semibold text-foreground text-sm">Revenue Model</p>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                            <li>• Users can buy credits at ₹60-75/credit (discounts)</li>
                            <li>• Users redeem credits to wallet at ₹50/credit</li>
                            <li>• Platform profit: ₹10-25 per credit when redeemed</li>
                            <li>• Additional revenue from unredeemed credits (breakage)</li>
                        </ul>
                    </div>
                </div>

                {/* Platform Wallet Overview */}
                <div className="bg-card rounded-lg border border-border p-6 mb-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <div className="text-cyan-500">
                                    <Icons.Wallet />
                                </div>
                                Platform Wallet Overview
                            </h2>
                            <p className="text-muted-foreground text-sm">Total user wallet balances and transactions</p>
                        </div>
                        <button className="text-primary hover:text-primary/90 font-semibold text-sm">View Details</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {walletStats.map((stat, idx) => (
                            <div key={idx} className="bg-muted/40 p-4 rounded-lg border border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-muted-foreground w-5 h-5">
                                        <stat.icon />
                                    </div>
                                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mt-2 mb-1">{stat.amount}</h3>
                                <p className="text-muted-foreground text-xs">{stat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Pending Reports */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <div className="text-destructive">
                                    <Icons.Warning />
                                </div>
                                Pending Reports
                            </h2>
                            <button className="text-primary hover:text-primary/90 font-semibold text-sm">View All</button>
                        </div>

                        <div className="space-y-4">
                            {stats.pendingReports.length > 0 ? (
                                stats.pendingReports.map((report, idx) => (
                                    <div key={idx} className="bg-card rounded-lg border border-border p-6 shadow-sm">
                                        <div className="border-b border-border pb-4 mb-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 text-primary">
                                                        <Icons.Users />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{report.type}</p>
                                                        <p className="text-sm text-muted-foreground">{report.description}</p>
                                                    </div>
                                                </div>
                                                <button className="text-primary hover:text-primary/90 font-semibold text-sm">Review</button>
                                            </div>
                                            <p className="text-xs text-muted-foreground ml-10">Reported by {report.reportedBy}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-card rounded-lg border border-border p-6 shadow-sm text-center text-muted-foreground">
                                    No pending reports
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Platform Activity */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <div className="text-yellow-500">
                                    <Icons.Zap />
                                </div>
                                Platform Activity
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    title: "New Registrations",
                                    count: stats.newRegistrations24h.toString(),
                                    time: "Last 24 hours",
                                    trend: `${stats.newRegistrationsGrowth >= 0 ? '↑' : '↓'} ${Math.abs(stats.newRegistrationsGrowth).toFixed(1)}%`,
                                    icon: Icons.Users,
                                    trendColor: stats.newRegistrationsGrowth >= 0 ? "text-green-600" : "text-red-600"
                                },
                                {
                                    title: "New Skills Listed",
                                    count: stats.newSkills24h.toString(),
                                    time: "Last 24 hours",
                                    trend: `${stats.newSkillsGrowth >= 0 ? '↑' : '↓'} ${Math.abs(stats.newSkillsGrowth).toFixed(1)}%`,
                                    icon: Icons.Skills,
                                    trendColor: stats.newSkillsGrowth >= 0 ? "text-green-600" : "text-red-600"
                                },
                                {
                                    title: "Sessions Completed",
                                    count: stats.sessionsCompleted24h.toString(),
                                    time: "Last 24 hours",
                                    trend: `${stats.sessionsCompletedGrowth >= 0 ? '↑' : '↓'} ${Math.abs(stats.sessionsCompletedGrowth).toFixed(1)}%`,
                                    icon: Icons.CheckCircle,
                                    trendColor: stats.sessionsCompletedGrowth >= 0 ? "text-green-600" : "text-red-600"
                                },
                            ].map((activity, idx) => (
                                <div key={idx} className="bg-card rounded-lg border border-border p-4 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 text-muted-foreground">
                                                <activity.icon />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-foreground">{activity.count}</p>
                                            <p className={`text-xs ${activity.trendColor}`}>{activity.trend}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Users & Sessions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Users */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-foreground">Recent Users</h2>
                            <button className="text-primary hover:text-primary/90 font-semibold text-sm">View All</button>
                        </div>

                        <div className="space-y-4">
                            {recentUsers.map((user, idx) => (
                                <div
                                    key={idx}
                                    className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.location}</p>
                                            </div>
                                        </div>
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-semibold">
                                            {user.credits}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Sessions */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-foreground">Recent Sessions</h2>
                            <button className="text-primary hover:text-primary/90 font-semibold text-sm">View All</button>
                        </div>

                        <div className="space-y-4">
                            {recentSessions.map((session, idx) => (
                                <div
                                    key={idx}
                                    className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-foreground">{session.title}</p>
                                            <p className="text-sm text-muted-foreground">{session.instructor}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${session.status === "Confirmed"
                                                ? "bg-blue-500/10 text-blue-600"
                                                : session.status === "completed"
                                                    ? "bg-green-500/10 text-green-600"
                                                    : session.status === "pending"
                                                        ? "bg-yellow-500/10 text-yellow-600"
                                                        : "bg-destructive/10 text-destructive"
                                                }`}
                                        >
                                            {session.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
