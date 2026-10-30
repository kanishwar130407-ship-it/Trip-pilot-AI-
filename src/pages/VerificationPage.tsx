import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  User,
  Phone,
  Mail,
  CreditCard,
  QrCode,
  AlertCircle,
  Tag,
  Sparkles,
  Plane,
  X,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { TravelerInfo } from '../types/trip';
import { translations } from '../i18n/translations';
import { BookingSuccessVehicleModal } from '../components/vehicles/BookingSuccessVehicleModal';

export const VerificationPage: React.FC = () => {
  const language = useTripStore((s) => s.language);
  const t = translations[language] || translations.en;

  const plannerForm = useTripStore((s) => s.plannerForm);
  const selectedPackage = useTripStore((s) => s.selectedPackage);
  const travelers = useTripStore((s) => s.travelers);
  const setTraveler = useTripStore((s) => s.setTraveler);
  const addTraveler = useTripStore((s) => s.addTraveler);
  const removeTraveler = useTripStore((s) => s.removeTraveler);
  const couponCode = useTripStore((s) => s.couponCode);
  const discountAmount = useTripStore((s) => s.discountAmount);
  const applyCoupon = useTripStore((s) => s.applyCoupon);
  const paymentMethod = useTripStore((s) => s.paymentMethod);
  const setPaymentMethod = useTripStore((s) => s.setPaymentMethod);
  const completeBooking = useTripStore((s) => s.completeBooking);
  const bookingId = useTripStore((s) => s.bookingId);
  const setStep = useTripStore((s) => s.setStep);
  const unlockStep = useTripStore((s) => s.unlockStep);
  const openHelpSheet = useTripStore((s) => s.openHelpSheet);

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Financial calculations
  const basePrice = selectedPackage?.price || 12400;
  const taxes = Math.round(basePrice * 0.05); // 5% GST
  const totalAmount = Math.max(0, basePrice + taxes - discountAmount);

  // Live traveler validation helper
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => /^\d{10}$/.test(phone.replace(/\D/g, ''));
  const isIdValid = (idNum: string) => idNum.trim().length >= 6;

  const areAllTravelersValid = travelers.every(
    (tr) =>
      tr.fullName.trim().length >= 3 &&
      tr.age >= 1 &&
      isPhoneValid(tr.phone) &&
      isEmailValid(tr.email) &&
      isIdValid(tr.idNumber)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const success = applyCoupon(inputCoupon);
    if (success) {
      setCouponSuccess('Coupon applied successfully! (₹1,240 saved)');
    } else {
      setCouponError('Invalid coupon. Try PILOT10 or TAMILNADU15');
    }
  };

  const handleConfirmAndPay = () => {
    if (!areAllTravelersValid) return;
    setIsProcessing(true);

    // 2s realistic processing loader
    setTimeout(() => {
      setIsProcessing(false);
      completeBooking();
      setShowSuccessModal(true);

      // Trigger Confetti explosion
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF7A1A', '#14B8A6', '#0B1F3A', '#F59E0B'],
        });
      } catch (err) {
        // ignore
      }
    }, 2000);
  };

  const handleProceedToCompanion = () => {
    setShowSuccessModal(false);
    unlockStep(4);
    setStep(4); // navigate to Live Companion
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B1F3A] to-[#14B8A6]/20 p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/40 text-[#14B8A6] text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Friction Mock Booking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t.verification.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {t.verification.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Trip Summary & Price Breakdown */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#FF7A1A]" />
              <span>{t.verification.tripSummary}</span>
            </h2>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>Route:</span>
                <span>
                  {plannerForm.from} &rarr; {plannerForm.destination}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Dates:</span>
                <span>
                  {plannerForm.startDate} to {plannerForm.endDate}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Travelers:</span>
                <span>{travelers.length} Travelers</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Selected Package:</span>
                <span className="font-semibold text-[#FF7A1A]">
                  {selectedPackage?.name || 'Classic Comfort'}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t.verification.basePrice}:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{basePrice.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t.verification.taxes}:</span>
                <span>₹{taxes.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-teal-600 dark:text-teal-400 font-bold">
                  <span>Discount ({couponCode}):</span>
                  <span>- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t.verification.totalAmount}:
                </span>
                <span className="text-2xl font-black text-[#FF7A1A]">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder={t.verification.couponPlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-[#0B1F3A] dark:bg-slate-800 text-white hover:bg-slate-800 border border-slate-700 transition"
                >
                  {t.verification.applyCoupon}
                </button>
              </div>
              {couponSuccess && (
                <p className="text-[11px] text-teal-600 font-semibold mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{couponSuccess}</span>
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-red-500 font-semibold mt-1.5">
                  {couponError}
                </p>
              )}
            </form>

            {/* Cancellation Policy Box */}
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-[11px] text-teal-800 dark:text-teal-200 leading-snug">
              🛡️ <strong>Free Cancellation:</strong> Full refund up to 24 hours before journey departure. Zero processing penalty on mock booking.
            </div>
          </div>
        </div>

        {/* Right Section: Multi-Traveler Forms & Mock Payment */}
        <div className="lg:col-span-7 space-y-5">
          {/* Traveler Details Card */}
          <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF7A1A]" />
                <span>{t.verification.travelerDetails}</span>
              </h2>

              <button
                type="button"
                onClick={addTraveler}
                className="text-xs font-bold text-[#FF7A1A] hover:underline"
              >
                {t.verification.addTraveler}
              </button>
            </div>

            {/* Traveler Forms */}
            <div className="space-y-4">
              {travelers.map((tr, index) => {
                const nameOk = tr.fullName.trim().length >= 3;
                const phoneOk = isPhoneValid(tr.phone);
                const emailOk = isEmailValid(tr.email);
                const idOk = isIdValid(tr.idNumber);

                return (
                  <div
                    key={tr.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>Traveler {index + 1}</span>
                        {index === 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FF7A1A]/10 text-[#FF7A1A] font-semibold">
                            Primary
                          </span>
                        )}
                      </span>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeTraveler(index)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Name */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                          <span>Full Name (as per ID) *</span>
                          {nameOk && <Check className="w-3 h-3 text-teal-500" />}
                        </label>
                        <input
                          type="text"
                          value={tr.fullName}
                          onChange={(e) =>
                            setTraveler(index, { ...tr, fullName: e.target.value })
                          }
                          className={`w-full py-2 px-3 text-xs rounded-xl bg-white dark:bg-slate-800 border font-medium ${
                            nameOk
                              ? 'border-slate-200 dark:border-slate-700'
                              : 'border-red-400'
                          }`}
                        />
                      </div>

                      {/* Age & Gender */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                            Age *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="110"
                            value={tr.age}
                            onChange={(e) =>
                              setTraveler(index, { ...tr, age: Number(e.target.value) })
                            }
                            className="w-full py-2 px-3 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                            Gender
                          </label>
                          <select
                            value={tr.gender}
                            onChange={(e) =>
                              setTraveler(index, {
                                ...tr,
                                gender: e.target.value as any,
                              })
                            }
                            className="w-full py-2 px-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                          <span>Phone (10 Digits) *</span>
                          {phoneOk ? (
                            <Check className="w-3 h-3 text-teal-500" />
                          ) : (
                            <span className="text-[9px] text-red-400">10 digits</span>
                          )}
                        </label>
                        <input
                          type="tel"
                          value={tr.phone}
                          onChange={(e) =>
                            setTraveler(index, { ...tr, phone: e.target.value })
                          }
                          className={`w-full py-2 px-3 text-xs rounded-xl bg-white dark:bg-slate-800 border font-medium ${
                            phoneOk
                              ? 'border-slate-200 dark:border-slate-700'
                              : 'border-red-400'
                          }`}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                          <span>Email Address *</span>
                          {emailOk && <Check className="w-3 h-3 text-teal-500" />}
                        </label>
                        <input
                          type="email"
                          value={tr.email}
                          onChange={(e) =>
                            setTraveler(index, { ...tr, email: e.target.value })
                          }
                          className={`w-full py-2 px-3 text-xs rounded-xl bg-white dark:bg-slate-800 border font-medium ${
                            emailOk
                              ? 'border-slate-200 dark:border-slate-700'
                              : 'border-red-400'
                          }`}
                        />
                      </div>

                      {/* ID Type & Number */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                          ID Type
                        </label>
                        <select
                          value={tr.idType}
                          onChange={(e) =>
                            setTraveler(index, {
                              ...tr,
                              idType: e.target.value as any,
                            })
                          }
                          className="w-full py-2 px-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        >
                          <option value="Aadhaar">Aadhaar Card</option>
                          <option value="Passport">Passport</option>
                          <option value="Voter ID">Voter ID</option>
                          <option value="Driving License">Driving License</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                          <span>ID Number *</span>
                          {idOk && <Check className="w-3 h-3 text-teal-500" />}
                        </label>
                        <input
                          type="text"
                          value={tr.idNumber}
                          onChange={(e) =>
                            setTraveler(index, { ...tr, idNumber: e.target.value })
                          }
                          className={`w-full py-2 px-3 text-xs rounded-xl bg-white dark:bg-slate-800 border font-medium ${
                            idOk
                              ? 'border-slate-200 dark:border-slate-700'
                              : 'border-red-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#FF7A1A]" />
                <span>{t.verification.paymentMethod}</span>
              </h2>
              <button
                type="button"
                onClick={() => openHelpSheet('payment')}
                className="text-slate-400 hover:text-[#FF7A1A]"
                title="Payment Protection & Gateway Guide"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'UPI', label: 'Instant UPI', desc: 'GPay / PhonePe / QR' },
                { id: 'Card', label: 'Credit/Debit Card', desc: 'Visa / Mastercard' },
                { id: 'Net banking', label: 'Net Banking', desc: 'All Indian Banks' },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl text-left border transition ${
                      isSelected
                        ? 'bg-[#FF7A1A]/10 border-[#FF7A1A] ring-2 ring-[#FF7A1A]'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {m.label}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {m.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Confirm & Book Button */}
            <button
              type="button"
              disabled={!areAllTravelersValid || isProcessing}
              onClick={handleConfirmAndPay}
              className="w-full py-4 rounded-2xl bg-[#FF7A1A] hover:bg-[#ff8c38] disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-[#FF7A1A]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Mock Transaction...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>
                    {t.verification.payConfirm} (₹{totalAmount.toLocaleString()})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mode-Specific Vehicle Celebration Booking Success Modal */}
      <BookingSuccessVehicleModal
        isOpen={showSuccessModal}
        onProceed={handleProceedToCompanion}
      />
    </div>
  );
};
