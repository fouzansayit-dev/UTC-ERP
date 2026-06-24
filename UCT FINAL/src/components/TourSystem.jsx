import React, { useState, useEffect, useRef } from 'react';

export default function TourSystem({ steps = [], active, onClose, moduleKey }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState(null);
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const cardRef = useRef(null);

  // Track window resizing to recalculate highlighted element coordinates
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const step = steps[currentStep];

  // Recalculate coordinates for current highlighted element
  useEffect(() => {
    if (!active || !step) return;

    // Reset coordinates first
    setCoords(null);

    const timer = setTimeout(() => {
      if (step.selector) {
        const el = document.querySelector(step.selector);
        if (el) {
          // Scroll element into view smoothly if not fully visible
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          
          // Wait a brief moment for scroll animation to complete, then get coordinates
          setTimeout(() => {
            const rect = el.getBoundingClientRect();
            // Add custom padding around the highlighted cutout
            const pad = step.padding !== undefined ? step.padding : 6;
            setCoords({
              left: rect.left - pad,
              top: rect.top - pad,
              width: rect.width + (pad * 2),
              height: rect.height + (pad * 2),
              right: rect.right + pad,
              bottom: rect.bottom + pad
            });
          }, 300);
        } else {
          // Fallback to center-screen modal if selector not found
          setCoords(null);
        }
      } else {
        setCoords(null);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStep, step, active, windowSize]);

  if (!active || steps.length === 0 || !step) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    // Mark this module's tour as completed in localStorage
    if (moduleKey) {
      localStorage.setItem(`uct_tour_completed_${moduleKey}`, 'true');
    }
    onClose();
  };

  // Overlay cutout calculation
  const getOverlayPath = () => {
    const { w, h } = windowSize;
    if (!coords) {
      // Just full screen dimming overlay if no element is selected
      return `M 0 0 h ${w} v ${h} h -${w} Z`;
    }
    const { left, top, width, height } = coords;
    // Draw outer rect clockwise, then inner rect (cutout) counter-clockwise for the mask
    return `M 0 0 h ${w} v ${h} h -${w} Z M ${left} ${top} v ${height} h ${width} v -${height} Z`;
  };

  // Determine tooltip popover positioning
  const getCardStyle = () => {
    const base = {
      position: 'fixed',
      width: '320px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(13, 94, 244, 0.05)',
      padding: '18px',
      zIndex: 1000001,
      transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    };

    if (!coords) {
      // Center of screen
      return {
        ...base,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const { left, top, width, height, right, bottom } = coords;
    const cardW = 320;
    const pad = 12; // distance from element

    // Auto position based on element position and viewport bounds
    let pos = step.position || 'bottom';
    
    if (pos === 'bottom') {
      if (bottom + cardW > windowSize.h && top > cardW) {
        pos = 'top';
      }
    } else if (pos === 'top') {
      if (top - cardW < 0 && bottom + cardW < windowSize.h) {
        pos = 'bottom';
      }
    }

    switch (pos) {
      case 'top':
        return {
          ...base,
          left: Math.max(pad, Math.min(windowSize.w - cardW - pad, left + (width / 2) - (cardW / 2))),
          top: top - 170 - pad, // approximate height + pad
        };
      case 'left':
        return {
          ...base,
          left: left - cardW - pad,
          top: Math.max(pad, Math.min(windowSize.h - 180, top + (height / 2) - 80)),
        };
      case 'right':
        return {
          ...base,
          left: right + pad,
          top: Math.max(pad, Math.min(windowSize.h - 180, top + (height / 2) - 80)),
        };
      case 'bottom':
      default:
        return {
          ...base,
          left: Math.max(pad, Math.min(windowSize.w - cardW - pad, left + (width / 2) - (cardW / 2))),
          top: bottom + pad,
        };
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000000, pointerEvents: 'auto' }}>
      {/* SVG dimming mask */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
          transition: 'all 0.3s ease'
        }}
        onClick={handleClose}
      >
        <path
          d={getOverlayPath()}
          fill="rgba(15, 23, 42, 0.75)"
          fillRule="evenodd"
          style={{ transition: 'd 0.25s ease' }}
        />
      </svg>

      {/* Highlight ring for target element */}
      {coords && (
        <div
          style={{
            position: 'fixed',
            left: coords.left,
            top: coords.top,
            width: coords.width,
            height: coords.height,
            borderRadius: '6px',
            border: '2px dashed #0d5ef4',
            boxShadow: '0 0 15px rgba(13, 94, 244, 0.4), inset 0 0 8px rgba(13, 94, 244, 0.2)',
            zIndex: 1000001,
            pointerEvents: 'none',
            animation: 'pulseGlow 2s infinite ease-in-out'
          }}
        />
      )}

      {/* Tour Card Popover */}
      <div ref={cardRef} style={getCardStyle()}>
        {/* Progress header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0d5ef4', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {step.moduleName || 'Guide Tour'} · Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0 4px',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
          {step.title}
        </h4>
        <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5', margin: '0 0 18px 0', fontWeight: 500 }}>
          {step.content}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '12px',
              color: '#64748b',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            Skip Tour
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                background: '#0d5ef4',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(13, 94, 244, 0.2)'
              }}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(13, 94, 244, 0.3); }
          50% { box-shadow: 0 0 20px rgba(13, 94, 244, 0.6); }
          100% { box-shadow: 0 0 10px rgba(13, 94, 244, 0.3); }
        }
      `}} />
    </div>
  );
}
