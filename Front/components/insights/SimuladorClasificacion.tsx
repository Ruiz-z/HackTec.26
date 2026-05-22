"use client";
import { useState, useRef } from "react";
import { UploadCloud, Camera, RefreshCw } from "lucide-react";

export default function SimuladorClasificacion() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Análisis de IA Completado exitosamente.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-base">Simulador de Clasificación</h3>
        <Camera className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" onClick={handleTriggerUpload} />
      </div>

      <div className="p-6 flex-1 flex flex-col items-center justify-center">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        <div 
          onClick={handleTriggerUpload}
          className="w-full aspect-[4/3] max-h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-slate-50/50 transition-colors overflow-hidden relative group"
        >
          {image ? (
            <>
              <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                <p className="text-white text-xs font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Cambiar Imagen
                </p>
              </div>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-600">
                Arrastra una imagen o usa <br />
                <span className="text-[#046a53] font-semibold">la cámara para simular.</span>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-slate-100 flex justify-center bg-slate-50/50">
        <button
          onClick={handleAnalyze}
          disabled={!image || loading}
          className={`w-1/2 py-2.5 px-4 rounded-full text-sm font-medium text-white transition-colors shadow-sm ${
            image && !loading 
              ? "bg-[#046a53] hover:bg-[#035442]" 
              : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Analizando..." : "Iniciar Análisis"}
        </button>
      </div>
    </div>
  );
}
