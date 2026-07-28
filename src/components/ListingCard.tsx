import React from 'react';
import { MapPin, User, ArrowLeftRight, CheckCircle2, Trash2 } from 'lucide-react';
import { Listing, User as UserType } from '../types';

interface ListingCardProps {
  key?: string;
  listing: Listing;
  currentUser: UserType | null;
  onInitiateSwap: (listing: Listing, customSystemMessage?: string) => void;
  onMarkCompleted?: (listingId: string) => void;
  onViewDetails?: (listing: Listing) => void;
  onDelete?: (listingId: string) => void;
  onViewProfile?: (userId: string, userName?: string, userAvatar?: string) => void;
}

export default function ListingCard({
  listing,
  currentUser,
  onInitiateSwap,
  onMarkCompleted,
  onViewDetails,
  onDelete,
  onViewProfile,
}: ListingCardProps) {
  const isOwner = currentUser?.id === listing.ownerId;
  const isCompleted = listing.status === 'مكتمل';

  return (
    <div 
      id={`listing_card_${listing.id}`} 
      onClick={() => onViewDetails?.(listing)}
      className={`bg-white rounded-[20px] sm:rounded-[24px] border border-gray-100/90 transition-all duration-300 overflow-hidden cursor-pointer group hover:shadow-xl hover:shadow-gray-200/50 hover:border-brand-300 ${
        isCompleted 
          ? 'opacity-60 border-gray-100 grayscale' 
          : 'border-gray-100'
      }`}
    >
      {/* MOBILE VIEW (< sm): Horizontal row card with Image on the far left */}
      <div className="flex sm:hidden p-3 items-stretch justify-between gap-3 relative">
        {/* Right side: Details & Info (Title, Wanted Item, Owner + Location) */}
        <div className="flex-1 flex flex-col justify-between text-right min-w-0 py-0.5">
          {/* Top: Title & Wanted Item */}
          <div className="space-y-1.5">
            {/* Title */}
            <h3 className="font-black text-gray-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-brand-700 transition-colors">
              {listing.title}
            </h3>

            {/* Wanted in Return */}
            <div className="flex items-center space-x-1 space-x-reverse text-emerald-800 font-extrabold text-[11px] bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100/60 w-fit max-w-full">
              <ArrowLeftRight className="w-3 h-3 text-emerald-700 shrink-0" />
              <span className="line-clamp-1">{listing.wantedInReturn}</span>
            </div>

            {/* Cash Diff tag if any */}
            {listing.cashDifference ? (
              <span className="inline-block text-[9px] font-black text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                + {listing.cashDifference} ﷼ فرق كاش
              </span>
            ) : null}
          </div>

          {/* Bottom: Owner Name & City parallel with image bottom */}
          <div className="pt-2 border-t border-gray-100/80 flex items-center justify-between text-[10px] text-gray-600 font-semibold gap-2">
            {/* Owner Name */}
            <div 
              className="flex items-center space-x-1 space-x-reverse truncate min-w-0 hover:text-brand-700"
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile?.(listing.ownerId, listing.ownerName, listing.ownerAvatar);
              }}
            >
              <User className="w-3 h-3 text-brand-600 shrink-0" />
              <span className="truncate font-extrabold text-gray-800">{listing.ownerName}</span>
            </div>

            {/* City */}
            <div className="flex items-center space-x-0.5 space-x-reverse text-gray-500 shrink-0">
              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
              <span>{listing.city}</span>
            </div>
          </div>
        </div>

        {/* Left side: Image Box on the far left */}
        <div className="w-28 h-28 bg-gray-100 rounded-2xl overflow-hidden relative shrink-0 border border-gray-100/80 shadow-2xs">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-108"
            referrerPolicy="no-referrer"
          />

          {/* Delete button for owner */}
          {isOwner && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(listing.id);
              }}
              className="absolute top-1 left-1 p-1 bg-white/95 hover:bg-red-50 text-red-500 rounded-lg shadow-xs border border-gray-100 transition-all cursor-pointer z-20"
              title="حذف العرض"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {/* Completed overlay */}
          {isCompleted && (
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-1 text-center">
              <span className="bg-white text-gray-900 px-1.5 py-0.5 rounded-lg font-black text-[9px] shadow-md flex items-center space-x-1 space-x-reverse">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>تمت المقايضة</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP VIEW (>= sm): Classic vertical grid card */}
      <div className="hidden sm:flex sm:flex-col justify-between h-full">
        {/* Top Image Container */}
        <div 
          className="w-full h-56 bg-gray-100 overflow-hidden relative border-b border-gray-100/60 shrink-0" 
          id={`listing_img_container_desktop_${listing.id}`}
        >
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-108"
            referrerPolicy="no-referrer"
          />

          {/* Delete button for owner */}
          {isOwner && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(listing.id);
              }}
              className="absolute top-2 left-2 p-2 bg-white/95 hover:bg-red-50 text-red-500 rounded-xl shadow-xs border border-gray-100 transition-all duration-150 cursor-pointer z-20"
              title="حذف العرض"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Completed status overlay */}
          {isCompleted && (
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-2 text-center">
              <span className="bg-white text-gray-900 px-3 py-1.5 rounded-xl font-black text-xs shadow-md flex items-center space-x-1.5 space-x-reverse">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تمت المقايضة</span>
              </span>
            </div>
          )}
        </div>

        {/* Advertiser Name & City Directly Under the Photo */}
        <div className="bg-gray-50/90 px-4 py-2 border-b border-gray-100/80 flex items-center justify-between text-xs text-gray-700">
          <div 
            className="flex items-center space-x-1 space-x-reverse truncate min-w-0 cursor-pointer group/owner hover:text-brand-700"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile?.(listing.ownerId, listing.ownerName, listing.ownerAvatar);
            }}
            title={`عرض الملف الشخصي لـ ${listing.ownerName}`}
          >
            <span className="truncate text-gray-800 font-extrabold group-hover/owner:text-brand-700 group-hover/owner:underline decoration-brand-400 underline-offset-2 transition-all">{listing.ownerName}</span>
          </div>

          <div className="flex items-center space-x-1 space-x-reverse text-gray-500 text-xs font-semibold shrink-0">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{listing.city}، السعودية</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col justify-between flex-1 text-right min-w-0">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-1 group-hover:text-brand-700 transition-colors">
              {listing.title}
            </h3>

            <div className="flex items-center justify-center my-2" id={`swap_symbol_${listing.id}`}>
              <div className="h-px bg-gray-100 flex-1" />
              <div className="mx-2 w-7 h-7 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#85532a] shrink-0 shadow-xs">
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </div>
              <div className="h-px bg-gray-100 flex-1" />
            </div>

            <div>
              <span className="line-clamp-1 text-sm text-emerald-800 font-extrabold">{listing.wantedInReturn}</span>
            </div>
          </div>

          {listing.cashDifference ? (
            <div className="pt-2 mt-2 border-t border-dashed border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[10px]">فارق كاش إضافي:</span>
              <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                + {listing.cashDifference} ﷼
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}


