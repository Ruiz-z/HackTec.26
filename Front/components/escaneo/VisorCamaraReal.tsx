"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, VideoOff, SwitchCamera } from "lucide-react";

interface VisorProps {
  onQrDetectado: (codigo: string) => void;
}

export default function VisorCamaraReal({ onQrDetectado }: VisorProps) {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [errorCamara, setErrorCamara] = useState<string | null>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef(true);
  const scanningRef = useRef(false);
  const onQrRef = useRef(onQrDetectado);
  onQrRef.current = onQrDetectado;

  useEffect(() => {
    mountedRef.current = true;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!mountedRef.current) return;
        if (devices && devices.length > 0) {
          setCameras(devices);
          setSelectedCameraId(devices[0].id);
        } else {
          setErrorCamara("No se detectaron cámaras en este dispositivo.");
        }
      })
      .catch((err) => {
        if (!mountedRef.current) return;
        console.error("Error al listar cámaras:", err);
        setErrorCamara("Error al solicitar permisos de cámara.");
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

    const startScanner = async () => {
      if (scanningRef.current) return;
      scanningRef.current = true;

      try {
        if (!html5QrcodeRef.current) {
          html5QrcodeRef.current = new Html5Qrcode("reader");
        }

        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop();
          await new Promise(r => setTimeout(r, 300));
        }

        if (!mountedRef.current) { scanningRef.current = false; return; }

        setErrorCamara(null);
        setCamaraActiva(false);

        await html5QrcodeRef.current?.start(
          selectedCameraId,
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
          },
          (decodedText) => {
            onQrRef.current(decodedText);
            if (html5QrcodeRef.current?.isScanning) {
              html5QrcodeRef.current.stop().then(() => {
                if (mountedRef.current) setCamaraActiva(false);
              });
            }
          },
          () => {}
        );

        if (mountedRef.current) setCamaraActiva(true);
      } catch (err) {
        if (!mountedRef.current) return;
        console.error("Error al encender la cámara seleccionada:", err);
        setErrorCamara("No se pudo inicializar esta cámara. Intenta con otra.");
        setCamaraActiva(false);
      } finally {
        scanningRef.current = false;
      }
    };

    startScanner();
  }, [selectedCameraId]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex flex-col items-center justify-center text-center h-[540px] relative">
      
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-2 justify-between items-center w-full absolute top-0 left-0 px-6 bg-white rounded-t-3xl z-30">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#046a53]" />
          <span className="font-bold text-slate-800 text-xs">Cámara en Vivo</span>
        </div>

        {cameras.length > 1 && (
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl w-full sm:w-auto max-w-[220px]">
            <SwitchCamera className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedCameraId}
              onChange={(e) => setSelectedCameraId(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-slate-700 outline-none w-full cursor-pointer"
            >
              {cameras.map((cam, idx) => (
                <option key={cam.id} value={cam.id}>
                  {cam.label || `Cámara ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm aspect-square bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative mt-10">
        <div 
          id="reader" 
          className="w-full h-full object-cover [&_video]:object-cover [&_video]:w-full [&_video]:h-full" 
        />
        
        {errorCamara && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white z-20">
            <VideoOff className="w-7 h-7 text-red-400 mb-2" />
            <p className="text-xs font-bold text-slate-300 max-w-[200px]">{errorCamara}</p>
          </div>
        )}
      </div>

      <p className="text-[11px] font-medium text-slate-400 max-w-xs mt-6 leading-relaxed">
        ¿No se ve nada? Cambia de cámara en el selector superior para activar el lente correcto de tu dispositivo.
      </p>
    </div>
  );
}
