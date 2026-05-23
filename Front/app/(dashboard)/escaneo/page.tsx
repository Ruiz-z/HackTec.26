"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, SwitchCamera, Sparkles, Lightbulb, CheckCircle2, CameraIcon } from "lucide-react";
import { api } from "@/lib/api";

export default function EscaneoJuegoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorHardware, setErrorHardware] = useState<string | null>(null);
  const [capturando, setCapturando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  useEffect(() => {
    listarCamaras();
    return () => detenerCamara();
  }, []);

  async function listarCamaras() {
    try {
      // Primero pedir permiso para que enumerateDevices devuelva labels reales
      const temp = await navigator.mediaDevices.getUserMedia({ video: true })
      temp.getTracks().forEach(t => t.stop())

      const devices = await navigator.mediaDevices.enumerateDevices()
      const cams = devices.filter(d => d.kind === 'videoinput')
      setCameras(cams)
      if (cams.length > 0) {
        const id = cams.length > 1 ? cams[cams.length - 1].deviceId : cams[0].deviceId
        await iniciarCamara(id)
      } else {
        setErrorHardware("No se detectaron cámaras.")
      }
    } catch {
      setErrorHardware("Error al acceder a la cámara.")
    }
  }

  async function iniciarCamara(deviceId: string) {
    detenerCamara();
    setErrorHardware(null);
    setSelectedCameraId(deviceId);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined, width: { ideal: 640 }, height: { ideal: 480 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setErrorHardware("No se pudo iniciar esta cámara.");
    }
  }

  function detenerCamara() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  }

  async function capturarYClasificar() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];

    setCapturando(true);
    try {
      const res = await api.classifyImage(base64);
      setResultado(res);
    } catch (err: any) {
      setResultado({ error: err.message || "Error al clasificar" });
    } finally {
      setCapturando(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in select-none">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Clasificador de Residuos</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Coloca el residuo frente a la cámara y presiona capturar.</p>
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
              <span className="font-bold text-slate-800 text-xs">Cámara en Vivo</span>
            </div>
            {cameras.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                <SwitchCamera className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedCameraId}
                  onChange={(e) => iniciarCamara(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
                >
                  {cameras.map((cam, idx) => (
                    <option key={cam.deviceId} value={cam.deviceId}>{cam.label || `Cámara ${idx + 1}`}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-100 flex items-center justify-center shadow-inner">
            {errorHardware ? (
              <div className="text-slate-400 text-xs font-semibold p-6 text-center">{errorHardware}</div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            )}
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
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-mono tracking-widest font-bold text-white z-10">
              {stream ? "LIVE" : "OFFLINE"}
            </div>
          </div>

          <button
            onClick={capturarYClasificar}
            disabled={!stream || capturando}
            className="mt-4 w-full bg-[#046a53] hover:bg-[#035442] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl text-xs tracking-wider uppercase transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <CameraIcon className="w-4 h-4" />
            {capturando ? "Clasificando..." : "Capturar y Clasificar"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#046a53] fill-[#046a53]" />
              <span>Resultado de Clasificación</span>
            </h4>
            {resultado ? (
              <div className="space-y-3">
                {resultado.error ? (
                  <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
                    <p className="text-xs font-bold text-red-700">{resultado.error}</p>
                  </div>
                ) : resultado.categoria === 'error' ? (
                  <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
                    <p className="text-xs font-bold text-red-700">✗ Residuo no admitido</p>
                    <p className="text-[11px] text-red-600 mt-1">{resultado.objeto}</p>
                    <p className="text-[10px] text-slate-500 mt-2">{resultado.tip}</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-emerald-50/50 border border-emerald-100/40 p-3 rounded-xl flex justify-between items-center text-xs font-medium">
                      <span className="text-slate-500">Material:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded capitalize">{resultado.tipo}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex justify-between items-center text-xs font-medium">
                      <span className="text-slate-500">Precisión:</span>
                      <span className="font-mono font-bold text-slate-800">{resultado.confianza}%</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex justify-between items-center text-xs font-medium">
                      <span className="text-slate-500">XP Ganado:</span>
                      <span className="font-mono font-bold text-emerald-600">+{resultado.xpGanado} XP</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2">{resultado.tip}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{resultado.comoReciclar}</p>
                    {resultado.modo === 'offline' && (
                      <p className="text-[10px] text-amber-500 font-semibold mt-2">⚠ Modo offline (confianza baja)</p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <p className="text-xs font-semibold text-slate-600">Esperando captura para clasificar...</p>
              </div>
            )}
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100/60 p-4 rounded-xl flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-[#046a53] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed font-medium">
              <strong className="text-[#046a53] block mb-0.5">Sugerencia Eco-IA</strong>
              Coloca el residuo sobre un fondo claro y bien iluminado para mejor precisión.
            </div>
          </div>

        </div>

      </div>

      <canvas ref={canvasRef} className="hidden" />

    </div>
  );
}
