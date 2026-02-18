import React, { useState } from 'react';
import { AlertCircle, Building, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import walletService from '../../services/walletService';

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    currentBalance: number;
    bankDetails: any; // Ideally strictly typed from User interface
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    currentBalance,
    bankDetails
}) => {
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const withdrawAmount = Number(amount) || 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (withdrawAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        if (withdrawAmount > currentBalance) {
            setError(`Insufficient balance. Available: ₹${currentBalance}`);
            return;
        }

        if (withdrawAmount < 500) { // Minimum withdrawal rule
            setError('Minimum withdrawal amount is ₹500.');
            return;
        }

        if (!bankDetails || !bankDetails.account_number) {
            setError('Please add valid bank details in your profile settings before withdrawing.');
            return;
        }

        setLoading(true);
        try {
            await walletService.requestWithdrawal(withdrawAmount, bankDetails);
            toast.success('Withdrawal request submitted successfully!');
            onSuccess();
            onClose();
            setAmount('');
        } catch (err: any) {
            console.error('Withdrawal error:', err);
            setError(err.response?.data?.message || 'Failed to request withdrawal. Please try again.');
            toast.error(err.response?.data?.message || 'Withdrawal failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                                <Upload className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Request Withdrawal
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 mb-4">
                                        Withdraw funds to your registered bank account.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                                Amount to Withdraw (₹)
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    id="amount"
                                                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                                    placeholder="0.00"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    max={currentBalance}
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Available Balance: ₹{currentBalance.toLocaleString('en-IN')}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Deposit To</h4>
                                            <div className="flex items-start gap-2">
                                                <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div className="text-sm">
                                                    {bankDetails?.bank_name ? (
                                                        <>
                                                            <p className="font-medium text-gray-900">{bankDetails.bank_name}</p>
                                                            <p className="text-gray-500">****{bankDetails.account_number?.slice(-4)}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-red-500">No bank details found. Please update your profile.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="rounded-md bg-red-50 p-3">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-red-800">
                                                            {error}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || withdrawAmount <= 0 || withdrawAmount > currentBalance}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Request Withdrawal'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalModal;
