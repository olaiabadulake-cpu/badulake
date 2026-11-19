"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ITEM_TYPES, MAX_ITEMS, type DiaPanel, type DiaPersona, type ItemType } from "@/lib/dia";
import { diaEmpezar, diaEtiqueta, diaFijar, diaPresente, diaSiguiente, diaSortear, type DiaResult } from "./actions";

// Lo que falta por enviar al servidor, por persona. Se guarda también en el móvil para que no se
// pierda si se recarga la página o se va la cobertura (se reenvía solo).
type Pending = Record<string, { counts?: Record<ItemType, number>; label?: string }>;

const countsOf = (p: DiaPersona): Record<ItemType, number> => ({
  ropa: p.ropa, calzado: p.calzado, accesorios: p.accesorios, otros: p.otros,
});
const total = (p: DiaPersona) => p.ropa + p.calzado + p.accesorios + p.otros;

function applyPending(panel: DiaPanel, pending: Pending): DiaPanel {
  return {
    ...panel,
    personas: panel.personas.map((p) => {
      const q = pending[p.id];
      if (!q) return p;
      return { ...p, ...(q.counts ?? {}), ...(q.label !== undefined ? { etiqueta: q.label || null } : {}) };
    }),
  };
}

// «+» y «−» dibujados (no como letra): el nombre accesible lo da el aria-label del botón.
function Sign({ plus }: { plus: boolean }) {
  return (
    <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
      <path d="M5 12h14" />
      {plus && <path d="M12 5v14" />}
    </svg>
  );
}

