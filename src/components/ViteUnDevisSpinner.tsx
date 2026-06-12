'use client';

import { useEffect, useState } from 'react';

interface Props {
  devisId: string;
  devisHash: string;
}

export default function ViteUnDevisSpinner({ devisId, devisHash }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!devisId || !devisHash) return;

    const scriptId = 'vud-spinner-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = `https://www.viteundevis.com/mb/spinner.php?devis_id=${devisId}&devis_hash=${devisHash}&box=944163`;
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.body.appendChild(script);
      }
      
      script.onload = () => {
        setLoaded(true);
      };
    } else {
      setLoaded(true);
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [devisId, devisHash]);

  return (
    <div className="w-full bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[200px]">
      <div id="vud_spin_944163" className="w-full flex justify-center"></div>
      {!loaded && (
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Chargement du module de validation SMS...</p>
        </div>
      )}
    </div>
  );
}
