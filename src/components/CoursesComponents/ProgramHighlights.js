"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const ProgramHighlights = () => {
  // Mobile view states (simplified - no animation)
  const [hoveredCard, setHoveredCard] = useState(null);

  // Desktop view states
  const [animatedCards, setAnimatedCards] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Refs for intersection observer and animation control
  const componentRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const rafRef = useRef(null);

  const cardData = [
    {
      id: 1,
      title: "25+ Assignments",
      subtitle:
        "ConnectingDotsERP has tied up with 2000+ Companies to provide Jobs to Many Students.",
      img: "https://res.cloudinary.com/dudu879kr/image/upload/v1754313384/assingments-proghigh_aw4yku.webp",
      iconBg: "bg-indigo-500",
      accentColor: "border-indigo-500",
      description: "Work on 25+ Assignments",
    },
    {
      id: 2,
      title: "Tied-up with 2000+ Companies",
      subtitle: "Sophisticated matte finish with elegant applications",
      img: "https://res.cloudinary.com/dudu879kr/image/upload/v1754376143/Services_qaamnb.webp",
      iconBg: "bg-indigo-500",
      accentColor: "border-indigo-500",
      description:
        "ConnectingDotsERP has tied up with 2000+ Companies to provide Jobs to Many Students.",
    },
    {
      id: 3,
      title: "Experience Alteration System",
      subtitle: "A dedicated placement for those who completed the course.",
      img: "https://res.cloudinary.com/dudu879kr/image/upload/v1754377173/Expertguidance_w6beel.webp",
      iconBg: "bg-indigo-500",
      accentColor: "border-indigo-500",
      description: "A dedicated placement for those who completed the course.",
    },
    {
      id: 4,
      title: "Job Readiness Program",
      subtitle: "A dedicated placement for those who completed the course.",
      img: "https://res.cloudinary.com/dudu879kr/image/upload/v1754387689/imgi_126_pngtree-career-counseling-and-job-placement-platform-with-3d-icon-isolated-on-png-image_20374379_ncqv3k.webp",
      iconBg: "bg-indigo-500",
      accentColor: "border-indigo-500",
      description: "A dedicated placement for those who completed the course.",
    },
  ];

  // Desktop animation function with proper timing controls
  const startAnimation = () => {
    // Clear any existing animation timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Only start animation if component is fully mounted and ready
    if (!isMounted || !isReady) return;

    // Use requestAnimationFrame to ensure smooth animation start
    rafRef.current = requestAnimationFrame(() => {
      // Reset animation state
      setAnimatedCards([]);
      setShowLogo(false);

      // Animate cards with proper timing
      cardData.forEach((_, index) => {
        setTimeout(
          () => {
            setAnimatedCards((prev) => [...prev, index]);
          },
          (index + 1) * 600
        );
      });

      // Show logo after all cards have animated out (with extra delay)
      setTimeout(
        () => {
          setShowLogo(true);
        },
        cardData.length * 1100 + 800
      );
    });
  };

  // Debounced animation trigger to prevent multiple rapid calls
  const triggerAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      startAnimation();
    }, 100); // Small delay to ensure DOM stability
  };

  // Component mounting and readiness effect
  useEffect(() => {
    // Set mounted state
    setIsMounted(true);

    // Use requestAnimationFrame to ensure DOM is fully rendered
    const readyTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        setIsReady(true);
      });
    }, 50); // Small delay to ensure layout stability

    return () => {
      clearTimeout(readyTimeout);
      setIsMounted(false);
      setIsReady(false);
    };
  }, []);

  // Intersection Observer for desktop animation trigger
  useEffect(() => {
    if (!isMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isReady) {
            // Reset and trigger animation when component enters viewport
            setAnimatedCards([]);
            setShowLogo(false);
            setAnimationKey((prev) => prev + 1);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
        rootMargin: "0px 0px -50px 0px", // Adjust this to fine-tune when animation triggers
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
      // Clean up animation references
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isMounted, isReady]);

  // Start animation when animationKey changes and component is ready
  useEffect(() => {
    if (animationKey > 0 && isReady) {
      triggerAnimation();
    }
  }, [animationKey, isReady]);

  return (
    <div ref={componentRef}>
      {/* Mobile View - No animations */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-widest mb-4 bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
              PROGRAM HIGHLIGHTS
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60"></div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="relative w-80 h-60 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl shadow-2xl border border-gray-500 overflow-hidden">
                <div className="absolute bottom-4 left-4 right-4 top-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-inner border border-gray-700 overflow-hidden">
                  <div className="relative w-full h-full p-3 flex items-end justify-center gap-1.5">
                    {cardData.map((card, index) => (
                      <div
                        key={card.id}
                        className="relative cursor-pointer transition-all duration-300 ease-out opacity-100 translate-y-0 transform"
                        style={{
                          zIndex: 4 - index,
                        }}
                        onMouseEnter={() => setHoveredCard(card.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div
                          className="absolute bg-gradient-to-b from-gray-700 to-gray-800 rounded-r-lg"
                          style={{
                            width: "4px",
                            height: "150px",
                            right: "-4px",
                            top: "3px",
                            transform: "skewY(-2deg)",
                            zIndex: -1,
                          }}
                        />
                        <div
                          className={`w-16 h-36 rounded-lg ${card.bgGradient} relative overflow-hidden shadow-lg`}
                          style={{
                            transform:
                              hoveredCard === card.id
                                ? "translateY(-6px) scale(1.02)"
                                : "translateY(0px) scale(1)",
                            boxShadow:
                              hoveredCard === card.id
                                ? "0 12px 25px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.2)"
                                : "0 6px 15px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255, 255, 255, 0.2)",
                          }}
                        >
                          <div className="h-full flex flex-col p-2">
                            <div className="flex justify-end mb-1">
                              <div className="w-5 h-5 bg-black/30 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-center mb-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                                {card.img ? (
                                  <Image
                                    src={card.img}
                                    alt={card.title}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <span className="text-lg text-white">
                                    {card.icon}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center px-1">
                              <h3 className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold text-white text-center leading-tight break-words">
                                {card.title.length > 20
                                  ? card.title.substring(0, 18) + "..."
                                  : card.title}
                              </h3>
                            </div>
                          </div>
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              background: `repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 1px,
                                rgba(255,255,255,0.1) 1px,
                                rgba(255,255,255,0.1) 2px
                              )`,
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-gray-800/50 to-transparent rounded-b-2xl"></div>
              </div>
              <div className="absolute -bottom-2 left-1 right-1 h-3 bg-black/20 rounded-2xl blur-sm"></div>
            </div>
          </div>

          <div className="space-y-4">
            {cardData.map((card, index) => (
              <div
                key={card.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-600 shadow-lg relative overflow-hidden opacity-100 translate-y-0"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`}
                />
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-3 shadow-md overflow-hidden bg-white/10`}
                >
                  {card.img ? (
                    <Image
                      src={card.img}
                      alt={card.title}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white">{card.icon}</span>
                  )}
                </div>
                <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold mb-1 text-white leading-tight truncate">
                  {card.title}
                </h3>
                <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-400 mb-2 font-light truncate">
                  {card.material || "Material"}
                </p>
                <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed mb-3 line-clamp-2">
                  {card.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View - With scroll-triggered animations */}
      <div className="hidden lg:flex min-h-screen bg-slate-900 items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="w-full max-w-7xl flex flex-col items-center justify-center gap-10 lg:gap-20">
          {/* Desktop Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light tracking-widest mb-4 bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
              PROGRAM HIGHLIGHTS
            </h1>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60"></div>
          </div>

          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
            {/* Card Rack/Container with Logo */}
            <div className="w-full lg:w-auto flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-80 h-80 sm:h-96 md:h-[450px] lg:h-[500px] bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 rounded-2xl shadow-2xl overflow-hidden relative">
                {/* Rack Cards */}
                <div className="pt-8 pb-6 px-4 sm:px-6 h-full flex flex-col gap-3 items-center justify-center">
                  {cardData.map((card, index) => (
                    <div
                      key={`rack-card-${card.id}-${animationKey}`}
                      className={`w-full max-w-xs sm:w-64 h-16 sm:h-20 bg-gradient-to-r from-slate-600 to-slate-700 border border-slate-500 border-l-4 ${card.accentColor} rounded-xl flex items-center gap-4 p-4 shadow-lg transition-all duration-700 ease-in-out ${
                        animatedCards.includes(index)
                          ? "transform translate-x-96 opacity-0"
                          : "transform translate-x-0 opacity-100"
                      }`}
                      style={{
                        animationDelay: `${(index + 1) * 0.6}s`,
                        transitionDelay: `${(index + 1) * 0.6}s`,
                      }}
                    >
                      <div
                        className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center text-xl shadow-md flex-shrink-0 overflow-hidden`}
                      >
                        {card.img ? (
                          <Image
                            src={card.img}
                            alt={card.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span>{card.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm font-bold leading-tight mb-1 truncate">
                          {card.title}
                        </h3>
                        <p className="text-slate-400 text-xs truncate">
                          {card.material}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logo Container - Appears after all cards animate out */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
                    showLogo ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-[350px] h-[180px] rounded-2xl shadow-xl flex items-center justify-center p-4">
                      <Image
                        src="/Navbar/Connecting Logo New.png"
                        alt="Logo"
                        width={320}
                        height={160}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Cards Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cardData.map((card, index) => (
                <div
                  key={`display-card-${card.id}-${animationKey}`}
                  className={`w-full h-72 bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 border-t-4 ${card.accentColor} rounded-2xl p-6 shadow-2xl transition-all duration-700 ease-in-out transform ${
                    animatedCards.includes(index)
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-8 scale-95"
                  } hover:scale-105 hover:shadow-3xl cursor-pointer relative`}
                  style={{
                    transitionDelay: `${(index + 1) * 0.6}s`,
                  }}
                >
                  <div
                    className={`w-16 h-16 ${card.iconBg} rounded-full flex items-center justify-center text-2xl shadow-lg mb-6 overflow-hidden`}
                  >
                    {card.img ? (
                      <Image
                        src={card.img}
                        alt={card.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{card.icon}</span>
                    )}
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm font-semibold mb-4">
                    {card.material}
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramHighlights;
  