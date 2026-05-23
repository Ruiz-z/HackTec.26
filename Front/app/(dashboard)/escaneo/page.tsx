"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, VideoOff, SwitchCamera, Sparkles, Lightbulb, CheckCircle2, Search } from "lucide-react";

export default function EscaneoJuegoPage() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [errorHardware, setErrorHardware] = useState<string | null>(null);
  const [codigoManual, setCodigoManual] = useState("");
  
  const [sistemaVinculado, setSistemaVinculado] = useState(false);
  const [codigoDetectado, setCodigoDetectado] = useState<string | null>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const scanningRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!mountedRef.current) return;
        if (devices && devices.length > 0) {
          setCameras(devices);
          setSelectedCameraId(devices[0].id);
        } else {
          setErrorHardware("No se detectaron cámaras en este dispositivo de juego.");
        }
      })
      .catch((err) => {
        if (!mountedRef.current) return;
        console.error(err);
        setErrorHardware("Falta de permisos para acceder a la cámara del depósito.");
      });

    return () => {
      mountedRef.current = false;
      if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
        html5QrcodeRef.current.stop().catch((e) => console.error(e));
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedCameraId) return;

    if (!html5QrcodeRef.current) {
      html5QrcodeRef.current = new Html5Qrcode("reader-deposito");
    }

    const iniciarStream = async () => {
      if (scanningRef.current) return;
      scanningRef.current = true;

      try {
        if (html5QrcodeRef.current?.isScanning) {
          await html5QrcodeRef.current.stop();
          await new Promise(r => setTimeout(r, 300));
        }

        if (!mountedRef.current) { scanningRef.current = false; return; }

        setErrorHardware(null);
        setCamaraActiva(false);

        await html5QrcodeRef.current?.start(
          selectedCameraId,
          {
            fps: 15,
            qrbox: (width: number, height: number) => {
              const size = Math.min(width, height) * 0.65;
              return { width: size, height: size };
            }
          },
          (textoDecodificado) => {
            setCodigoDetectado(textoDecodificado);
            setSistemaVinculado(true);
          },
          () => {}
        );

        if (mountedRef.current) setCamaraActiva(true);
      } catch (err) {
        if (!mountedRef.current) return;
        setErrorHardware("Error al inicializar el stream de la cámara seleccionada.");
        setCamaraActiva(false);
      } finally {
        scanningRef.current = false;
      }
    };

    iniciarStream();
  }, [selectedCameraId]);

  const handleVincularManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigoManual.trim()) {
      setCodigoDetectado(codigoManual);
      setSistemaVinculado(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in select-none">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Welcome to the Game!</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Escanea el hardware físico para registrar tus depósitos con IA.</p>
        </div>
        <div className="bg-[#fcc419] text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-2xs flex items-center gap-1.5 self-end sm:self-auto">
          <span>★</span> Gold Rank
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-center w-full mb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#046a53]" />
              <span className="font-bold text-slate-800 text-xs">Cámara del Depósito en Vivo</span>
            </div>

            {cameras.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                <SwitchCamera className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
                >
                  {cameras.map((cam, idx) => (
                    <option key={cam.id} value={cam.id}>{cam.label || `Lente ${idx + 1}`}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-100 flex items-center justify-center shadow-inner">
            <div 
              id="reader-deposito" 
              className="w-full h-full object-cover [&_video]:object-cover [&_video]:w-full [&_video]:h-full" 
            />
            
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
              <div className="flex justify-between w-full">
                <div className="w-8 h-8 border-t-4 border-l-4 border-white/70 rounded-tl-lg" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-white/70 rounded-tr-lg" />
              </div>
              <div className="flex justify-between w-full">
                <div className="w-8 h-8 border-b-4 border-l-4 border-white/70 rounded-bl-lg" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-white/70 rounded-br-lg" />
              </div>
            </div>

            {errorHardware && (
              <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white z-20">
                <VideoOff className="w-8 h-8 text-red-400 mb-2" />
                <p className="text-xs font-bold text-slate-300 text-center">{errorHardware}</p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-mono tracking-widest font-bold text-white z-10">
              LIVE VIEW: CLASSIFYING...
            </div>
          </div>

          <p className="text-[11px] font-medium text-slate-400 text-center mt-4">
            ¿No se ve nada? Cambia de cámara en el selector superior para activar el lente correcto de tu dispositivo.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          
          <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Conexión con Contenedor</h4>
            {sistemaVinculado ? (
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-900 leading-none">Contenedor Vinculado</p>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 block mt-1 truncate">ID: {codigoDetectado}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-2.5 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <p className="text-xs font-semibold text-slate-600">Esperando lectura de código QR de la cámara...</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-2xs flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-3">
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
              disabled={!sistemaVinculado}
              className={`w-full font-bold py-3 rounded-xl text-xs tracking-wider uppercase transition-colors shadow-2xs mt-4 ${
                sistemaVinculado 
                  ? "bg-[#046a53] hover:bg-[#035442] text-white cursor-pointer" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              Confirm Classification
            </button>
          </div>

          <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Entrada Manual</h4>
            <form onSubmit={handleVincularManual} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ej: ARC-9982"
                value={codigoManual}
                onChange={(e) => setCodigoManual(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-slate-400"
              />
              <button type="submit" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 rounded-xl text-xs transition-colors cursor-pointer">
                Vincular
              </button>
            </form>
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
