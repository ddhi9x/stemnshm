import React, { useState, useRef, useCallback, useEffect } from 'react';

const AvatarCropper = ({ imageSrc, onCrop, onCancel }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const imgRef = useRef(new Image());

  const CIRCLE_SIZE = 220;
  const CANVAS_SIZE = 300;

  useEffect(() => {
    const img = imgRef.current;
    img.onload = () => {
      setImgSize({ w: img.width, h: img.height });
      // Fit image so shorter side fills the circle
      const fitScale = CIRCLE_SIZE / Math.min(img.width, img.height);
      setScale(fitScale);
      setPos({
        x: (CANVAS_SIZE - img.width * fitScale) / 2,
        y: (CANVAS_SIZE - img.height * fitScale) / 2,
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const handleMouseUp = () => setDragging(false);

  // Touch support
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    setDragging(true);
    setDragStart({ x: t.clientX - pos.x, y: t.clientY - pos.y });
  };
  const handleTouchMove = (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    setPos({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale(prev => Math.max(0.1, Math.min(5, prev + delta)));
  };

  const handleCrop = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    // Draw circle clip
    ctx.beginPath();
    ctx.arc(100, 100, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Calculate source position relative to the circle center
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const circleLeft = centerX - CIRCLE_SIZE / 2;
    const circleTop = centerY - CIRCLE_SIZE / 2;

    const drawX = (pos.x - circleLeft) * (200 / CIRCLE_SIZE);
    const drawY = (pos.y - circleTop) * (200 / CIRCLE_SIZE);
    const drawW = imgRef.current.width * scale * (200 / CIRCLE_SIZE);
    const drawH = imgRef.current.height * scale * (200 / CIRCLE_SIZE);

    ctx.drawImage(imgRef.current, drawX, drawY, drawW, drawH);

    const result = canvas.toDataURL('image/jpeg', 0.85);
    onCrop(result);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '2rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)', maxWidth: '400px', width: '90%',
      }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontWeight: 800 }}>Căn chỉnh ảnh đại diện</h3>
        <p style={{ margin: '0 0 1rem', color: '#64748b', fontSize: '0.85rem' }}>
          Kéo ảnh để chọn vùng hiển thị • Cuộn chuột để zoom
        </p>

        <div
          ref={containerRef}
          style={{
            width: CANVAS_SIZE, height: CANVAS_SIZE,
            margin: '0 auto', position: 'relative', overflow: 'hidden',
            cursor: dragging ? 'grabbing' : 'grab',
            background: '#f1f5f9', borderRadius: '16px',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Image layer */}
          {imgSize.w > 0 && (
            <img
              src={imageSrc}
              alt="crop"
              draggable={false}
              style={{
                position: 'absolute',
                left: pos.x, top: pos.y,
                width: imgSize.w * scale, height: imgSize.h * scale,
                pointerEvents: 'none', userSelect: 'none',
              }}
            />
          )}

          {/* Dark overlay with circle cutout using CSS mask */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: 'none',
          }}>
            <svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
              <defs>
                <mask id="circleMask">
                  <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="white" />
                  <circle cx={CANVAS_SIZE/2} cy={CANVAS_SIZE/2} r={CIRCLE_SIZE/2} fill="black" />
                </mask>
              </defs>
              <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="rgba(0,0,0,0.5)" mask="url(#circleMask)" />
              <circle cx={CANVAS_SIZE/2} cy={CANVAS_SIZE/2} r={CIRCLE_SIZE/2} fill="none" stroke="white" strokeWidth="2" strokeDasharray="6 4" />
            </svg>
          </div>
        </div>

        {/* Zoom slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem auto', maxWidth: '280px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🔍−</span>
          <input
            type="range"
            min="0.1" max="3" step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#22c55e' }}
          />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🔍+</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={onCancel} style={{
            padding: '0.6rem 1.5rem', borderRadius: '10px', border: '2px solid #e2e8f0',
            background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer',
          }}>Hủy</button>
          <button onClick={handleCrop} style={{
            padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white',
            fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
          }}>✓ Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropper;
