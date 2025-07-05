"use client";

import React, { useEffect, useState } from "react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/offers");
        if (!res.ok) {
          throw new Error("Failed to fetch offers");
        }
        const data = await res.json();
        setOffers(data || []);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          🎁 Special Offers and Discounts
        </h1>
        <p className="text-gray-600">
          Check out our latest movie ticket offers!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-pulse">Loading exciting offers...</div>
          </div>
        ) : offers.length > 0 ? (
          offers.map((offer: any) => (
            <div
              key={offer._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                <p className="text-white text-center font-bold text-xl">
                  {offer.discountPercent}% OFF
                </p>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{offer.title}</h2>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                {offer.couponCode && (
                  <div className="bg-gray-100 p-3 rounded-md text-center">
                    <p className="text-sm text-gray-500 mb-1">Use Code:</p>
                    <p className="font-mono font-bold text-lg text-blue-600">
                      {offer.couponCode}
                    </p>
                  </div>
                )}
                <p className="text-gray-400 text-sm mt-4">
                  Valid until:{" "}
                  {new Date(offer.validTo).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            No offers available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
