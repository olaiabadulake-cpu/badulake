// Provincias de España con sus nombres (oficiales y en castellano) y la posición aproximada de la
// capital (Tarea 6.2, D-043). Sirve para «Cerca de mí»: el móvil calcula la provincia más cercana
// y solo manda su código; la ubicación no sale del móvil ni se guarda.
export type Provincia = { code: string; names: string[]; lat: number; lon: number };

export const PROVINCIAS: Provincia[] = [
  { code: "araba", names: ["Araba", "Álava", "Araba/Álava"], lat: 42.85, lon: -2.67 },
  { code: "albacete", names: ["Albacete"], lat: 38.99, lon: -1.86 },
  { code: "alicante", names: ["Alicante", "Alacant"], lat: 38.35, lon: -0.48 },
  { code: "almeria", names: ["Almería"], lat: 36.84, lon: -2.46 },
  { code: "asturias", names: ["Asturias", "Asturies"], lat: 43.36, lon: -5.85 },
  { code: "avila", names: ["Ávila"], lat: 40.66, lon: -4.70 },
  { code: "badajoz", names: ["Badajoz"], lat: 38.88, lon: -6.97 },
  { code: "barcelona", names: ["Barcelona"], lat: 41.39, lon: 2.17 },
  { code: "burgos", names: ["Burgos"], lat: 42.34, lon: -3.70 },
  { code: "caceres", names: ["Cáceres"], lat: 39.47, lon: -6.37 },
  { code: "cadiz", names: ["Cádiz"], lat: 36.53, lon: -6.29 },
  { code: "cantabria", names: ["Cantabria"], lat: 43.46, lon: -3.81 },
  { code: "castellon", names: ["Castellón", "Castelló"], lat: 39.99, lon: -0.05 },
  { code: "ciudad-real", names: ["Ciudad Real"], lat: 38.99, lon: -3.93 },
  { code: "cordoba", names: ["Córdoba"], lat: 37.89, lon: -4.78 },
  { code: "coruna", names: ["A Coruña", "La Coruña", "Coruña"], lat: 43.36, lon: -8.41 },
  { code: "cuenca", names: ["Cuenca"], lat: 40.07, lon: -2.13 },
  { code: "girona", names: ["Girona", "Gerona"], lat: 41.98, lon: 2.82 },
  { code: "granada", names: ["Granada"], lat: 37.18, lon: -3.60 },
  { code: "guadalajara", names: ["Guadalajara"], lat: 40.63, lon: -3.17 },
  { code: "gipuzkoa", names: ["Gipuzkoa", "Guipúzcoa"], lat: 43.32, lon: -1.98 },
  { code: "huelva", names: ["Huelva"], lat: 37.26, lon: -6.95 },
  { code: "huesca", names: ["Huesca", "Osca"], lat: 42.14, lon: -0.41 },
  { code: "baleares", names: ["Illes Balears", "Baleares", "Islas Baleares"], lat: 39.57, lon: 2.65 },
  { code: "jaen", names: ["Jaén"], lat: 37.78, lon: -3.79 },
  { code: "leon", names: ["León"], lat: 42.60, lon: -5.57 },
  { code: "lleida", names: ["Lleida", "Lérida"], lat: 41.62, lon: 0.62 },
  { code: "lugo", names: ["Lugo"], lat: 43.01, lon: -7.56 },
  { code: "madrid", names: ["Madrid"], lat: 40.42, lon: -3.70 },
  { code: "malaga", names: ["Málaga"], lat: 36.72, lon: -4.42 },
  { code: "murcia", names: ["Murcia"], lat: 37.99, lon: -1.13 },
  { code: "navarra", names: ["Navarra", "Nafarroa"], lat: 42.81, lon: -1.64 },
  { code: "ourense", names: ["Ourense", "Orense"], lat: 42.34, lon: -7.86 },
  { code: "palencia", names: ["Palencia"], lat: 42.01, lon: -4.53 },
  { code: "las-palmas", names: ["Las Palmas", "Gran Canaria"], lat: 28.12, lon: -15.43 },
  { code: "pontevedra", names: ["Pontevedra"], lat: 42.43, lon: -8.64 },
  { code: "la-rioja", names: ["La Rioja"], lat: 42.47, lon: -2.45 },
  { code: "salamanca", names: ["Salamanca"], lat: 40.97, lon: -5.66 },
  { code: "tenerife", names: ["Santa Cruz de Tenerife", "Tenerife"], lat: 28.47, lon: -16.25 },
  { code: "segovia", names: ["Segovia"], lat: 40.95, lon: -4.12 },
  { code: "sevilla", names: ["Sevilla"], lat: 37.39, lon: -5.98 },
  { code: "soria", names: ["Soria"], lat: 41.76, lon: -2.46 },
  { code: "tarragona", names: ["Tarragona"], lat: 41.12, lon: 1.25 },
  { code: "teruel", names: ["Teruel"], lat: 40.35, lon: -1.11 },
  { code: "toledo", names: ["Toledo"], lat: 39.86, lon: -4.02 },
  { code: "valencia", names: ["Valencia", "València"], lat: 39.47, lon: -0.38 },
  { code: "valladolid", names: ["Valladolid"], lat: 41.65, lon: -4.72 },
  { code: "bizkaia", names: ["Bizkaia", "Vizcaya"], lat: 43.26, lon: -2.93 },
  { code: "zamora", names: ["Zamora"], lat: 41.50, lon: -5.75 },
  { code: "zaragoza", names: ["Zaragoza", "Saragossa"], lat: 41.65, lon: -0.88 },
  { code: "ceuta", names: ["Ceuta"], lat: 35.89, lon: -5.32 },
  { code: "melilla", names: ["Melilla"], lat: 35.29, lon: -2.94 },
];

// Para comparar sin mayúsculas ni tildes («Gràcia» = «gracia»).
export function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// La provincia más cercana a un punto (distancia en el plano, suficiente a esta escala).
export function nearestProvincia(lat: number, lon: number): Provincia {
  const k = Math.cos((lat * Math.PI) / 180);
  let best = PROVINCIAS[0];
  let bestD = Infinity;
  for (const p of PROVINCIAS) {
    const d = (p.lat - lat) ** 2 + ((p.lon - lon) * k) ** 2;
    if (d < bestD) { bestD = d; best = p; }
  }
  return best;
}
