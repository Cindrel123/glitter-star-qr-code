
import React, { useState, useRef, useCallback } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Download, Sparkles, Link as LinkIcon } from 'lucide-react';

const QRGenerator = () => {
  const [url, setUrl] = useState('');
  const [glitterParticles, setGlitterParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const qrRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const createGlitterParticle = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();

    setGlitterParticles(prev => [...prev, { id, x, y }]);

    // Remove particle after animation completes
    setTimeout(() => {
      setGlitterParticles(prev => prev.filter(p => p.id !== id));
    }, 1500);
  }, []);

  const downloadQR = async () => {
    if (!qrRef.current || !url) return;

    try {
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 256,
        height: 256,
      });

      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const generateStars = () => {
    return Array.from({ length: 15 }, (_, i) => (
      <div
        key={i}
        className="star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
        }}
      />
    ));
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      onMouseMove={createGlitterParticle}
    >
      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none">
        {generateStars()}
      </div>

      {/* Glitter particles */}
      {glitterParticles.map(particle => (
        <div
          key={particle.id}
          className="glitter-particle"
          style={{
            left: particle.x,
            top: particle.y,
          }}
        />
      ))}

      <div className="glass-card rounded-3xl p-8 max-w-md w-full mx-auto animate-float" style={{ animation: 'float 6s ease-in-out infinite' }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Magical QR Generator
          </h1>
          <p className="text-gray-600">Transform your links into beautiful QR codes</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="url"
              placeholder="Paste your URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="magical-input w-full pl-10 pr-4 py-3 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none"
            />
          </div>

          {url && (
            <div className="text-center space-y-4">
              <div className="qr-container inline-block">
                <div
                  ref={qrRef}
                  className="relative p-4 bg-white rounded-xl shadow-lg"
                >
                  <QRCode
                    value={url}
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox="0 0 256 256"
                    fgColor="#4c1d95"
                    bgColor="#ffffff"
                  />
                  
                  {/* Star overlay on QR code */}
                  <div className="star-overlay">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 opacity-70"
                        style={{
                          left: `${15 + Math.random() * 70}%`,
                          top: `${15 + Math.random() * 70}%`,
                          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                          animation: `twinkle ${2 + Math.random()}s infinite ${Math.random()}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={downloadQR}
                className="download-btn text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
              >
                <Download className="w-5 h-5" />
                Download QR Code
              </button>
            </div>
          )}

          {!url && (
            <div className="text-center py-12 text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <p>Enter a URL to generate your magical QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
