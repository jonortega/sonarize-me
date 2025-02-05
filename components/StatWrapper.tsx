"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dynamic from "next/dynamic";

const statComponents = {
  "hall-of-fame": dynamic(() => import("@/components/stats/HallOfFame")),
  "estaciones-musicales": dynamic(() => import("@/components/stats/EstacionesMusicales")),
  "huella-del-dia": dynamic(() => import("@/components/stats/HuellaDelDia")),
  "la-bitacora": dynamic(() => import("@/components/stats/LaBitacora")),
  "tus-decadas": dynamic(() => import("@/components/stats/TusDecadas")),
  "indice-de-interferencia": dynamic(() => import("@/components/stats/IndiceDeInterferencia")),
};

interface StatWrapperProps {
  activeStat: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StatWrapper({ activeStat, isOpen, onClose }: StatWrapperProps) {
  const getStatComponent = (statId: string | null) => {
    if (!statId || !(statId in statComponents)) {
      return (
        <div className='text-sm text-spotify-gray-100'>Selecciona una estadística válida para ver los detalles.</div>
      );
    }
    const DynamicComponent = statComponents[statId as keyof typeof statComponents];
    return <DynamicComponent />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='w-[95vw] max-w-4xl min-h-[60vh] max-h-screen overflow-y-auto p-6 flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-spotify-green'>
            {activeStat
              ? activeStat
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              : "Estadística"}
          </DialogTitle>
        </DialogHeader>
        <div className='flex-1 flex items-center justify-center py-4'>
          <div className='w-full max-w-3xl mx-auto'>{getStatComponent(activeStat)}</div>
        </div>
        <div className='mt-auto text-right'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-spotify-gray-100 text-black font-semibold rounded-lg hover:bg-spotify-green/90'
          >
            Cerrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
