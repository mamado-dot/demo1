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
      className={`bg-white rounded-[20px] sm:rounded-[24px] border transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-xl hover:shadow-gray-200/50 hover:border-brand-300 ${
        isCompleted 
          ? 'opacity-60 border-gray-100 grayscale' 
          : 'border-gray-100'
      }`}
    >
      {/* Top Image Container */}
      <div 
        className="w-full h-48 sm:h-56 bg-gray-100 overflow-hidden relative border-b border-gray-100/60 shrink-0" 
        id={`listing_img_container_${listing.id}`}
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
            className="absolute top-2 left-2 p-1.5 sm:p-2 bg-white/95 hover:bg-red-50 text-red-500 rounded-xl shadow-xs border border-gray-100 transition-all duration-150 cursor-pointer z-20"
            title="حذف العرض"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        {/* Completed status overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 text-center">
            <span className="bg-white text-gray-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl font-black text-[10px] sm:text-xs shadow-md flex items-center space-x-1 sm:space-x-1.5 space-x-reverse">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              <span>تمت المقايضة</span>
            </span>
          </div>
        )}
      </div>

      {/* Advertiser Name & City Directly Under the Photo */}
      <div className="bg-gray-50/90 px-3.5 sm:px-4 py-2 border-b border-gray-100/80 flex items-center justify-between text-xs text-gray-700">
        {/* Owner Name - Clickable to open Profile */}
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

        {/* Location / City */}
        <div className="flex items-center space-x-1 space-x-reverse text-gray-500 text-[11px] sm:text-xs font-semibold shrink-0">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>{listing.city}، السعودية</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1 text-right min-w-0">
        <div>
          {/* Offered Item Title */}
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-brand-700 transition-colors">
              {listing.title}
            </h3>
          </div>

          {/* Swap Symbol Between the Two Items */}
          <div className="flex items-center justify-center my-2" id={`swap_symbol_${listing.id}`}>
            <div className="h-px bg-gray-100 flex-1" />
            <div className="mx-2 w-7 h-7 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#85532a] shrink-0 shadow-xs">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </div>
            <div className="h-px bg-gray-100 flex-1" />
          </div>

          {/* Wanted in Return */}
          <div>
            <span className="line-clamp-1 text-xs sm:text-sm text-emerald-800 font-extrabold">{listing.wantedInReturn}</span>
          </div>
        </div>

        {/* Cash difference if any */}
        {listing.cashDifference ? (
          <div className="pt-2 mt-2 border-t border-dashed border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[10px]">فارق كاش إضافي:</span>
            <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              + {listing.cashDifference} ﷼
            </span>
          </div>
        ) : null}

      </div>

    </div>
  );
}

