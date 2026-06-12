export interface VUDLeadPayload {
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  cp: string;
  ville: string;
  cp_projet: string;
  ville_projet: string;
  pays?: string;
  adresse1: string;
  adresse2?: string;
  tp: number;        // 1: Particulier, 2: Pro, 3: Syndicat, 4: Autre
  type_bien: number; // 1: Appt, 2: Maison, 3: Immeuble, 4: Bureau, etc.
  situation: number; // 1: Propriétaire, 2: Locataire, etc.
  delais: number;    // 1: Urgent, 2: < 6 mois, etc.
  description: string;
  cat_id: string;
  site_name?: string;
}

export interface VUDResponse {
  code_retour?: Array<{ code: string | number; code_texte: string }>;
  devis_data?: {
    devis_id: string | number;
    devis_hash?: string;
    devis_reversement?: string | number;
    devis_montant_attention?: string;
  };
}

export async function sendLeadToViteUnDevis(payload: VUDLeadPayload): Promise<VUDResponse | null> {
  const token = '17812171346a2b376eaab546a2b376eaab8c';
  
  // 1. Optional Ping
  try {
    const pingRes = await fetch('https://www.viteundevis.com/api/ping.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        token: token,
        cat_id: payload.cat_id,
        code_postal: payload.cp_projet,
        pays: payload.pays || 'fr',
        description: payload.description,
        cpl_mini: '0'
      })
    });
    const pingData = await pingRes.json();
    console.log("📡 [ViteUnDevis] Ping check response:", pingData);
  } catch (err) {
    console.error("❌ [ViteUnDevis] Ping check failed:", err);
  }

  // 2. Lead Submit POST
  const isTestMode = process.env.NODE_ENV === 'development' || payload.cat_id === '145';
  const submitUrl = isTestMode
    ? 'https://www.viteundevis.com/api/get.php?test=1'
    : 'https://www.viteundevis.com/api/get.php';

  console.log(`📡 [ViteUnDevis] Submitting lead to VUD: ${submitUrl}`);

  try {
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': `partenaire-apivud-${token}`
      },
      body: new URLSearchParams({
        key: token,
        nom: payload.nom,
        prenom: payload.prenom,
        email: payload.email,
        tel: payload.tel,
        adresse1: payload.adresse1 || payload.ville,
        adresse2: payload.adresse2 || '',
        cp: payload.cp,
        ville: payload.ville,
        cp_projet: payload.cp_projet,
        ville_projet: payload.ville_projet,
        pays: payload.pays || 'fr',
        tp: String(payload.tp),
        type_bien: String(payload.type_bien),
        situation: String(payload.situation),
        delais: String(payload.delais),
        description: payload.description,
        cat_id: payload.cat_id,
        format_return: 'json',
        site_name: payload.site_name || 'urgencecouverture.com'
      })
    });

    if (!response.ok) {
      console.error(`❌ [ViteUnDevis] POST error. Status: ${response.status}`);
      return null;
    }

    const data: VUDResponse = await response.json();
    console.log("📡 [ViteUnDevis] POST response:", data);
    return data;
  } catch (err) {
    console.error("❌ [ViteUnDevis] POST lead submission failed:", err);
    return null;
  }
}
