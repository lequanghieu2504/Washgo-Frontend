import React, { useRef, useState, useEffect } from "react";

const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 56;

const BottomSheet = ({ onClose, children }) => {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const startPosition = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Calculate heights once
  const vh = window.innerHeight;
  const availableHeight = vh - FOOTER_HEIGHT;
  const collapsedHeight = Math.round(availableHeight / 3);
  const expandedHeight = availableHeight - HEADER_HEIGHT;
  const initialPosition = expandedHeight - collapsedHeight;

  const [position, setPosition] = useState(initialPosition);

  // Drag handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    startY.current = e.clientY || e.touches?.[0]?.clientY;
    startPosition.current = position;
    if (e.target.setPointerCapture && e.pointerId) {
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const currentY = e.clientY || e.touches?.[0]?.clientY;
    const deltaY = currentY - startY.current;
    const newPosition = Math.max(0, startPosition.current + deltaY);

    setPosition(newPosition);
  };

  const handlePointerUp = () => {
    setIsDragging(false);

    const closeThreshold = initialPosition * 1.5;
    const expandThreshold = initialPosition / 2;

    if (position > closeThreshold) {
      // Close animation
      setIsClosing(true);
      setPosition(availableHeight);
      setTimeout(() => {
        setIsClosing(false);
        onClose?.();
      }, 300);
    } else if (position < expandThreshold) {
      setPosition(0); // Fully expanded
    } else {
      setPosition(initialPosition); // Collapsed
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setPosition(availableHeight);
    setTimeout(() => {
      setIsClosing(false);
      onClose?.();
    }, 300);
  };

  // Prevent background scroll when expanded
  useEffect(() => {
    document.body.style.overflow = position === 0 ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [position]);

  const transitionClass =
    !isDragging || isClosing ? "transition-all duration-300 ease-out" : "";
  const sheetHeight = Math.max(0, expandedHeight - position);

  return (
    <div
      ref={sheetRef}
      className={`fixed left-0 right-0 bg-white shadow-lg rounded-t-2xl z-50 ${transitionClass}`}
      style={{
        bottom: FOOTER_HEIGHT,
        height: `${sheetHeight}px`,
        maxHeight: `${expandedHeight}px`,
        touchAction: "none",
      }}
    >
      {/* Drag Handle and Close Button */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full py-3 flex justify-center items-center cursor-pointer select-none relative border-b border-gray-100"
        style={{ touchAction: "none" }}
      >
        <div className="w-10 h-1.5 bg-gray-400 rounded-full" />
        <button
          className="absolute right-4 top-1 text-gray-400 hover:text-gray-700"
          onClick={handleClose}
          aria-label="Close"
        >
          <svg
            width={24}
            height={24}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto flex-1"
        style={{ height: "calc(100% - 48px)" }}
      >
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
