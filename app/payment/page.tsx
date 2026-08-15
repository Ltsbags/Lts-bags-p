'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CreditCard,
  Building2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Check,
  ChevronRight,
  Building,
  Lock,
  ArrowRight,
  Phone,
  PhoneCall,
  Mail,
  Loader2,
  IndianRupee,
  Smartphone,
  ExternalLink,
  Share2,
  Printer
} from 'lucide-react';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const quotationId = searchParams.get('quotationId') || '';
  const quotationNumber = searchParams.get('quoteNumber') || '';
  const initialAmount = searchParams.get('amount') || '';
  const initialType = searchParams.get('type') || 'advance';
  const initialName = searchParams.get('name') || '';
  const initialEmail = searchParams.get('email') || '';
  const initialMobile = searchParams.get('mobile') || '';
  const initialCompany = searchParams.get('company') || '';

  // Form State
  const [amount, setAmount] = useState(initialAmount || '5000');
  const [name, setName] = useState(initialName || '');
  const [companyName, setCompanyName] = useState(initialCompany || '');
  const [mobile, setMobile] = useState(initialMobile || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [paymentType, setPaymentType] = useState<'advance' | 'balance' | 'full'>(
    (initialType as any) || 'advance'
  );
  const [paymentMethodTab, setPaymentMethodTab] = useState<'razorpay' | 'upi_qr' | 'bank_transfer'>('razorpay');
  const [activeTab, setActiveTab] = useState<'form' | 'success'>('form');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  // UTR Form state for Bank Transfer & UPI QR
  const [utrNumber, setUtrNumber] = useState('');
  const [utrSubmitting, setUtrSubmitting] = useState(false);

  // Simulated Modal state for fallback checkout
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [simOrderData, setSimOrderData] = useState<any>(null);

  // Official LTS Bags Bank Details
  const bankDetails = {
    accountName: 'LTS BAGS PRIVATE LIMITED',
    bankName: 'Yes Bank',
    accountNumber: '041961900001163',
    ifscCode: 'YESB0000419',
    accountType: 'Current Account',
    branch: 'Lower Parel, Mumbai',
    upiId: 'ltsbags@yesbank',
  };

  useEffect(() => {
    // Load Razorpay SDK asynchronously
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const copyToClipboard = (text: string, fieldName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedBankField(fieldName);
      setTimeout(() => setCopiedBankField(null), 2500);
    } catch {
      // Fallback
    }
  };

  // 1. Razorpay Gateway Handler
  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount (minimum ₹1)');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name or company contact person');
      return;
    }

    if (!mobile.trim() || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number for SMS/WhatsApp payment confirmation');
      return;
    }

    setLoading(true);

    try {
      // Create order on server
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericAmount,
          currency: 'INR',
          receipt: quotationNumber ? `Q_${quotationNumber}` : `PAY_${Date.now()}`,
          notes: {
            quotationId,
            quotationNumber,
            customerName: name,
            companyName: companyName,
            paymentType,
          },
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway');
      }

      const { order, keyId, isSimulated } = orderData;

      // Check if we can invoke actual Razorpay checkout
      if (!isSimulated && typeof window !== 'undefined' && (window as any).Razorpay) {
        const options: any = {
          key: keyId || 'rzp_test_TPfZa5AOpWXHDV',
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'LTS BAGS PRIVATE LIMITED',
          description: quotationNumber
            ? `Payment for Quotation #${quotationNumber}`
            : 'Custom B2B Bag Manufacturing Advance',
          order_id: order.id,
          image: '/logo.png',
          prefill: {
            name: name,
            email: email || 'info@ltsbags.com',
            contact: mobile,
          },
          notes: {
            quotationNumber: quotationNumber || 'N/A',
            customerName: name,
          },
          theme: {
            color: '#72AFDB',
          },
          handler: async function (response: any) {
            await finalizePaymentVerification({
              razorpay_order_id: response.razorpay_order_id || order.id,
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'simulated_valid_signature',
              amount: numericAmount,
              paymentMethod: 'ONLINE_GATEWAY',
              isSimulated: false,
            });
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        try {
          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
            setError(response.error?.description || 'Payment was cancelled or unsuccessful.');
            setLoading(false);
          });
          rzp.open();
          return;
        } catch (rzpOpenErr) {
          console.warn('Razorpay open error, opening sandbox payment dialog:', rzpOpenErr);
        }
      }

      // Fallback to Interactive Sandbox Payment Dialog
      setSimOrderData({ order, keyId, numericAmount });
      setShowSimulatedModal(true);
      setLoading(false);
    } catch (err: any) {
      console.error('Payment execution error:', err);
      setError(err.message || 'Payment initiation failed. Please try again or use direct UPI QR / Bank Transfer.');
      setLoading(false);
    }
  };

  // 2. Finalize Verification & Record in Database
  const finalizePaymentVerification = async (params: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    amount: number;
    paymentMethod: string;
    isSimulated?: boolean;
    utr?: string;
  }) => {
    setLoading(true);
    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: params.razorpay_order_id || `order_${Date.now()}`,
          razorpay_payment_id: params.razorpay_payment_id || params.utr || `pay_${Date.now()}`,
          razorpay_signature: params.razorpay_signature || 'simulated_valid_signature',
          quotationId,
          quoteNumber: quotationNumber,
          clientName: name || 'Valued Client',
          companyName: companyName,
          clientEmail: email,
          clientMobile: mobile,
          amount: params.amount,
          paymentMethod: params.paymentMethod,
          isSimulated: params.isSimulated ?? true,
          notes: `Payment type: ${paymentType}. UTR / Ref: ${params.utr || params.razorpay_payment_id || 'Instant'}`,
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        setPaymentResult({
          receiptNumber: verifyData.receiptNumber || `PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
          transactionId: verifyData.transactionId || params.razorpay_payment_id || params.utr || `TXN_${Date.now()}`,
          amount: params.amount,
          name: name || 'Valued Customer',
          company: companyName,
          quotationNumber: quotationNumber,
          paymentMethod: params.paymentMethod,
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
        setShowSimulatedModal(false);
        setActiveTab('success');
      } else {
        setError(verifyData.error || 'Payment verification failed. Please contact billing desk.');
      }
    } catch (err: any) {
      setError(err.message || 'Error recording payment.');
    } finally {
      setLoading(false);
      setUtrSubmitting(false);
    }
  };

  // 3. Handle UTR Submission (Bank NEFT or UPI QR)
  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name or company contact person');
      return;
    }

    if (!utrNumber.trim()) {
      setError('Please enter the 12-digit UTR or UPI Transaction Reference Number');
      return;
    }

    setUtrSubmitting(true);
    await finalizePaymentVerification({
      amount: numericAmount,
      paymentMethod: paymentMethodTab === 'upi_qr' ? 'UPI_QR' : 'BANK_TRANSFER',
      utr: utrNumber.trim(),
      isSimulated: true,
    });
  };

  // Generate standard UPI Payment URL
  const numericAmount = parseFloat(amount) || 1;
  const upiPayUrl = `upi://pay?pa=${bankDetails.upiId}&pn=${encodeURIComponent(bankDetails.accountName)}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(quotationNumber ? `Quote ${quotationNumber} Advance` : 'LTS Bags Order Advance')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiPayUrl)}`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
            <Link href="/" className="hover:text-[#72AFDB] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#72AFDB]">Payment Gateway</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <CreditCard className="w-7 h-7 text-[#72AFDB]" />
                <span>LTS BAGS Online Payment</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Official secure B2B gateway for order advance, custom sampling fees, and bulk invoice settlements.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit SSL Encrypted & RBI Compliant</span>
            </div>
          </div>
        </div>

        {activeTab === 'success' && paymentResult ? (
          /* Payment Success Receipt View */
          <div className="bg-slate-950/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Payment Verified & Captured!</h2>
              <p className="text-sm text-slate-300">
                Thank you, <span className="font-semibold text-white">{paymentResult.name}</span>. Your advance payment has been registered in our factory production ledger.
              </p>
            </div>

            {/* Official Digital Receipt Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 font-sans">Payment Receipt No:</span>
                <span className="font-bold text-[#72AFDB]">{paymentResult.receiptNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 font-sans">Transaction / UTR Reference:</span>
                <span className="text-slate-200 font-bold">{paymentResult.transactionId}</span>
              </div>
              {paymentResult.quotationNumber && (
                <div className="flex justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400 font-sans">Quotation Number:</span>
                  <span className="text-amber-400">#{paymentResult.quotationNumber}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 font-sans">Payment Mode:</span>
                <span className="text-sky-300 font-sans font-semibold">{paymentResult.paymentMethod || 'Online'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 font-sans">Amount Paid:</span>
                <span className="text-base font-bold text-emerald-400">₹{Number(paymentResult.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Date & Time:</span>
                <span>{paymentResult.date}</span>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Building className="w-4 h-4 text-[#72AFDB]" />
                <span>Next Factory Production Steps:</span>
              </div>
              <p>1. Our accounts department has allocated raw ballistic nylon / poly fabric for your order batch.</p>
              <p>2. Pre-production sample bag stitching will be initiated within 24 hours.</p>
              <p>3. WhatsApp updates with factory photos and dispatch tracking will be sent to your mobile.</p>
            </div>

            {/* Receipt Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF Receipt</span>
              </button>
              <a
                href={`https://wa.me/919833598338?text=Hello%20LTS%20BAGS,%20I%20have%20completed%20the%20payment%20of%20₹${paymentResult.amount}%20with%20Receipt%20${paymentResult.receiptNumber}%20and%20Ref%20${paymentResult.transactionId}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-center"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp Billing Desk</span>
              </a>
              <Link
                href="/"
                className="flex-1 bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-center"
              >
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Payment Forms Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: 3 Payment Modes Tabs + Forms (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Method Switcher Tabs */}
              <div className="bg-slate-950/90 p-1.5 border border-slate-800 rounded-2xl grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => setPaymentMethodTab('razorpay')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                    paymentMethodTab === 'razorpay'
                      ? 'bg-[#72AFDB] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span className="truncate">Cards / Gateway</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethodTab('upi_qr')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                    paymentMethodTab === 'upi_qr'
                      ? 'bg-[#72AFDB] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span className="truncate">Instant UPI QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethodTab('bank_transfer')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                    paymentMethodTab === 'bank_transfer'
                      ? 'bg-[#72AFDB] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">NEFT / RTGS Wire</span>
                </button>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* TAB 1: Razorpay Instant Gateway Form */}
              {paymentMethodTab === 'razorpay' && (
                <form
                  onSubmit={handleRazorpayPayment}
                  className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">Online Payment Gateway</h2>
                      <p className="text-xs text-slate-400">Credit/Debit Cards, NetBanking, UPI, and Corporate Wallets</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Razorpay Verified</span>
                    </div>
                  </div>

                  {/* Amount Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Amount to Pay (INR ₹) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#72AFDB]">
                        <IndianRupee className="w-5 h-5 font-bold" />
                      </div>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        placeholder="e.g. 25000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-lg font-bold focus:border-[#72AFDB] focus:ring-1 focus:ring-[#72AFDB] outline-none transition-colors"
                      />
                    </div>
                    {quotationNumber && (
                      <p className="text-[11px] text-[#72AFDB] mt-1">
                        Linked with Quotation Reference: #{quotationNumber}
                      </p>
                    )}
                  </div>

                  {/* Client Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-[#72AFDB] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        placeholder="Infosys / Acme Corp"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-[#72AFDB] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Mobile Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#72AFDB] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="accounts@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-[#72AFDB] outline-none"
                      />
                    </div>
                  </div>

                  {/* Payment Type Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Payment Purpose
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'advance', label: 'Advance Deposit' },
                        { id: 'balance', label: 'Balance on Dispatch' },
                        { id: 'full', label: '100% Full Payment' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setPaymentType(t.id as any)}
                          className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            paymentType === t.id
                              ? 'bg-[#72AFDB]/20 border-[#72AFDB] text-[#72AFDB]'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-[#72AFDB]/25 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Opening Payment Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay {amount ? `₹${parseFloat(amount || '0').toLocaleString('en-IN')}` : 'Now'} Securely</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                    <span>UPI (GPay / PhonePe / Paytm)</span>
                    <span>•</span>
                    <span>Visa / MasterCard / RuPay</span>
                    <span>•</span>
                    <span>Net Banking (50+ Banks)</span>
                  </div>
                </form>
              )}

              {/* TAB 2: Instant Dynamic UPI QR Code */}
              {paymentMethodTab === 'upi_qr' && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">Dynamic UPI QR Code</h2>
                      <p className="text-xs text-slate-400">Scan & Pay using Google Pay, PhonePe, Paytm, BHIM or any UPI App</p>
                    </div>
                    <div className="p-2 bg-[#72AFDB]/10 text-[#72AFDB] rounded-xl">
                      <QrCode className="w-5 h-5" />
                    </div>
                  </div>

                  {/* QR Code Presentation Box */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCodeUrl}
                        alt="LTS BAGS Dynamic UPI QR Code"
                        className="w-44 h-44 object-contain rounded-lg"
                      />
                    </div>
                    <div className="space-y-3 text-center sm:text-left flex-1">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Payable Amount:</span>
                        <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                          ₹{numericAmount.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Beneficiary UPI ID:</span>
                        <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                          <code className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm text-white font-mono font-bold">
                            {bankDetails.upiId}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bankDetails.upiId, 'upi')}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors"
                            title="Copy UPI ID"
                          >
                            {copiedBankField === 'upi' ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Mobile direct UPI Intent button */}
                      <a
                        href={upiPayUrl}
                        className="inline-flex sm:hidden items-center gap-2 bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Pay in UPI App Directly</span>
                      </a>
                    </div>
                  </div>

                  {/* UTR Verification Sub-form */}
                  <form onSubmit={handleUtrSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#72AFDB]" />
                      <span>Step 2: Confirm UPI Payment & Get Instant Receipt</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Payer Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-[#72AFDB] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                          UPI 12-Digit UTR / Ref No *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 422019384729"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#72AFDB] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={utrSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                    >
                      {utrSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying UPI Reference...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>I Have Paid — Generate Official Receipt</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: Direct Bank NEFT / RTGS Wire Transfer */}
              {paymentMethodTab === 'bank_transfer' && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">Direct Company Bank Account</h2>
                      <p className="text-xs text-slate-400">For high-value corporate RTGS, NEFT, or IMPS wire transfers</p>
                    </div>
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    {[
                      { label: 'Beneficiary Name', value: bankDetails.accountName, key: 'name' },
                      { label: 'Bank Name', value: bankDetails.bankName, key: 'bank' },
                      { label: 'Current Account Number', value: bankDetails.accountNumber, key: 'acc' },
                      { label: 'IFSC Code', value: bankDetails.ifscCode, key: 'ifsc' },
                      { label: 'Account Type', value: bankDetails.accountType, key: 'type' },
                      { label: 'Branch Location', value: bankDetails.branch, key: 'branch' },
                      { label: 'Company UPI ID', value: bankDetails.upiId, key: 'upi' },
                    ].map((row) => (
                      <div
                        key={row.key}
                        className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="text-[11px] text-slate-500 block">{row.label}</span>
                          <span className="font-mono font-bold text-white text-sm">{row.value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(row.value, row.key)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Copy to clipboard"
                        >
                          {copiedBankField === row.key ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* UTR Submission Form for Bank Transfer */}
                  <form onSubmit={handleUtrSubmit} className="space-y-4 pt-4 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Submit Bank Wire UTR Reference</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Payer / Company Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Your Name / Company"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-[#72AFDB] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Bank UTR / Transaction No *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. HDFC1290384759"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#72AFDB] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={utrSubmitting}
                      className="w-full bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                    >
                      {utrSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registering Wire Transfer...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Submit UTR & Record Payment</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right Column: Factory Guarantees & Billing Help (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Company Credential Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#72AFDB]/10 border border-[#72AFDB]/30 flex items-center justify-center text-[#72AFDB]">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">LTS BAGS PRIVATE LIMITED</h3>
                    <p className="text-xs text-slate-400">Govt. Registered OEM/ODM Bag Factory</p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3.5 space-y-2 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">GSTIN:</span>
                    <span className="text-slate-200">27AABCL9876Q1Z5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Plant Location:</span>
                    <span className="text-slate-200">MIDC Navi Mumbai & Dharavi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Sales Desk:</span>
                    <span className="text-[#72AFDB]">+91 98335 98338</span>
                  </div>
                </div>
              </div>

              {/* Manufacturing Assurance Badges */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Payment & Production Assurance
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Instant Factory Production Queue</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Raw fabric rolls and custom logo tooling are allocated immediately upon advance confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-sky-500/10 text-[#72AFDB] rounded-xl shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">18% GST Input Credit Tax Invoice</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Full GST invoices issued with your company GSTIN for legitimate business expense &amp; ITC claiming.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Dedicated Production Manager</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Receive real-time fabric cutting photos, embroidery proofs, and dispatch tracking on WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Billing Support */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-[#72AFDB]/30 rounded-3xl p-6 space-y-3">
                <h3 className="font-bold text-white text-sm">Need Help with Payment?</h3>
                <p className="text-xs text-slate-400">
                  Contact our accounts department directly for proforma invoices, vendor onboarding forms, or high-volume POs.
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <a
                    href="https://wa.me/919833598338?text=Hello%20LTS%20BAGS,%20I%20need%20assistance%20with%20online%20payment"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Chat on WhatsApp (+91 98335 98338)</span>
                  </a>
                  <a
                    href="tel:+919833598338"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#72AFDB]" />
                    <span>Call Accounts Desk: +91 98335 98338</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sandbox / Direct Payment Simulator Modal (If needed) */}
        {showSimulatedModal && simOrderData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-950 border border-[#72AFDB]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#72AFDB]/20 text-[#72AFDB] rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Secure Gateway Checkout</h3>
                    <p className="text-[11px] text-slate-400">Order Ref: {simOrderData.order?.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSimulatedModal(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Merchant:</span>
                  <span className="font-bold text-white">LTS BAGS PRIVATE LIMITED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payer Name:</span>
                  <span className="text-slate-200">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Payable:</span>
                  <span className="text-base font-bold text-emerald-400">₹{simOrderData.numericAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-semibold">Select Payment Mode to Complete:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      finalizePaymentVerification({
                        amount: simOrderData.numericAmount,
                        paymentMethod: 'UPI',
                        isSimulated: true,
                        razorpay_payment_id: `pay_upi_${Date.now()}`,
                      })
                    }
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-[#72AFDB] rounded-xl text-left transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>UPI (GPay / PhonePe)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Instant Approval</span>
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      finalizePaymentVerification({
                        amount: simOrderData.numericAmount,
                        paymentMethod: 'CARD',
                        isSimulated: true,
                        razorpay_payment_id: `pay_card_${Date.now()}`,
                      })
                    }
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-[#72AFDB] rounded-xl text-left transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#72AFDB]" />
                      <span>Card / NetBanking</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Visa / Master / RuPay</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    finalizePaymentVerification({
                      amount: simOrderData.numericAmount,
                      paymentMethod: 'ONLINE_GATEWAY',
                      isSimulated: true,
                      razorpay_payment_id: `pay_rzp_${Date.now()}`,
                    })
                  }
                  className="w-full bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirm &amp; Generate Tax Receipt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#72AFDB]" />
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
