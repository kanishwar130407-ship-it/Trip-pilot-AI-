import React, { useState } from 'react';
import {
  Printer,
  Share2,
  Download,
  Check,
  Shield,
  MapPin,
  Calendar,
  Users,
  Luggage,
  QrCode,
  FileCheck2,
  ExternalLink,
  MessageCircle,
  Mail,
  Copy,
  HelpCircle,
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { MOCK_HOSPITALS, MOCK_POLICE_STATIONS } from '../data/mockTripData';
import { translations } from '../i18n/translations';
import { EmptyState } from '../components/common/EmptyState';

export const DossierPage: React.FC = () => {
  const language = useTripStore((s) => s.language);
  const t = translations[language] || translations.en;

  const plannerForm = useTripStore((s) => s.plannerForm);
  const selectedPackage = useTripStore((s) => s.selectedPackage);
  const travelers = useTripStore((s) => s.travelers);
  const bookingId = useTripStore((s) => s.bookingId);
  const bookedAt = useTripStore((s) => s.bookedAt);
  const itinerary = useTripStore((s) => s.itinerary);
  const packingChecklist = useTripStore((s) => s.packingChecklist);
  const safetyNotes = useTripStore((s) => s.safetyNotes);
  const trustedContacts = useTripStore((s) => s.trustedContacts);
  const expenses = useTripStore((s) => s.expenses);
  const replanHistory = useTripStore((s) => s.replanHistory);
  const shareTrackingId = useTripStore((s) => s.shareTrackingId);

  const [copiedDossier, setCopiedDossier] = useState(false);

  const trackingUrl = `${window.location.origin}/#/track/${shareTrackingId}`;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `TripPilot AI Dossier: ${plannerForm.destination} (${bookingId})`,
        text: `Here is our complete digital trip dossier and emergency directory for ${plannerForm.destination}. Tracking link: ${trackingUrl}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedDossier(true);
      setTimeout(() => setCopiedDossier(false), 2000);
    }
  };

  if (!plannerForm.destination) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <EmptyState type="dossier" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
      {/* Top Action Bar (Hidden on print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <span className="text-xs font-bold text-[#FF7A1A] uppercase tracking-wider">
            Verified Digital Document
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t.dossier.title}
          </h1>
          <p className="text-xs text-slate-500">{t.dossier.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 active:scale-95 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.dossier.downloadPdf}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-4 rounded-xl bg-[#FF7A1A] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FF7A1A]/30 active:scale-95 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedDossier ? 'Link Copied!' : t.dossier.shareTrip}</span>
          </button>
        </div>
      </div>

      {/* Main Printable Dossier Document */}
      <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-slate-900 dark:text-slate-100 print:shadow-none print:border-none print:p-0">
        {/* Document Header & QR Code */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#FF7A1A]">TripPilot AI</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 border border-teal-500/30">
                Official Digital Itinerary
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {plannerForm.from} &rarr; {plannerForm.destination}
            </h2>
            <p className="text-xs text-slate-500">
              Booking Ref: <strong>{bookingId}</strong> • Issued: {bookedAt}
            </p>
          </div>

          {/* Clean SVG Mock QR Code */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-lg p-2 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-white" />
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-1">Scan for Live GPS</span>
          </div>
        </div>

        {/* Hero Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block">Dates</span>
            <span className="font-bold">
              {plannerForm.startDate} to {plannerForm.endDate}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block">Travelers</span>
            <span className="font-bold">{travelers.length} Passengers</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block">Package</span>
            <span className="font-bold text-[#FF7A1A]">
              {selectedPackage?.name || 'Classic Comfort'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block">Total Budget</span>
            <span className="font-bold">₹{plannerForm.budget.toLocaleString()}</span>
          </div>
        </div>

        {/* Section 1: Traveler Manifest */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-[#FF7A1A]" />
            <span>Passenger Manifest</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {travelers.map((tr, idx) => (
              <div
                key={tr.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>
                    {idx + 1}. {tr.fullName}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {tr.age} yrs • {tr.gender}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Phone: {tr.phone} • Email: {tr.email}
                </div>
                <div className="text-[11px] text-slate-500">
                  ID: {tr.idType} ({tr.idNumber}) • Meal: {tr.mealPreference}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Complete Itinerary Schedule */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#14B8A6]" />
            <span>{t.dossier.itineraryDetails}</span>
          </h3>

          <div className="space-y-3">
            {itinerary.map((day) => (
              <div
                key={day.day}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
              >
                <div className="flex justify-between font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  <span>
                    Day {day.day}: {day.title}
                  </span>
                  <span>Est: ₹{day.dayTotalCost.toLocaleString()}</span>
                </div>

                <div className="space-y-1.5">
                  {day.activities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start justify-between gap-2 text-[11px]"
                    >
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {act.time} — {act.activity}
                        </strong>
                        <p className="text-slate-500">
                          📍 {act.location} • {act.notes}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                        {act.estimatedCost > 0 ? `₹${act.estimatedCost}` : 'Included'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Emergency Directory (Hospitals, Police, Trusted Contacts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2 text-xs">
            <h4 className="font-bold text-red-600 flex items-center gap-1.5">
              <span>{t.dossier.hospitalList}</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-700 dark:text-slate-300">
              {MOCK_HOSPITALS.map((h, i) => (
                <li key={i}>
                  <strong>{h.name}</strong>
                  <div className="text-slate-500">
                    {h.address} • Tel: <a href={`tel:${h.phone}`} className="text-red-600 font-bold">{h.phone}</a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2 text-xs">
            <h4 className="font-bold text-blue-600 flex items-center gap-1.5">
              <span>{t.dossier.policeList} & Helplines</span>
            </h4>
            <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
              <div>
                <strong>National Emergency Helpline:</strong> 112
              </div>
              <div>
                <strong>Tamil Nadu Police:</strong> 100
              </div>
              <div>
                <strong>Nilgiris Ambulance Trauma:</strong> 108
              </div>
              <div>
                <strong>Women Helpline:</strong> 1091
              </div>
              <div className="pt-1">
                <strong>Ooty Town Police Station:</strong> 0423-2442222
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Budget & Replan Audit */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex justify-between items-center font-bold">
            <span>{t.dossier.expensesTotal}:</span>
            <span className="text-[#FF7A1A]">
              ₹{totalSpent.toLocaleString()} spent of ₹{plannerForm.budget.toLocaleString()}
            </span>
          </div>
          {replanHistory.length > 0 && (
            <div className="text-[11px] text-slate-500 pt-1">
              Active Replan Record: {replanHistory[0].disruption} &rarr; {replanHistory[0].selectedOption}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
          Generated automatically by TripPilot AI Autonomous Travel Operating System. For live tracking updates, visit:{' '}
          <span className="font-mono text-teal-600">{trackingUrl}</span>
        </div>
      </div>
    </div>
  );
};
