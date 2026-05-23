"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Sparkles, Lightbulb } from "lucide-react";

export default function JuegoActivoPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificado, setClassificado] = useState(false);
  const [errorHardware, setErrorHardware] = useState<string | null>(null);

  useEffect(() => {
    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 640 } }
        });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error de hardware de cámara:", err);
        setErrorHardware("No se pudo conectar con la cámara interna del depósito.");
      }
    }

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleConfirmClassification = () => {
    setIsClassifying(true);
    setTimeout(() => {
      setIsClassifying(false);
      setClassificado(true);
    }, 1800);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in select-none">
      
      <div className="flex justify-between items-start w-full mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to the Game!</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Escanea el hardware físico para registrar tus depósitos con IA.</p>
        </div>
        <div className="bg-[#fcc419] text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs">
          <span>★</span>
          <span>Gold Rank</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        
        <div className="lg:col-span-3 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-2xs flex flex-col justify-between min-h-[480px]">
          <div className="flex justify-between items-center w-full mb-4 px-1">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#046a53]" />
              <span>Cámara en Vivo</span>
            </h3>
            <span className="text-[10px] font-mono bg-emerald-50 text-[#046a53] px-2 py-0.5 rounded font-bold tracking-wide">
              DEPOSIT_VIEW
            </span>
          </div>

          <div className="w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-100 flex items-center justify-center shadow-inner">
            {errorHardware ? (
              <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                {errorHardware}
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-100"
              />
            )}

            <div className="absolute inset-16 border-2 border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-md" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-md" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-md" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-md" />
              
              {isClassifying && (
                <div className="text-[10px] font-mono tracking-widest font-black text-white bg-black/60 px-3 py-1 rounded-full animate-pulse">
                  CLASSIFYING...
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg text-[10px] font-bold text-slate-700 border border-slate-200/40">
              Live View: Classifying...
            </div>
          </div>

          <p className="text-[11px] font-medium text-slate-400 text-center mt-4">
            ¿No se ve nada? Cambia de cámara en el selector superior para activar el lente correcto de tu dispositivo.
          </p>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4 justify-between">
          
          <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Conexión con Contenedor</h4>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <p className="text-xs font-semibold text-slate-600">Esperando lectura de código QR de la cámara...</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-2xs flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#046a53] fill-[#046a53]" />
                <span>Your Current Activity</span>
              </h4>

              <div className="space-y-2">
                <div className="bg-emerald-50/50 border border-emerald-100/40 p-3 rounded-xl flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-500">Material Type:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">Plastic (Classified)</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-500">Probability:</span>
                  <span className="font-mono font-bold text-slate-800">98.4% Accuracy</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfirmClassification}
              className={`w-full font-bold py-3 rounded-xl text-xs tracking-wider uppercase transition-colors shadow-2xs mt-6 cursor-pointer ${
                classificado 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                  : "bg-[#046a53] hover:bg-[#035442] text-white"
              }`}
            >
              {isClassifying ? "Procesando..." : classificado ? "✓ Depositado" : "Confirm Classification"}
            </button>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100/60 p-4 rounded-xl flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-[#046a53] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed font-medium">
              <strong className="text-[#046a53] block mb-0.5">Sugerencia Eco-IA</strong>
              Asegúrate de retirar las etiquetas de papel de las botellas plásticas antes del escaneo para mantener tu tasa de precisión por encima del 95%.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
