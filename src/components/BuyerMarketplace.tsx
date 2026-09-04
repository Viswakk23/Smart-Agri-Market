import React, { useState } from 'react';
import { BuyerRequirement, CropListing, BuyerReview } from '../types';
import { RAW_BUYER_REQUIREMENTS, INITIAL_CROP_LISTINGS } from '../data/buyerData';
import { 
  Store, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  DollarSign, 
  Truck, 
  FileText, 
  Lock, 
  Banknote,
  X,
  Search,
  Filter,
  Star,
  Award,
  BadgeCheck,
  Phone,
  Mail,
  Scale,
  Clock,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const BuyerMarketplace: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'demands' | 'workflow'>('listings');
  const [listings, setListings] = useState<CropListing[]>(INITIAL_CROP_LISTINGS);
  const [buyers, setBuyers] = useState<BuyerRequirement[]>(RAW_BUYER_REQUIREMENTS);

  // Advanced Search & Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cropFilter, setCropFilter] = useState<string>('All');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [certificationFilter, setCertificationFilter] = useState<string>('All');
  const [quantityFilter, setQuantityFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [storageFilter, setStorageFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'qty-desc' | 'grade'>('default');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Buyer Profile Modal State
  const [selectedBuyerProfile, setSelectedBuyerProfile] = useState<BuyerRequirement | null>(null);
  
  // Write Review Modal State
  const [reviewBuyerTarget, setReviewBuyerTarget] = useState<BuyerRequirement | null>(null);
  const [reviewFarmerName, setReviewFarmerName] = useState<string>('Rameshwar Patil');
  const [reviewFarmerLocation, setReviewFarmerLocation] = useState<string>('Nashik, Maharashtra');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewPaymentScore, setReviewPaymentScore] = useState<number>(5);
  const [reviewWeighmentScore, setReviewWeighmentScore] = useState<number>(5);
  const [reviewQualityScore, setReviewQualityScore] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string>('');

  // Verification Request Modal State
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [verifFssai, setVerifFssai] = useState<string>('11521019000214');
  const [verifGstin, setVerifGstin] = useState<string>('27AAACB2154P1Z3');
  const [verifApeda, setVerifApeda] = useState<string>('APEDA/EXP/2026/0912');
  const [verifSuccess, setVerifSuccess] = useState<boolean>(false);

  // Listing creation modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newCrop, setNewCrop] = useState<string>('Tomato');
  const [newVariety, setNewVariety] = useState<string>('Hybrid Desi');
  const [newQuantity, setNewQuantity] = useState<number>(120);
  const [newPrice, setNewPrice] = useState<number>(2750);
  const [newLocation, setNewLocation] = useState<string>('Kolar Rural, Karnataka');
  const [newFarmerName, setNewFarmerName] = useState<string>('Rameshwar Patil');
  const [newFarmerPhone, setNewFarmerPhone] = useState<string>('+91 98234 11209');
  const [newGrade, setNewGrade] = useState<'Grade A+' | 'Grade A' | 'Grade B' | 'Export Grade'>('Grade A+');
  const [newStorageType, setNewStorageType] = useState<'On Farm (Ambient)' | 'Cold Storage' | 'Packhouse'>('On Farm (Ambient)');
  const [selectedCerts, setSelectedCerts] = useState<string[]>(['FSSAI Compliant', 'India Organic / NPOP']);

  // Offer modal state
  const [selectedListingForOffer, setSelectedListingForOffer] = useState<CropListing | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(2650);
  const [offerSuccess, setOfferSuccess] = useState<boolean>(false);

  // Transaction workflow simulator state
  const [workflowStep, setWorkflowStep] = useState<number>(1);
  const [simulatedTradeStatus, setSimulatedTradeStatus] = useState<string>('Draft Agreement');

  // Filter logic for Crop Listings
  const filteredListings = listings.filter(item => {
    const matchesCrop = cropFilter === 'All' || item.crop.toLowerCase() === cropFilter.toLowerCase();
    const matchesGrade = gradeFilter === 'All' || item.qualityGrade === gradeFilter;
    const matchesStorage = storageFilter === 'All' || item.storageType === storageFilter;
    const matchesState = stateFilter === 'All' || item.state.toLowerCase() === stateFilter.toLowerCase();
    
    const matchesCert = certificationFilter === 'All' || 
      (item.certifications && item.certifications.some(c => c.toLowerCase().includes(certificationFilter.toLowerCase())));
    
    let matchesQty = true;
    if (quantityFilter === 'under100') matchesQty = item.quantityQtl < 100;
    else if (quantityFilter === '100to500') matchesQty = item.quantityQtl >= 100 && item.quantityQtl <= 500;
    else if (quantityFilter === 'above500') matchesQty = item.quantityQtl > 500;

    const matchesSearch = searchTerm === '' || 
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCrop && matchesGrade && matchesStorage && matchesState && matchesCert && matchesQty && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.expectedPrice - b.expectedPrice;
    if (sortBy === 'price-desc') return b.expectedPrice - a.expectedPrice;
    if (sortBy === 'qty-desc') return b.quantityQtl - a.quantityQtl;
    if (sortBy === 'grade') return (a.qualityGrade === 'Export Grade' || a.qualityGrade === 'Grade A+') ? -1 : 1;
    return 0;
  });

  // Filter logic for Corporate Buyer Requirements
  const filteredBuyers = buyers.filter(item => {
    const matchesCrop = cropFilter === 'All' || item.crop.toLowerCase() === cropFilter.toLowerCase();
    const matchesState = stateFilter === 'All' || item.state.toLowerCase() === stateFilter.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesState && matchesSearch;
  });

  const activeFiltersCount = (cropFilter !== 'All' ? 1 : 0) + 
    (gradeFilter !== 'All' ? 1 : 0) + 
    (certificationFilter !== 'All' ? 1 : 0) + 
    (quantityFilter !== 'All' ? 1 : 0) + 
    (stateFilter !== 'All' ? 1 : 0) + 
    (storageFilter !== 'All' ? 1 : 0) + 
    (searchTerm !== '' ? 1 : 0);

  const resetAllFilters = () => {
    setSearchTerm('');
    setCropFilter('All');
    setGradeFilter('All');
    setCertificationFilter('All');
    setQuantityFilter('All');
    setStateFilter('All');
    setStorageFilter('All');
    setSortBy('default');
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CropListing = {
      id: `LST-00${listings.length + 1}`,
      farmerName: newFarmerName,
      farmerPhone: newFarmerPhone,
      crop: newCrop,
      variety: newVariety,
      quantityQtl: newQuantity,
      expectedPrice: newPrice,
      location: newLocation,
      state: 'Karnataka',
      harvestDate: '2026-09-04',
      qualityGrade: newGrade,
      certifications: selectedCerts,
      moisturePct: 12,
      storageType: newStorageType,
      status: 'Available',
      offersCount: 0
    };

    setListings([created, ...listings]);
    setShowCreateModal(false);
  };

  const handleOpenOfferModal = (listing: CropListing) => {
    setSelectedListingForOffer(listing);
    setOfferPrice(listing.expectedPrice - 50);
    setOfferSuccess(false);
  };

  const handleSubmitOffer = () => {
    if (!selectedListingForOffer) return;
    setListings(prev => prev.map(item => 
      item.id === selectedListingForOffer.id 
        ? { ...item, offersCount: item.offersCount + 1 }
        : item
    ));
    setOfferSuccess(true);
  };

  const handleOpenReviewModal = (buyer: BuyerRequirement) => {
    setReviewBuyerTarget(buyer);
    setReviewComment('');
    setReviewSuccessMessage('');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBuyerTarget) return;

    const newReview: BuyerReview = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      buyerId: reviewBuyerTarget.id,
      farmerName: reviewFarmerName,
      farmerLocation: reviewFarmerLocation,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment || 'Verified transaction completed with transparent weighment and prompt escrow release.',
      tradeCrop: reviewBuyerTarget.crop,
      quantityQtl: 100,
      paymentPunctualityRating: reviewPaymentScore,
      weighmentFairnessRating: reviewWeighmentScore,
      qualityAcceptanceRating: reviewQualityScore,
      verifiedTrade: true
    };

    const existingReviews = reviewBuyerTarget.reviews || [];
    const updatedReviews = [newReview, ...existingReviews];
    const avg = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(2));

    const updatedBuyers = buyers.map(b => b.id === reviewBuyerTarget.id ? {
      ...b,
      rating: avg,
      reviewsCount: updatedReviews.length,
      reviews: updatedReviews
    } : b);

    setBuyers(updatedBuyers);
    if (selectedBuyerProfile && selectedBuyerProfile.id === reviewBuyerTarget.id) {
      setSelectedBuyerProfile({
        ...selectedBuyerProfile,
        rating: avg,
        reviewsCount: updatedReviews.length,
        reviews: updatedReviews
      });
    }

    setReviewSuccessMessage(`Review registered successfully for ${reviewBuyerTarget.company}! Thank you for keeping the agri network trusted.`);
    setTimeout(() => {
      setReviewBuyerTarget(null);
      setReviewSuccessMessage('');
    }, 1800);
  };

  const handleVerifyBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifSuccess(true);
    setTimeout(() => {
      setShowVerificationModal(false);
      setVerifSuccess(false);
    }, 1600);
  };

  const nextWorkflowStep = () => {
    if (workflowStep === 1) {
      setWorkflowStep(2);
      setSimulatedTradeStatus('100% Escrow Deposited');
    } else if (workflowStep === 2) {
      setWorkflowStep(3);
      setSimulatedTradeStatus('Gate Inward Assay Verified (Grade A+)');
    } else if (workflowStep === 3) {
      setWorkflowStep(4);
      setSimulatedTradeStatus('Instant DBT Released to Farmer (Settled)');
    } else {
      setWorkflowStep(1);
      setSimulatedTradeStatus('Draft Agreement');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Direct Buyer Marketplace & Verified Institutional Trading
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Connect directly with verified supermarkets, corporate food processors, and exporters. Escrow-secured transactions with zero middleman deductions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowVerificationModal(true)}
            className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-lg transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Buyer Verification Hub</span>
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Harvest Lot</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold text-slate-600">
        <button
          onClick={() => setActiveSubTab('listings')}
          className={`pb-3 transition flex items-center gap-2 ${
            activeSubTab === 'listings'
              ? 'border-b-2 border-emerald-700 text-emerald-800 font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Active Farmer Lots ({filteredListings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('demands')}
          className={`pb-3 transition flex items-center gap-2 ${
            activeSubTab === 'demands'
              ? 'border-b-2 border-emerald-700 text-emerald-800 font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Verified Corporate Demands ({filteredBuyers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('workflow')}
          className={`pb-3 transition flex items-center gap-2 ${
            activeSubTab === 'workflow'
              ? 'border-b-2 border-emerald-700 text-emerald-800 font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Guaranteed Escrow Trade Flow</span>
        </button>
      </div>

      {/* Sophisticated Search & Filtering Header Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by crop, variety, farmer name, hub location, or buyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Crop Selector */}
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Crops</option>
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Wheat">Wheat</option>
              <option value="Mustard">Mustard</option>
              <option value="Basmati Rice">Basmati Rice</option>
              <option value="Soybean">Soybean</option>
              <option value="Cotton">Cotton</option>
              <option value="Potato">Potato</option>
            </select>

            {/* Quality Grade Filter */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Quality Grades</option>
              <option value="Export Grade">Export Grade</option>
              <option value="Grade A+">Grade A+</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="qty-desc">Quantity: High to Low</option>
              <option value="grade">Quality Grade Priority</option>
            </select>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border ${
                showFilterDrawer || activeFiltersCount > 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-emerald-600 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="p-2 text-slate-400 hover:text-slate-700 transition"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters Drawer */}
        {showFilterDrawer && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Certifications</label>
              <select
                value={certificationFilter}
                onChange={(e) => setCertificationFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="All">All Certifications</option>
                <option value="India Organic">India Organic / NPOP</option>
                <option value="GlobalGAP">GlobalGAP Certified</option>
                <option value="FSSAI">FSSAI Food Safety</option>
                <option value="Jaivik Bharat">Jaivik Bharat</option>
                <option value="FairTrade">FairTrade</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Quantity Lot Size</label>
              <select
                value={quantityFilter}
                onChange={(e) => setQuantityFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="All">Any Quantity</option>
                <option value="under100">&lt; 100 Quintals</option>
                <option value="100to500">100 – 500 Quintals</option>
                <option value="above500">&gt; 500 Quintals (Truckload)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">State / Region</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="All">All States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Punjab">Punjab</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Haryana">Haryana</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Storage Condition</label>
              <select
                value={storageFilter}
                onChange={(e) => setStorageFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="All">All Storage Types</option>
                <option value="On Farm (Ambient)">On Farm (Ambient)</option>
                <option value="Cold Storage">Cold Storage Facility</option>
                <option value="Packhouse">Graded Packhouse</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: FARMER LISTINGS */}
      {activeSubTab === 'listings' && (
        <div className="space-y-4">
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
              <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No crop listings match your filter criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting your filters or broadcast a new harvest lot.</p>
              <button
                onClick={resetAllFilters}
                className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <div 
                  key={listing.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">{listing.crop}</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            listing.qualityGrade === 'Export Grade' 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : listing.qualityGrade === 'Grade A+' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {listing.qualityGrade}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          {listing.variety} • Harvest: {listing.harvestDate}
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        listing.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {listing.status}
                      </span>
                    </div>

                    {/* Certifications Badges */}
                    {listing.certifications && listing.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {listing.certifications.map((cert, cIdx) => (
                          <span 
                            key={cIdx}
                            className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1"
                          >
                            <BadgeCheck className="w-3 h-3 text-emerald-600" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Lot Quantity:</span>
                        <strong className="text-slate-900 font-bold">{listing.quantityQtl} Quintals</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Farmer Asking Rate:</span>
                        <strong className="text-emerald-700 font-black font-mono text-sm">
                          ₹{listing.expectedPrice} / Qtl
                        </strong>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-1.5">
                        <span className="text-slate-500">Storage Location:</span>
                        <span className="text-slate-700 font-medium">{listing.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Storage Method:</span>
                        <span className="text-slate-700 font-medium">{listing.storageType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      Offers Received: <strong>{listing.offersCount}</strong>
                    </span>
                    <button
                      onClick={() => handleOpenOfferModal(listing)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition shadow-sm"
                    >
                      Place Buyer Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: VERIFIED BUYER REQUIREMENTS & PROFILES */}
      {activeSubTab === 'demands' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuyers.map(buyer => (
              <div 
                key={buyer.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-slate-900 leading-snug">
                          {buyer.company}
                        </h3>
                        {buyer.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Corporate Verified Procurement" />
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Rep: {buyer.buyerName}
                      </span>
                    </div>

                    {buyer.urgent && (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Urgent Need
                      </span>
                    )}
                  </div>

                  {/* Rating & Verification Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold text-amber-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{buyer.rating}</span>
                      <span className="text-slate-400 font-normal text-[10px]">({buyer.reviewsCount || 40}+)</span>
                    </div>

                    {buyer.verificationDetails?.tier && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-600" />
                        {buyer.verificationDetails.tier}
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Procuring Crop:</span>
                      <strong className="text-slate-900 font-bold">{buyer.crop} ({buyer.variety})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Required Quantity:</span>
                      <strong className="text-slate-900 font-bold">{buyer.demandQty} Quintals</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Offered Target Price:</span>
                      <strong className="text-emerald-700 font-black font-mono text-sm">
                        ₹{buyer.targetPrice} / Qtl
                      </strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5">
                      <span className="text-slate-500">Delivery Hub:</span>
                      <span className="text-slate-700 font-medium">{buyer.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment:</span>
                      <span className="text-emerald-800 font-bold text-[11px]">{buyer.paymentTerms}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedBuyerProfile(buyer)}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700 underline"
                  >
                    View Verified Profile & Reviews
                  </button>

                  <button
                    onClick={() => handleOpenReviewModal(buyer)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition shadow-sm"
                  >
                    Rate Buyer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SAMPLE 4-STEP TRANSACTION FLOW SIMULATOR */}
      {activeSubTab === 'workflow' && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl font-bold text-slate-900">
                Interactive Guaranteed Escrow Transaction Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Demonstrating the 4-step secure contract, escrow deposit, quality assay weighment, and direct farmer payout.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { num: 1, title: 'Listing & Offer', desc: 'Farmer lists lot, buyer places binding offer.', icon: FileText },
              { num: 2, title: 'Escrow Lock', desc: 'Buyer deposits 100% funds into secure escrow.', icon: Lock },
              { num: 3, title: 'Quality Assay', desc: 'Gate inward inspection & digital weighbridge slip.', icon: Truck },
              { num: 4, title: 'Instant DBT Payout', desc: 'Funds released directly to farmer account.', icon: Banknote },
            ].map(step => {
              const Icon = step.icon;
              const isDone = workflowStep > step.num;
              const isCurrent = workflowStep === step.num;
              return (
                <div 
                  key={step.num}
                  className={`rounded-xl p-4 border transition ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                      : isDone
                      ? 'bg-slate-50 border-slate-300 opacity-90'
                      : 'bg-white border-slate-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone 
                        ? 'bg-emerald-600 text-white' 
                        : isCurrent 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isDone ? '✓' : step.num}
                    </div>
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-700' : 'text-slate-400'}`} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[11px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Active Simulation Step {workflowStep} of 4
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {workflowStep === 1 && 'Step 1: Smart Contract Agreement & Price Negotiation'}
                  {workflowStep === 2 && 'Step 2: Buyer Deposit Secured in Bank Escrow'}
                  {workflowStep === 3 && 'Step 3: Mandi Gate Inward & Digital Weighbridge Pass'}
                  {workflowStep === 4 && 'Step 4: Immediate Direct Bank Transfer (DBT) Settlement'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {workflowStep === 4 && (
                  <button
                    onClick={() => handleOpenReviewModal(buyers[0])}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>Rate This Buyer</span>
                  </button>
                )}

                <button
                  onClick={nextWorkflowStep}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>{workflowStep === 4 ? 'Reset Simulation' : 'Advance Next Trade Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step Payload Simulation */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
              <div className="flex justify-between border-b border-slate-100 pb-2 font-sans font-bold">
                <span>Transaction ID: <span className="font-mono text-emerald-800">TXN-AGRI-99420</span></span>
                <span>Commodity: Tomato Grade A+ (100 Qtl)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-1">
                <div>
                  <span className="text-slate-400 block font-sans text-[11px]">Seller (Farmer):</span>
                  <strong>Rameshwar Patil (Nashik)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[11px]">Buyer (Procurement):</span>
                  <strong>BigBasket Fresh Farm Sourcing</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-1">
                <div>
                  <span className="text-slate-400 block font-sans text-[11px]">Agreed Deal Rate:</span>
                  <strong className="text-emerald-700">₹2,750 / Quintal</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[11px]">Total Contract Value:</span>
                  <strong className="text-emerald-700">₹2,75,000 INR</strong>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs font-sans">
                <span className="text-slate-500">Live Escrow State:</span>
                <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  {simulatedTradeStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VERIFIED BUYER PROFILE & REVIEWS */}
      {selectedBuyerProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 relative my-8">
            <button
              onClick={() => setSelectedBuyerProfile(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4 mb-5 border-b border-slate-100 pb-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{selectedBuyerProfile.company}</h2>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedBuyerProfile.category} • {selectedBuyerProfile.location}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 text-xs font-bold text-amber-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{selectedBuyerProfile.rating} / 5.0</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Based on <strong>{selectedBuyerProfile.reviewsCount || 45}</strong> verified farmer transactions
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Credentials Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Audited Government & Institutional Credentials</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">FSSAI Food License</span>
                  <strong className="font-mono text-slate-800">{selectedBuyerProfile.verificationDetails?.fssaiNumber || '11521019000214'}</strong>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">✓ Active & Audited</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">GSTIN Registration</span>
                  <strong className="font-mono text-slate-800">{selectedBuyerProfile.verificationDetails?.gstinNumber || '27AAACB2154P1Z3'}</strong>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">✓ Regular Taxpayer</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Escrow On-Time Rate</span>
                  <strong className="text-emerald-700 font-mono text-sm">{selectedBuyerProfile.escrowSuccessRatePct || 99.8}%</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Zero payment default</span>
                </div>
              </div>
            </div>

            {/* Farmer Reviews Section */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  Recent Farmer Reviews & Weighment Feedback
                </h4>
                <button
                  onClick={() => handleOpenReviewModal(selectedBuyerProfile)}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  + Write a Review
                </button>
              </div>

              {selectedBuyerProfile.reviews && selectedBuyerProfile.reviews.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedBuyerProfile.reviews.map(rev => (
                    <div key={rev.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <strong className="text-slate-900">{rev.farmerName}</strong>
                          <span className="text-slate-500 text-[11px] ml-2">({rev.farmerLocation})</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-slate-700 text-xs mb-2 italic">"{rev.comment}"</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 border-t border-slate-200 pt-1.5">
                        <span>Traded: <strong>{rev.quantityQtl} Qtl {rev.tradeCrop}</strong></span>
                        <span>Payment Speed: <strong className="text-emerald-700">{rev.paymentPunctualityRating}/5</strong></span>
                        <span>Weighment Accuracy: <strong className="text-emerald-700">{rev.weighmentFairnessRating}/5</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-lg">
                  No public reviews posted yet for this buyer. Be the first farmer to review!
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBuyerProfile(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
              >
                Close Profile
              </button>
              <button
                onClick={() => {
                  setSelectedBuyerProfile(null);
                  handleOpenReviewModal(selectedBuyerProfile);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
              >
                Post Review for this Buyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: WRITE A FARMER REVIEW FOR COMPLETED TRANSACTION */}
      {reviewBuyerTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
            <button
              onClick={() => setReviewBuyerTarget(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!reviewSuccessMessage ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Rate & Review {reviewBuyerTarget.company}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your rating helps fellow farmers identify transparent buyers with fast payment settlements.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Overall Rating (1 to 5 Stars)</label>
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} out of 5</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Payment Speed</label>
                    <select
                      value={reviewPaymentScore}
                      onChange={(e) => setReviewPaymentScore(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    >
                      <option value={5}>5 - Within 24h DBT</option>
                      <option value={4}>4 - Within 48h</option>
                      <option value={3}>3 - Within 3-5 days</option>
                      <option value={2}>2 - Delayed payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Weighment Fairness</label>
                    <select
                      value={reviewWeighmentScore}
                      onChange={(e) => setReviewWeighmentScore(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    >
                      <option value={5}>5 - Exact Digital Scale</option>
                      <option value={4}>4 - Minor standard tare</option>
                      <option value={3}>3 - Acceptable</option>
                      <option value={2}>2 - High deduction</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewFarmerName}
                      onChange={(e) => setReviewFarmerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Mandi / Location</label>
                    <input
                      type="text"
                      value={reviewFarmerLocation}
                      onChange={(e) => setReviewFarmerLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Review Feedback</label>
                  <textarea
                    rows={3}
                    placeholder="Describe weighment accuracy, gate inward speed, moisture testing, or payment punctuality..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBuyerTarget(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition shadow-sm"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Review Published!</h3>
                <p className="text-xs text-slate-600">{reviewSuccessMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: BUYER VERIFICATION HUB */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!verifSuccess ? (
              <form onSubmit={handleVerifyBuyer} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-lg font-bold text-slate-900">Institutional Buyer Verification</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Verify statutory trade licenses to receive the Enterprise Gold badge and instant farmer trust.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">FSSAI Central Food Safety License</label>
                  <input
                    type="text"
                    value={verifFssai}
                    onChange={(e) => setVerifFssai(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs text-slate-900"
                    placeholder="14-digit FSSAI number"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Enterprise Tax Identification</label>
                  <input
                    type="text"
                    value={verifGstin}
                    onChange={(e) => setVerifGstin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs text-slate-900"
                    placeholder="15-character GSTIN"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">APEDA RCMC / Exporter ID (Optional)</label>
                  <input
                    type="text"
                    value={verifApeda}
                    onChange={(e) => setVerifApeda(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs text-slate-900"
                    placeholder="e.g. APEDA/EXP/2026/0912"
                  />
                </div>

                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-emerald-900 text-xs">
                  <strong>Automated Escrow Bank Guarantee:</strong> Requires linking a scheduled commercial bank credit line for 100% escrow pre-funding.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition shadow-sm"
                  >
                    Verify Credentials
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Credentials Successfully Verified!</h3>
                <p className="text-xs text-slate-600">
                  FSSAI & GSTIN verified against government registries. Enterprise Gold badge assigned.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW CROP LISTING WITH CERTIFICATIONS */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative my-6">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <PlusCircle className="w-6 h-6 text-emerald-700" />
              <h3 className="text-lg font-bold text-slate-900">List Crop Harvest on Marketplace</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Your lot will immediately be broadcasted to verified supermarkets, aggregators, and exporters.
            </p>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Type</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Onion">Onion</option>
                    <option value="Potato">Potato</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Basmati Rice">Basmati Rice</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Mustard">Mustard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Variety / Grade</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quality Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e: any) => setNewGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Export Grade">Export Grade (Premium)</option>
                    <option value="Grade A+">Grade A+ (Superior)</option>
                    <option value="Grade A">Grade A (Standard)</option>
                    <option value="Grade B">Grade B (Fair Average)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Storage Condition</label>
                  <select
                    value={newStorageType}
                    onChange={(e: any) => setNewStorageType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="On Farm (Ambient)">On Farm (Ambient)</option>
                    <option value="Cold Storage">Cold Storage Facility</option>
                    <option value="Packhouse">Graded Packhouse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Asking Rate (₹/Qtl)</label>
                  <input
                    type="number"
                    min="100"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Certifications Checkboxes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Accredited Certifications</label>
                <div className="grid grid-cols-2 gap-2">
                  {['India Organic / NPOP', 'GlobalGAP', 'FSSAI Compliant', 'Jaivik Bharat'].map((cert) => (
                    <label key={cert} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={selectedCerts.includes(cert)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCerts([...selectedCerts, cert]);
                          else setSelectedCerts(selectedCerts.filter(c => c !== cert));
                        }}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-[11px] font-medium text-slate-800">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Farmer Name</label>
                  <input
                    type="text"
                    value={newFarmerName}
                    onChange={(e) => setNewFarmerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newFarmerPhone}
                    onChange={(e) => setNewFarmerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Farm / Packhouse Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition shadow-sm"
                >
                  Broadcast Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PLACE BUYER OFFER */}
      {selectedListingForOffer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedListingForOffer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!offerSuccess ? (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Place Offer for {selectedListingForOffer.crop}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Listed by {selectedListingForOffer.farmerName} ({selectedListingForOffer.location})
                </p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lot Quantity:</span>
                    <strong className="text-slate-800">{selectedListingForOffer.quantityQtl} Qtl</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Farmer Asking Rate:</span>
                    <strong className="text-slate-800">₹{selectedListingForOffer.expectedPrice} / Qtl</strong>
                  </div>
                  {selectedListingForOffer.qualityGrade && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Grade:</span>
                      <strong className="text-emerald-800">{selectedListingForOffer.qualityGrade}</strong>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Offered Price (₹/Quintal)</label>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-900 border border-emerald-200">
                    Total Offer Consideration: <strong className="font-mono">₹{(offerPrice * selectedListingForOffer.quantityQtl).toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedListingForOffer(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitOffer}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition shadow-sm"
                  >
                    Submit Offer to Farmer
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Offer Transmitted!</h3>
                <p className="text-xs text-slate-600 mb-5">
                  Your bid of ₹{offerPrice}/Qtl has been delivered via SMS notification to {selectedListingForOffer.farmerName}.
                </p>
                <button
                  onClick={() => setSelectedListingForOffer(null)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
