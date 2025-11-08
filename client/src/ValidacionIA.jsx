import { useState } from "react";

export default function ValidacionIA() {
  const [file, setFile] = useState(null);
  const [vehiculo, setVehiculo] = useState("cabezal_furgon");
  const [resu, setResu] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("vehiculo_tipo", vehiculo);
    const r = await fetch("/validation/ai/validar-carga", { method: "POST", body: form, credentials: "include" });
    const data = await r.json();
    setResu(data);
    setLoading(false);
  };

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Validación de carga (IA)</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} required />
        <select value={vehiculo} onChange={(e)=>setVehiculo(e.target.value)} className="border p-2 rounded">
          <option value="cabezal_furgon">Cabezal + Furgón</option>
          <option value="camion_rigido">Camión rígido</option>
          <option value="plataforma">Plataforma</option>
        </select>
        <button disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">{loading ? "Validando..." : "Validar"}</button>
      </form>
      {resu && (
        <div className={`p-3 rounded ${resu.resultado === "APROBADO" ? "bg-green-100" : "bg-amber-100"}`}>
          <p className="font-medium">Resultado: {resu.resultado}</p>
          <p>Alto: {resu.alto_m!=null ? resu.alto_m.toFixed(2) : "-"} m | Ancho: {resu.ancho_m!=null ? resu.ancho_m.toFixed(2) : "-"} m</p>
          <p>Límites: altura {resu.limite_alto_m} m, ancho {resu.limite_ancho_m} m</p>
          {Array.isArray(resu.motivos) && resu.motivos.length>0 && <ul className="list-disc ml-5">{resu.motivos.map((m,i)=><li key={i}>{m}</li>)}</ul>}
          {resu.overlay_url && <img src={resu.overlay_url} alt="Overlay" className="mt-2 border rounded" />}
        </div>
      )}
    </div>
  );
}