export function DiaPanelView({ id, initial }: { id: string; initial: DiaPanel }) {
  const t = useTranslations("Dia");
  const storeKey = `badulake-dia-${id}`;
  const [pending, setPending] = useState<Pending>({});
  const [panel, setPanel] = useState<DiaPanel>(initial);
  const [offline, setOffline] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"sortear" | "empezar" | null>(null);
  const [busy, setBusy] = useState(false);
  const pendingRef = useRef<Pending>({});
  const flushing = useRef(false);

  const save = useCallback((next: Pending) => {
    pendingRef.current = next;
    setPending(next);
    try {
      if (Object.keys(next).length) localStorage.setItem(storeKey, JSON.stringify(next));
      else localStorage.removeItem(storeKey);
    } catch {
      // Sin almacenamiento del navegador: sigue funcionando mientras haya señal.
    }
  }, [storeKey]);

  // Al abrir: recuperar lo que no llegó a enviarse.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) {
        const saved = JSON.parse(raw) as Pending;
        const ids = new Set(initial.personas.map((p) => p.id));
        const clean = Object.fromEntries(Object.entries(saved).filter(([k]) => ids.has(k)));
        pendingRef.current = clean;
        setPending(clean);
        setPanel((p) => applyPending(p, clean));
      }
    } catch {
      // Datos guardados ilegibles: se ignoran.
    }
  }, [storeKey, initial]);

  // Enviar lo pendiente. Devuelve true si no queda nada por enviar.
  const flush = useCallback(async (): Promise<boolean> => {
    if (flushing.current) return false;
    flushing.current = true;
    try {
      for (const [fila, q] of Object.entries(pendingRef.current)) {
        const sent = JSON.stringify(q);
        let code = "ok";
        if (q.counts) code = await diaFijar(fila, q.counts);
        if (code === "ok" && q.label !== undefined) code = await diaEtiqueta(fila, q.label);
        if (code === "error") throw new Error("red");
        if (code !== "ok") setMessage(t("errors.closed"));
        // Solo se quita si no ha cambiado mientras se enviaba.
        const now = pendingRef.current[fila];
        if (now && JSON.stringify(now) === sent) {
          const { [fila]: _gone, ...rest } = pendingRef.current;
          void _gone;
          save(rest);
        }
      }
      setOffline(false);
      return Object.keys(pendingRef.current).length === 0;
    } catch {
      setOffline(true);
      return false;
    } finally {
      flushing.current = false;
    }
  }, [save, t]);

  useEffect(() => {
    const again = () => void flush();
    window.addEventListener("online", again);
    const timer = window.setInterval(() => {
      if (Object.keys(pendingRef.current).length) void flush();
    }, 5000);
    if (Object.keys(pendingRef.current).length) void flush();
    return () => {
      window.removeEventListener("online", again);
      window.clearInterval(timer);
    };
  }, [flush]);

  function change(fila: string, patch: (q: Pending[string]) => Pending[string], update: (p: DiaPersona) => DiaPersona) {
    setPanel((cur) => ({ ...cur, personas: cur.personas.map((p) => (p.id === fila ? update(p) : p)) }));
    save({ ...pendingRef.current, [fila]: patch(pendingRef.current[fila] ?? {}) });
    window.setTimeout(() => void flush(), 300);
  }

  function bump(p: DiaPersona, type: ItemType, delta: number) {
    // Se parte del último valor pedido (aunque la pantalla aún no se haya redibujado), para que dos
    // toques muy seguidos cuenten dos veces.
    const last = { ...countsOf(p), ...(pendingRef.current[p.id]?.counts ?? {}) };
    const value = Math.min(MAX_ITEMS, Math.max(0, last[type] + delta));
    if (value === last[type]) return;
    change(p.id, (q) => ({ ...q, counts: { ...last, ...(q.counts ?? {}), [type]: value } }),
      (x) => ({ ...x, [type]: value }));
  }

  function rename(p: DiaPersona, label: string) {
    change(p.id, (q) => ({ ...q, label }), (x) => ({ ...x, etiqueta: label || null }));
  }

  // Acciones que necesitan señal (sorteos, turnos, «no ha venido»): si falla, no se pierde nada.
  async function run(action: () => Promise<DiaResult>) {
    setBusy(true);
    setMessage(null);
    setConfirm(null);
    try {
      if (!(await flush())) {
        setMessage(t("errors.pending"));
        return;
      }
      const r = await action();
      if (r.panel) setPanel(applyPending(r.panel, pendingRef.current));
      if (r.code === "ya_sorteado") setMessage(t("errors.alreadyDrawn"));
      else if (r.code === "ya_empezado") setMessage(t("errors.alreadyStarted"));
      else if (r.code !== "ok" && r.code !== "terminado") setMessage(t("errors.closed"));
      setOffline(false);
    } catch {
      setMessage(t("errors.offlineAction"));
    } finally {
      setBusy(false);
    }
  }

  const name = (p: DiaPersona) => p.etiqueta || t("person", { num: p.num });
  const here = panel.personas.filter((p) => p.presente);
  const list = [...panel.personas].sort((a, b) =>
    Number(b.presente) - Number(a.presente) ||
    (panel.orden_sorteado ? (a.orden_exponer ?? 999) - (b.orden_exponer ?? 999) : a.num - b.num));
  const queue = here
    .filter((p) => p.orden_elegir !== null)
    .sort((a, b) => (a.orden_elegir ?? 0) - (b.orden_elegir ?? 0));
  const current = panel.turno === null ? null : queue.find((p) => p.orden_elegir === panel.turno) ?? null;
  const allDone = panel.elegir_empezado && !current;
  const unsaved = Object.keys(pending).length > 0;

  return (
    <>
      <div role="status" aria-live="polite" className={offline ? "aviso-error" : "ayuda"}>
        {offline ? t("offline") : unsaved ? t("saving") : t("saved")}
      </div>
      {message && <p role="alert" className="aviso-error">{message}</p>}
      <p className="ayuda">{t("intro", { count: here.length })}</p>

      <section aria-labelledby="dia-orden" className="flex flex-col gap-3">
        <h2 id="dia-orden" className="titulo-2">{t("drawTitle")}</h2>
        {panel.orden_sorteado ? (
          <p className="aviso">{t("drawn")}</p>
        ) : confirm === "sortear" ? (
          <div className="tarjeta">
            <p className="font-semibold">{t("drawConfirm")}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="boton grande" disabled={busy} onClick={() => run(() => diaSortear(id))}>{t("drawYes")}</button>
              <button type="button" className="boton-2 grande" onClick={() => setConfirm(null)}>{t("cancel")}</button>
            </div>
          </div>
        ) : (
          <button type="button" className="boton grande" disabled={busy || here.length === 0} onClick={() => setConfirm("sortear")}>
            {t("drawButton")}
          </button>
        )}
      </section>

      <section aria-labelledby="dia-contar" className="flex flex-col gap-4">
        <h2 id="dia-contar" className="titulo-2">{t("countTitle")}</h2>
        <ul className="flex flex-col gap-4">
          {list.map((p) => (
            <li key={p.id} className={`tarjeta ${p.presente ? "" : "opacity-70"}`}>
              <div className="flex flex-wrap items-center gap-2">
                {p.orden_exponer !== null && p.presente && (
                  <span className="etiqueta-pildora">{t("exposeBadge", { n: p.orden_exponer })}</span>
                )}
                {p.orden_elegir !== null && p.presente && (
                  <span className="etiqueta-pildora contorno">{t("chooseBadge", { n: p.orden_elegir })}</span>
                )}
                {!p.presente && <span className="etiqueta-pildora contorno">{t("absentBadge")}</span>}
              </div>
              <label htmlFor={`n-${p.id}`} className="etiqueta mt-1">{t("nameLabel", { num: p.num })}</label>
              <input
                id={`n-${p.id}`} className="campo" maxLength={30} autoComplete="off"
                placeholder={t("person", { num: p.num })} value={p.etiqueta ?? ""}
                onChange={(e) => rename(p, e.target.value)}
              />
              {p.presente && (
                <div className="mt-3 flex flex-col gap-3">
                  {ITEM_TYPES.map((type) => (
                    <div key={type} className="flex items-center justify-between gap-3" role="group" aria-label={`${t(`types.${type}`)} · ${name(p)}`}>
                      <span className="text-lg font-semibold">{t(`types.${type}`)}</span>
                      <span className="flex items-center gap-3">
                        <button type="button" className="boton-2 contador" aria-label={t("minus", { type: t(`types.${type}`), name: name(p) })}
                          disabled={p[type] === 0} onClick={() => bump(p, type, -1)}><Sign plus={false} /></button>
                        <output className="min-w-10 text-center text-2xl font-bold" aria-live="polite">{p[type]}</output>
                        <button type="button" className="boton contador" aria-label={t("plus", { type: t(`types.${type}`), name: name(p) })}
                          disabled={p[type] >= MAX_ITEMS} onClick={() => bump(p, type, 1)}><Sign plus /></button>
                      </span>
                    </div>
                  ))}
                  <p className="font-bold">{t("total", { count: total(p) })}</p>
                </div>
              )}
              <button
                type="button" className="boton-2 mt-3 sm:self-start" disabled={busy}
                onClick={() => run(() => diaPresente(id, p.id, !p.presente))}
              >
                {p.presente ? t("absent", { name: name(p) }) : t("arrived", { name: name(p) })}
              </button>
            </li>
          ))}
        </ul>
        <p className="ayuda">{t("lateNote")}</p>
      </section>

      <section aria-labelledby="dia-turnos" className="flex flex-col gap-3">
        <h2 id="dia-turnos" className="titulo-2">{t("turnsTitle")}</h2>
        <p className="ayuda">{panel.elegir_empezado ? t("turnsExplainStarted") : t("turnsExplain")}</p>
        {!panel.elegir_empezado ? (
          confirm === "empezar" ? (
            <div className="tarjeta">
              <p className="font-semibold">{t("startConfirm")}</p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="boton grande" disabled={busy} onClick={() => run(() => diaEmpezar(id))}>{t("startYes")}</button>
                <button type="button" className="boton-2 grande" onClick={() => setConfirm(null)}>{t("cancel")}</button>
              </div>
            </div>
          ) : (
            <button type="button" className="boton grande" disabled={busy || here.length === 0} onClick={() => setConfirm("empezar")}>
              {t("startChoose")}
            </button>
          )
        ) : (
          <>
            <p role="status" className="aviso text-xl">
              {allDone ? t("allDone") : t("currentTurn", { name: name(current!) })}
            </p>
            {!allDone && (
              <button type="button" className="boton grande" disabled={busy} onClick={() => run(() => diaSiguiente(id))}>
                {t("nextTurn")}
              </button>
            )}
          </>
        )}
        <h3 className="titulo-3">{t("queueTitle")}</h3>
        <ol className="flex flex-col gap-2">
          {[...here]
            .sort((a, b) => (a.orden_elegir ?? 0) - (b.orden_elegir ?? 0) || total(b) - total(a) || a.num - b.num)
            .map((p, i) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border-2 border-current px-3 py-2"
                aria-current={current?.id === p.id ? "step" : undefined}>
                <span className="font-semibold">{i + 1}.º · {name(p)}</span>
                <span>{t("total", { count: total(p) })}{current?.id === p.id ? ` · ${t("itsTurn")}` : ""}</span>
              </li>
            ))}
        </ol>
      </section>

      <section aria-labelledby="dia-sobra" className="flex flex-col gap-3">
        <h2 id="dia-sobra" className="titulo-2">{t("leftTitle")}</h2>
        <ul className="list-disc pl-6 text-lg">
          {(["bags", "donate", "own", "tidy"] as const).map((k) => <li key={k}>{t(`left.${k}`)}</li>)}
        </ul>
      </section>
    </>
  );
}
