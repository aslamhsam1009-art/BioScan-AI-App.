import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap, Sparkles } from 'lucide-react';
import { ScanType, LanguageCode } from '../types';

interface CameraCaptureModalProps {
  scanMode: ScanType;
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  language?: LanguageCode;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  scanMode,
  isOpen,
  onClose,
  onCapture,
  language = 'en',
}) => {
  const isAr = language === 'ar';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          isAr
            ? 'الكاميرا المباشرة غير مدعومة أو محظورة في هذا المتصفح. يمكنك رفع صورة أو اختيار نموذج جاهز أدناه.'
            : 'Live camera capture is not supported or is restricted in this browser frame. You can upload an image or select a sample preset below.'
        );
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        isAr
          ? 'تعذر الوصول إلى الكاميرا (تم رفض الإذن أو الجهاز قيد الاستخدام). يمكنك رفع صورة من المعرض بدلاً من ذلك.'
          : 'Unable to access camera (permission denied or device busy). You can upload a photo or select a sample preset below.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      stopCamera();
      onCapture(dataUrl);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                {isAr ? 'محدد منظر BioScan الذكي' : 'BioScan AI Viewfinder'}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 uppercase tracking-wider font-bold border border-emerald-200">
                  {isAr ? (scanMode === 'plant' ? 'وضع النبات' : scanMode === 'animal' ? 'وضع الحيوان' : 'وضع الكشف التلقائي') : `${scanMode} mode`}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {isAr ? 'وجّه الكاميرا وحاذِ العينة داخل إطار الفحص' : 'Align specimen inside viewfinder box'}
              </p>
            </div>
          </div>
          <button
            id="camera-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Stage with Scanning Target Overlay */}
        <div className="relative aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-sm">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-200 mb-4">{cameraError}</p>
              <button
                id="camera-fallback-btn"
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                {isAr ? 'استخدام رفع صورة بدلاً من ذلك' : 'Use Photo Upload Instead'}
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${flashActive ? 'brightness-150' : ''}`}
              />

              {/* Viewfinder Target Framing Reticle */}
              <div className="absolute inset-8 pointer-events-none border border-emerald-400/40 rounded-2xl flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                  <div className="w-6 h-6 border-t-2 border-s-2 border-emerald-400 rounded-tl-lg rtl:rounded-tr-lg rtl:rounded-tl-none" />
                  <div className="w-6 h-6 border-t-2 border-e-2 border-emerald-400 rounded-tr-lg rtl:rounded-tl-lg rtl:rounded-tr-none" />
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-dashed border-emerald-400/60 flex items-center justify-center animate-spin-slow">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-6 h-6 border-b-2 border-s-2 border-emerald-400 rounded-bl-lg rtl:rounded-br-lg rtl:rounded-bl-none" />
                  <div className="w-6 h-6 border-b-2 border-e-2 border-emerald-400 rounded-br-lg rtl:rounded-bl-lg rtl:rounded-br-none" />
                </div>
              </div>

              {/* Target Scan Label */}
              <div className="absolute bottom-4 bg-slate-900/80 backdrop-blur-xs px-3.5 py-1 rounded-full border border-slate-700/60 text-[11px] text-emerald-300 font-medium flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isAr ? 'التتبع البصري والتركيز التلقائي نشط' : 'Auto-Focus AI Tracking Active'}</span>
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Shutter Bar Controls */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-around">
          <button
            id="camera-flash-toggle-btn"
            onClick={() => setFlashActive(!flashActive)}
            className={`p-3 rounded-full border transition-colors ${
              flashActive
                ? 'bg-amber-400 text-slate-900 border-amber-400 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title={isAr ? 'تبديل الإضاءة / السطوع' : 'Toggle Light / Brightness'}
          >
            <Zap className="w-5 h-5" />
          </button>

          {/* Large Shutter Button */}
          <button
            id="camera-shutter-capture-btn"
            onClick={handleCapture}
            disabled={Boolean(cameraError)}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 shadow-md shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            title={isAr ? 'التقاط الصورة' : 'Capture Photo'}
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-white">
              <div className="w-6 h-6 rounded-full bg-emerald-600" />
            </div>
          </button>

          <button
            id="camera-flip-btn"
            onClick={toggleCamera}
            className="p-3 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
            title={isAr ? 'تبديل الكاميرا' : 'Flip Camera'}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
