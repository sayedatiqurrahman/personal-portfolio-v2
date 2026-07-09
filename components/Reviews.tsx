"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/types";

function pickRandomReviews(reviews: Review[], limit = 5) {
  if (reviews.length <= limit) return [...reviews];

  const shuffled = [...reviews].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export default function Reviews({ reviews }: { reviews: Review[] }) {
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!reviews.length) {
      setVisibleReviews([]);
      setActiveIndex(0);
      return;
    }

    setVisibleReviews(pickRandomReviews(reviews));
    setActiveIndex(0);
  }, [reviews]);

  if (!reviews.length || !visibleReviews.length) return null;

  const currentReview = visibleReviews[activeIndex];

  if (!currentReview) return null;

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="reviews">
      <h2 className="font-headline-md text-headline-md text-primary mb-8">
        cat client_reviews.log
      </h2>

      <div className="terminal-border p-6 bg-surface-container-low">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {currentReview.clientName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="text-on-surface font-bold">{currentReview.clientName}</p>
            {currentReview.company && <p className="text-on-surface-variant text-sm">{currentReview.company}</p>}
          </div>
          <div className="ml-auto flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`material-symbols-outlined text-sm ${i < currentReview.rating ? "text-primary" : "text-outline-variant"}`}
              >
                star
              </span>
            ))}
          </div>
        </div>

        <p className="text-on-surface-variant italic">&ldquo;{currentReview.text}&rdquo;</p>
        {currentReview.date && <p className="text-on-surface-variant text-xs font-code-sm mt-3">{currentReview.date}</p>}

        {visibleReviews.length > 1 && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {visibleReviews.map((review, index) => (
                <button
                  key={review.id}
                  type="button"
                  aria-label={`Go to review ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-6 bg-primary" : "w-2.5 bg-outline-variant"}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev - 1 + visibleReviews.length) % visibleReviews.length)}
                className="rounded-full border border-outline-variant px-3 py-2 text-sm text-on-surface-variant hover:text-primary"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % visibleReviews.length)}
                className="rounded-full border border-outline-variant px-3 py-2 text-sm text-on-surface-variant hover:text-primary"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
