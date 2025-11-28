// =========================================================
// I. CONSTANTES Y ESTADO GLOBAL DEL SIMULADOR
// =========================================================

// Datos de la Economía del Evento
const COSTO_OBJETIVO_CANJE = 1440; // Núcleos para Layla Legendaria
const COSTO_TIRO_BASE = 100;
const COSTO_10X_BASE = 1000;
const PROMEDIO_NUCLEOS_POR_TIRO = 3.5;

// Estado del Simulador Dinámico
let estado = {
    nucleos: 0,
    tiradasTotales: 0,
    tiradasDesdeUltimaEspecial: 0,
    diamantesGastados: 0,
    descuento1xUsado: false,
    descuento10xUsado: false,
};

// =========================================================
// II. TABLA DE RECOMPENSAS Y PROBABILIDADES
// =========================================================

// Valor de conversión de duplicados (basado en el Pozo de Premios)
const VALOR_NUCLEOS = {
    LEGENDARIA: 400,
    DOBLE_11: 200,
    COLLECTOR: 200, 
    LUCKYBOX: 200, 
    EPICA: 80,
    ESPECIAL: 50,
    ELITE: 20,
    BASICA: 10,
    EMOJI: 3,
    OTROS_ITEM: 0

};

// Probabilidades del Pozo de Premios (Se asume que la Legendaria está dentro del 0.003%)
const POZO_PREMIOS = [
    { nombre: "Legendaria/Doble 11/Collector/LUCKYBOX", coreValor: VALOR_NUCLEOS.LEGENDARIA, probabilidad: 0.00075 },
    { nombre: "Legendaria/Doble 11/Collector/LUCKYBOX", coreValor: VALOR_NUCLEOS.DOBLE_11, probabilidad: 0.00075 },
    { nombre: "Legendaria/Doble 11/Collector/LUCKYBOX", coreValor: VALOR_NUCLEOS.COLLECTOR, probabilidad: 0.00075 },
    { nombre: "Legendaria/Doble 11/Collector/LUCKYBOX", coreValor: VALOR_NUCLEOS.LUCKYBOX, probabilidad: 0.00075 },
    { nombre: "Épica", coreValor: VALOR_NUCLEOS.EPICA, probabilidad: 0.012 },
    { nombre: "Especial", coreValor: VALOR_NUCLEOS.ESPECIAL, probabilidad: 0.15 },
    { nombre: "Élite", coreValor: VALOR_NUCLEOS.ELITE, probabilidad: 1.0 },
    { nombre: "Básica", coreValor: VALOR_NUCLEOS.BASICA, probabilidad: 10.0 },
    { nombre: "Núcleos de Polvo Estelar (Directo)", coreValor: 50, probabilidad: 23.0 },
    { nombre: "Emoji de Batalla", coreValor: VALOR_NUCLEOS.EMOJI, probabilidad: 32.9175 },
    { nombre: "Ítem", coreValor: VALOR_NUCLEOS.OTROS_ITEM, probabilidad: 32.9175}
];

// Lista de skins para la gestión de propiedad (Basado en la tabla completa)
const SKINS_DISPONIBLES = [
    // --- LEGENDARIA/DOBLE 11/COLLECTOR (200 Núcleos Duplicado) ---
    { id: 'layla-legendaria', nombre: 'Layla: Luz del Amanecer', rareza: 'LEGENDARIA', obtenido: false },
    { id: 'thamuz-doble11', nombre: 'Thamuz: El Aniquilador', rareza: 'DOBLE_11', obtenido: false },
    { id: 'nolan-doble11', nombre: 'Nolan: El Navegante', rareza: 'DOBLE_11', obtenido: false },
    { id: 'wanwan-doble11', nombre: 'Wanwan: Golondrina Radiante', rareza: 'DOBLE_11', obtenido: false },
    { id: 'x.borg-doble11', nombre: 'X.Borg: Tesla Maniac', rareza: 'DOBLE_11', obtenido: false },
    { id: 'gusion-doble11', nombre: 'Gusion: Caminante Dimensional', rareza: 'DOBLE_11', obtenido: false },
    { id: 'hayabusa-doble11', nombre: 'Hayabusa: Shura', rareza: 'DOBLE_11', obtenido: false },
    { id: 'valir-collector', nombre: 'Valir: Señor Demoníaco', rareza: 'COLLECTOR', obtenido: false },
    { id: 'pharsa-collector', nombre: 'Pharsa: Emperatriz Fénix', rareza: 'COLLECTOR', obtenido: false },
    { id: 'yi-sun-shin-collector', nombre: 'Yi Sun-shin: Destructor Solitario', rareza: 'COLLECTOR', obtenido: false },
    { id: 'chou-luckybox', nombre: 'Chou: Chico Dragón', rareza: 'LUCKYBOX', obtenido: false },
    { id: 'zhask-luckybox', nombre: 'Zhask: Predicador de Huesos', rareza: 'LUCKYBOX', obtenido: false },
    { id: 'moskov-luckybox', nombre: 'Moskov: Dragón Crepuscular', rareza: 'LUCKYBOX', obtenido: false },
    { id: 'claude-luckybox', nombre: 'Claude: Dragón Mecha', rareza: 'LUCKYBOX', obtenido: false },
    { id: 'kaja-luckybox', nombre: 'Kaja: Horus Apocalíptico', rareza: 'LUCKYBOX', obtenido: false },    
    
    // --- SKINS ÉPICAS (80 Núcleos Duplicado) ---
    
    { id: 'freya-epica', nombre: 'Freya: Cuervo Shogun', rareza: 'EPICA', obtenido: false },
    { id: 'masha-epica', nombre: 'Masha: Armadura de Dragón', rareza: 'EPICA', obtenido: false },
    { id: 'esmeralda-epica', nombre: 'Esmeralda: Sombra Ardiente', rareza: 'EPICA', obtenido: false },
    { id: 'ling-epica', nombre: 'Ling: Sombra Nocturna', rareza: 'EPICA', obtenido: false },
    { id: 'aldous-epica', nombre: 'Aldous: Fuerza Ardiente', rareza: 'EPICA', obtenido: false },
    { id: 'hanabi-epica', nombre: 'Hanabi: V.E.N.O.M. Nephila', rareza: 'EPICA', obtenido: false },
    { id: 'uranus-epica', nombre: 'Uranus: Bastión Celestial', rareza: 'EPICA', obtenido: false },
    { id: 'grock-epica', nombre: 'Grock: Código: Rhino', rareza: 'EPICA', obtenido: false },
    { id: 'roger-epica', nombre: 'Roger: Fantasma Pirata', rareza: 'EPICA', obtenido: false },
    { id: 'harley-epica', nombre: 'Harley: Gran Inventor', rareza: 'EPICA', obtenido: false },
    { id: 'estes-epica', nombre: 'Estes: Dragón Ratán', rareza: 'EPICA', obtenido: false },
    { id: 'moskov-epica', nombre: 'Moskov: Lanza de Sangre', rareza: 'EPICA', obtenido: false },
    { id: 'claude-epica', nombre: 'Claude: Rastro Ardiente', rareza: 'EPICA', obtenido: false },
    { id: 'rafaela-epica', nombre: 'Rafaela: Hada Floral', rareza: 'EPICA', obtenido: false },
    { id: 'zilong-epica', nombre: 'Zilong: General Glorioso', rareza: 'EPICA', obtenido: false },
    { id: 'franco-epica', nombre: 'Franco: Hacha Ardiente', rareza: 'EPICA', obtenido: false },
    { id: 'nana-epica', nombre: 'Nana: Bebé Mecha', rareza: 'EPICA', obtenido: false },
    { id: 'saber-epica', nombre: 'Saber: S.A.B.E.R Regulator', rareza: 'EPICA', obtenido: false },

    // --- SKINS ESPECIALES (50 Núcleos Duplicado) ---
    { id: 'lylia-especial', nombre: 'Lylia: Estrella del Futuro', rareza: 'ESPECIAL', obtenido: false },
    { id: 'chou-especial', nombre: 'Chou: Tigre Furioso', rareza: 'ESPECIAL', obtenido: false },
    { id: 'guinevere-especial', nombre: 'Guinevere: Danza Amatista', rareza: 'ESPECIAL', obtenido: false },
    { id: 'natalia-especial', nombre: 'Natalia: Cuervo de Medianoche', rareza: 'ESPECIAL', obtenido: false },
    { id: 'clint-especial', nombre: 'Clint: Campeón de Bádminton', rareza: 'ESPECIAL', obtenido: false },
    { id: 'balmond-especial', nombre: 'Balmond: Guardia Salvaje', rareza: 'ESPECIAL', obtenido: false },
    { id: 'alice-especial', nombre: 'Alice: Búho Divino', rareza: 'ESPECIAL', obtenido: false },
    { id: 'kadita-especial', nombre: 'Kadita: Petirrojo Blanco', rareza: 'ESPECIAL', obtenido: false },
    { id: 'kagura-especial', nombre: 'Kagura: Bruja de las Cerezas', rareza: 'ESPECIAL', obtenido: false },
    { id: 'helcurt-especial', nombre: 'Helcurt: Depredador Evolucionado', rareza: 'ESPECIAL', obtenido: false },
    { id: 'zhask-especial', nombre: 'Zhask: Extraterrestre', rareza: 'ESPECIAL', obtenido: false },
    { id: 'hylos-especial', nombre: 'Hylos: Vidente Fantasmal', rareza: 'ESPECIAL', obtenido: false },
    { id: 'diggie-especial', nombre: 'Diggie: Constelación', rareza: 'ESPECIAL', obtenido: false },
    { id: 'chang\'e-especial', nombre: 'Chang\'e: Elfa Floral', rareza: 'ESPECIAL', obtenido: false },
    { id: 'bruno-especial', nombre: 'Bruno: Brunicii', rareza: 'ESPECIAL', obtenido: false },
    { id: 'belerick-especial', nombre: 'Belerick: El Profundo', rareza: 'ESPECIAL', obtenido: false },
    { id: 'hanzo-especial', nombre: 'Hanzo: Tutor Insidioso', rareza: 'ESPECIAL', obtenido: false },
    { id: 'badang-especial', nombre: 'Badang: Susanoo', rareza: 'ESPECIAL', obtenido: false },
    { id: 'jawhead-especial', nombre: 'Jawhead: El Cascanueces', rareza: 'ESPECIAL', obtenido: false },
    { id: 'baxia-especial', nombre: 'Baxia: Bar-tender', rareza: 'ESPECIAL', obtenido: false },

    // --- SKINS ÉLITE (20 Núcleos Duplicado) ---
    { id: 'balmond-elite', nombre: 'Balmond: Cazador Salvaje', rareza: 'ELITE', obtenido: false },
    { id: 'vale-elite', nombre: 'Vale: Kannagi', rareza: 'ELITE', obtenido: false },
    { id: 'ruby-elite', nombre: 'Ruby: Mariposa de Orquídea', rareza: 'ELITE', obtenido: false },
    { id: 'grock-elite', nombre: 'Grock: Guardián del Castillo', rareza: 'ELITE', obtenido: false },
    { id: 'lolita-elite', nombre: 'Lolita: Recluta', rareza: 'ELITE', obtenido: false },
    { id: 'lylia-elite', nombre: 'Lylia: Estudiante Estrella', rareza: 'ELITE', obtenido: false },
    { id: 'harith-elite', nombre: 'Harith: Polvo de Estrellas', rareza: 'ELITE', obtenido: false },
    { id: 'karrie-elite', nombre: 'Karrie: Mantis Filosa', rareza: 'ELITE', obtenido: false },
    { id: 'lapu-lapu-elite', nombre: 'Lapu-Lapu: Campeón Imperial', rareza: 'ELITE', obtenido: false },
    { id: 'popol-kupa-elite', nombre: 'Popol y Kupa: Aullido Tribal', rareza: 'ELITE', obtenido: false },
    { id: 'atlas-elite', nombre: 'Atlas: Turbina de Combustible', rareza: 'ELITE', obtenido: false },
    { id: 'carmilla-elite', nombre: 'Carmilla: Chica Maga', rareza: 'ELITE', obtenido: false },
    { id: 'alice-elite', nombre: 'Alice: Alma Heráldica', rareza: 'ELITE', obtenido: false },
    { id: 'argus-elite', nombre: 'Argus: Catástrofe', rareza: 'ELITE', obtenido: false },
    { id: 'bruno-elite', nombre: 'Bruno: Delantero Élite', rareza: 'ELITE', obtenido: false },
    { id: 'akai-elite', nombre: 'Akai: Monje', rareza: 'ELITE', obtenido: false },
    { id: 'cecilion-elite', nombre: 'Cecilion: El Ilusionista', rareza: 'ELITE', obtenido: false },
    { id: 'karina-elite', nombre: 'Karina: Lirio Araña', rareza: 'ELITE', obtenido: false },
    { id: 'barats-elite', nombre: 'Barats: Toy Rex', rareza: 'ELITE', obtenido: false },
    { id: 'khaleed-elite', nombre: 'Khaleed: Cimitarra Creciente', rareza: 'ELITE', obtenido: false },

    // --- SKINS BÁSICAS (10 Núcleos Duplicado) ---
    { id: 'freya-basica', nombre: 'Freya: Rosa Oscura', rareza: 'BASICA', obtenido: false },
    { id: 'harley-basica', nombre: 'Harley: Joker Travieso', rareza: 'BASICA', obtenido: false },
    { id: 'belerick-basica', nombre: 'Belerick: Garra del Tigre', rareza: 'BASICA', obtenido: false },
    { id: 'brody-basica', nombre: 'Brody: Callejero Sin Nombre', rareza: 'BASICA', obtenido: false },
    { id: 'lapu-lapu-basica', nombre: 'Lapu-Lapu: Espada Ancestral', rareza: 'BASICA', obtenido: false },
    { id: 'aurora-basica', nombre: 'Aurora: Trono de la Naturaleza', rareza: 'BASICA', obtenido: false },
    { id: 'chou-basica', nombre: 'Chou: B-boy', rareza: 'BASICA', obtenido: false },
    { id: 'kagura-basica', nombre: 'Kagura: Temporada de Flores', rareza: 'BASICA', obtenido: false },
    { id: 'eudora-basica', nombre: 'Eudora: Labios Rojo Fuego', rareza: 'BASICA', obtenido: false },
    { id: 'bane-basica', nombre: 'Bane: Monstruo de los Mares Profundos', rareza: 'BASICA', obtenido: false },
    { id: 'aldous-basica', nombre: 'Aldous: Manto Rojo', rareza: 'BASICA', obtenido: false },
    { id: 'khufra-basica', nombre: 'Khufra: Búho del Desierto', rareza: 'BASICA', obtenido: false },
    { id: 'minsitthar-basica', nombre: 'Minsitthar: Rey de la Guerra', rareza: 'BASICA', obtenido: false },
    { id: 'irithel-basica', nombre: 'Irithel: Ciclón Plateado', rareza: 'BASICA', obtenido: false },
    { id: 'angela-basica', nombre: 'Angela: Dove&Love', rareza: 'BASICA', obtenido: false },
    { id: 'karrie-basica', nombre: 'Karrie: Estrella Naciente', rareza: 'BASICA', obtenido: false },
    { id: 'roger-basica', nombre: 'Roger: Caballero Oscuro', rareza: 'BASICA', obtenido: false },
    { id: 'lesley-basica', nombre: 'Lesley: Mosquetera Real', rareza: 'BASICA', obtenido: false },
    { id: 'natalia-basica', nombre: 'Natalia: Cuchilla de Cristal', rareza: 'BASICA', obtenido: false },
    { id: 'gord-basica', nombre: 'Gord: Profesor de Infierno', rareza: 'BASICA', obtenido: false },
    { id: 'diggie-basica', nombre: 'Diggie: Palomero', rareza: 'BASICA', obtenido: false },
    { id: 'moskov-basica', nombre: 'Moskov: Lanza de Dragón de Huesos', rareza: 'BASICA', obtenido: false },
    { id: 'lunox-basica', nombre: 'Lunox: Bloody Mary', rareza: 'BASICA', obtenido: false },
    { id: 'leomord-basica', nombre: 'Leomord: Caballero del Infierno', rareza: 'BASICA', obtenido: false },
    { id: 'selena-basica', nombre: 'Selena: Reina Avispa', rareza: 'BASICA', obtenido: false },
    { id: 'claude-basica', nombre: 'Claude: Bala Dorada', rareza: 'BASICA', obtenido: false },
    { id: 'carmilla-basica', nombre: 'Carmilla: Condesa de Wisteria', rareza: 'BASICA', obtenido: false },
    { id: 'yu-zhong-basica', nombre: 'Yu Zhong: Dragón Esmeralda', rareza: 'BASICA', obtenido: false },
    { id: 'esmeralda-basica', nombre: 'Esmeralda: Rubicunda Oscura', rareza: 'BASICA', obtenido: false },
    { id: 'hanzo-basica', nombre: 'Hanzo: El Fantasma Pálido', rareza: 'BASICA', obtenido: false },

    // Categoría de Ítems
    // Emotes (Emojis de Batalla) (3 Núcleos Duplicado)
    { id: 'jajaja', nombre: 'JAJAJA', rareza: 'EMOJI', obtenido: false },
    { id: 'rompe-corazones', nombre: 'Rompe Corazones', rareza: 'EMOJI', obtenido: false },
    { id: 'llevame-hasta-el-final', nombre: 'Llévame hasta el Final', rareza: 'EMOJI', obtenido: false },
    { id: 'ven-y-golpeame', nombre: '¡Ven y golpeame!', rareza: 'EMOJI', obtenido: false },
    { id: 'apartate', nombre: '¡Apártate!', rareza: 'EMOJI', obtenido: false },
    { id: 'hey', nombre: '¡Hey!', rareza: 'EMOJI', obtenido: false },
    { id: 'choca-esos-5', nombre: '¡Choca esos 5!', rareza: 'EMOJI', obtenido: false },
    { id: 'intentalo-de-nuevo', nombre: '¡Inténtalo de nuevo~', rareza: 'EMOJI', obtenido: false },
    { id: 'te-tengo', nombre: '¡Te Tengo!', rareza: 'EMOJI', obtenido: false },
    
    // Otros ítems (0 Núcleos Duplicado)
    { id: 'token-nueva-llegada', nombre: 'Token de Nueva Llegada (3)', rareza: 'OTROS_ITEM', obtenido: false },
    { id: 'carta-doble-exp', nombre: 'Carta Doble EXP (1 Día)', rareza: 'OTROS_ITEM', obtenido: false },
    { id: 'pocion-rueda-magica-s', nombre: 'Poción de Rueda Mágica S', rareza: 'OTROS_ITEM', obtenido: false },
    { id: 'frag-apariencia', nombre: 'Frag. Apariencia(8)', rareza: 'OTROS_ITEM', obtenido: false },
    
];

// =========================================================
// III. FUNCIONES DE UTILIDAD
// =========================================================

/**
 * Actualiza la interfaz del simulador con los valores actuales.
 */
function actualizarUI() {
    // 1. Actualizar contadores
    document.getElementById('moneda-actual').textContent = `${estado.diamantesGastados} Diamantes`;
    document.getElementById('nucleos-actuales-simulador').textContent = `${estado.nucleos}`;
    
    // 2. Actualizar el estado de los botones de descuento
    const btn1x = document.getElementById('tirada-1x');
    const btn10x = document.getElementById('tirada-10x');
    
    // Elementos dentro de los botones
    const costo1xSpan = btn1x.querySelector('.costo-descuento');
    const costo10xSpan = btn10x.querySelector('.costo-descuento');
    const detalle1x = btn1x.querySelector('.detalle-dto');
    
    // --- Tirada 1X ---
    if (!estado.descuento1xUsado) {
        costo1xSpan.textContent = '50';
        btn1x.dataset.costo = 50;
        detalle1x.style.display = 'block'; // Mostrar el DTO
    } else {
        costo1xSpan.textContent = '100';
        btn1x.dataset.costo = 100;
        detalle1x.style.display = 'none'; // Ocultar el DTO
    }
    
    // --- Tirada 10X ---
    if (!estado.descuento10xUsado) {
        costo10xSpan.textContent = '500';
        btn10x.dataset.costo = 500;
    } else {
        costo10xSpan.textContent = '1000';
        btn10x.dataset.costo = 1000;
    }
}
/**
 * Simula una tirada y devuelve la recompensa.
 * @param {boolean} esGarantizada - Si debe garantizar una Especial o mejor (en los primeros 10 tiros).
 */
function generarRecompensa(esGarantizada = false) {
    let recompensa;
    const POOL_PRINCIPAL = POZO_PREMIOS;
    let poolDeSorteo;
    
    // 1. Determinar el Pool a Usar (Garantía vs. Normal)
    if (esGarantizada) {
        // Garantía: Debe ser Especial o mejor
        poolDeSorteo = [
            { nombre: "Legendaria/Doble 11/Collector/LUCKYBOX", coreValor: VALOR_NUCLEOS.LEGENDARIA, probabilidad: 0.00075 },
            { nombre: "Legendaria/Doble 11/Collector/LUCKYBOX", coreValor: VALOR_NUCLEOS.DOBLE_11, probabilidad: 0.00075 },
            { nombre: "Legendaria/Doble 11/Collector/LUCKYBOX", coreValor: VALOR_NUCLEOS.COLLECTOR, probabilidad: 0.00075 },
            { nombre: "Legendaria/Doble 11/Collector/LUCKYBOX", coreValor: VALOR_NUCLEOS.LUCKYBOX, probabilidad: 0.00075 },
            { nombre: "Épica", coreValor: VALOR_NUCLEOS.EPICA, probabilidad: 0.012 },
            { nombre: "Especial", coreValor: VALOR_NUCLEOS.ESPECIAL, probabilidad: 0.15 }
        ];
        
        // Normalizamos las probabilidades para el pool garantizado
        const totalProb = poolDeSorteo.reduce((sum, item) => sum + item.probabilidad, 0);
        
        let rand = Math.random() * totalProb;
        let cumulativeProb = 0;
        
        for (const item of poolDeSorteo) {
            cumulativeProb += item.probabilidad;
            if (rand < cumulativeProb) {
                recompensa = { ...item }; // Copia el objeto para no modificar el pool
                break;
            }
        }
    } else {
        // Lógica de sorteo normal (usando POZO_PREMIOS)
        poolDeSorteo = POOL_PRINCIPAL;
        let rand = Math.random() * 100; // Número aleatorio entre 0 y 100
        let cumulativeProb = 0;
        
        for (const item of poolDeSorteo) {
            cumulativeProb += item.probabilidad;
            if (rand < cumulativeProb) {
                recompensa = { ...item }; // Copia el objeto para no modificar el POZO_PREMIOS
                break;
            }
        }
    }

    // --- 2. Seleccionar el ítem/skin específico basado en la recompensa genérica ---
    
    let rarezaDeterminada = null;
    const coreValorRecompensa = recompensa.coreValor;
    
    // Casos de Skins y Emojis/Ítems (Cualquier cosa con un coreValor > 0 o que no sean Núcleos Directos)
    if (recompensa.nombre.includes('Legendaria/Doble 11/Collector/LUCKYBOX') || 
        recompensa.nombre.includes('Épica') || 
        recompensa.nombre.includes('Especial') || 
        recompensa.nombre.includes('Élite') || 
        recompensa.nombre.includes('Básica') ||
        recompensa.nombre.includes('Emoji de Batalla') || 
        recompensa.nombre.includes('Ítem')) 
    {
        let poolDeItemsAFiltrar = [];
        
        // Determinamos la rareza o grupo de rareza real a buscar en SKINS_DISPONIBLES
        if (coreValorRecompensa === VALOR_NUCLEOS.LEGENDARIA) { // 400
            rarezaDeterminada = 'LEGENDARIA';
        } else if (coreValorRecompensa === VALOR_NUCLEOS.DOBLE_11) { // 200 (Doble 11, Collector, Luckybox)
            rarezaDeterminada = 'RARA_200'; // Agrupamos temporalmente
        } else if (coreValorRecompensa === VALOR_NUCLEOS.EPICA) { // 80
            rarezaDeterminada = 'EPICA';
        } else if (coreValorRecompensa === VALOR_NUCLEOS.ESPECIAL) { // 50
            rarezaDeterminada = 'ESPECIAL';
        } else if (coreValorRecompensa === VALOR_NUCLEOS.ELITE) { // 20
            rarezaDeterminada = 'ELITE';
        } else if (coreValorRecompensa === VALOR_NUCLEOS.BASICA) { // 10
            rarezaDeterminada = 'BASICA';
        } else if (coreValorRecompensa === VALOR_NUCLEOS.EMOJI) { // 3
            rarezaDeterminada = 'EMOJI';
        } else if (coreValorRecompensa === VALOR_NUCLEOS.OTROS_ITEM) { // 0
            rarezaDeterminada = 'OTROS_ITEM';
        }

        // Filtramos el pool específico
        if (rarezaDeterminada === 'RARA_200') {
            // Buscamos en todas las sub-rarezas de 200
            poolDeItemsAFiltrar = SKINS_DISPONIBLES.filter(s => 
                s.rareza === 'DOBLE_11' || 
                s.rareza === 'COLLECTOR' || 
                s.rareza === 'LUCKYBOX'
            );
        } else if (rarezaDeterminada) {
            // Buscamos en la rareza directa (Legendaria, Épica, Elite, Emoji, Ítem, etc.)
            poolDeItemsAFiltrar = SKINS_DISPONIBLES.filter(s => s.rareza === rarezaDeterminada);
        }
        
        // Si hay items para elegir, selecciona uno al azar
        if (poolDeItemsAFiltrar.length > 0) {
            const itemElegido = poolDeItemsAFiltrar[Math.floor(Math.random() * poolDeItemsAFiltrar.length)];

            // Actualizamos la recompensa genérica con los datos del ítem específico
            recompensa.nombre = itemElegido.nombre;
            recompensa.id = itemElegido.id;
            recompensa.rareza = itemElegido.rareza;
            recompensa.obtenido = itemElegido.obtenido; // Estado de obtención del ítem
            
            // Nota: Mantenemos el coreValor que salió del POZO_PREMIOS (400, 200, 3, 0, etc.)
            // que fue determinado por la rareza elegida, asegurando la consistencia.
        } else {
            // En caso de error (e.g., olvidamos agregar skins de una rareza en SKINS_DISPONIBLES),
            // devolvemos Núcleos Directos para no romper la simulación.
            return { nombre: "Núcleos de Polvo Estelar (Error)", coreValor: 50, probabilidad: 100 };
        }
    } 
    // Si la recompensa es "Núcleos de Polvo Estelar (Directo)", no se necesita hacer nada más.
    
    return recompensa;
}

/**
 * Procesa una tirada, actualizando estado, historial y núcleos.
 * @param {Object} recompensa - La recompensa obtenida.
 */
function procesarRecompensa(recompensa) {
    let coresGanados = 0;
    let mensaje = `Obtenido: ${recompensa.nombre}`;
    let isSkin = recompensa.id; 

    if (isSkin) {
        const skinIndex = SKINS_DISPONIBLES.findIndex(s => s.id === recompensa.id);
        const skinInfo = skinIndex !== -1 ? SKINS_DISPONIBLES[skinIndex] : null;
        
        // Usamos el estado interno (skinInfo.obtenido), que ahora está sincronizado por el listener.
        const estaObtenida = skinInfo ? skinInfo.obtenido : false;       
        // La rareza de canje es la definida en SKINS_DISPONIBLES (DOBLE_11, EPICA, etc.)
        const rarezaCanje = skinInfo ? skinInfo.rareza : recompensa.rareza; 

        if (estaObtenida) {
            // Es duplicado
            coresGanados = VALOR_NUCLEOS[rarezaCanje]; 
            mensaje += ` (Duplicado de ${rarezaCanje}) -> Recibes ${coresGanados} Núcleos.`;
        } else {
            let tipoMensaje = 'SKIN';
            if (rarezaCanje === 'EMOJI') {
                tipoMensaje = 'EMOJI';
            } else if (rarezaCanje === 'OTROS_ITEM') {
                tipoMensaje = 'ÍTEM';
            }
            mensaje += ` (¡NUEVO ${tipoMensaje}: ${rarezaCanje}!)`;            
            // *** SOLUCIÓN AL BUG DE CHECKBOX/ESTADO ***
            if (skinInfo) {
                // 1. ACTUALIZAR EL ESTADO GLOBAL DE LA SKIN COMO OBTENIDA
                SKINS_DISPONIBLES[skinIndex].obtenido = true;
            }
            // 2. Marcar la checkbox en la UI
            const checkbox = document.getElementById(`skin-${recompensa.id}`);
            if (checkbox) checkbox.checked = true;
        }
    } else {
        // Recompensa que no es skin (Núcleos Directos, Items, etc.)
        coresGanados = recompensa.coreValor;
        mensaje += ` -> Recibes ${coresGanados} Núcleos.`;
    }

    // Actualizar estado y historial
    estado.nucleos += coresGanados;
    
    const historial = document.getElementById('historial-recompensas');
    const nuevoItem = document.createElement('li');
    nuevoItem.innerHTML = `**Tirada #${estado.tiradasTotales}**: ${mensaje}`;
    historial.prepend(nuevoItem);
}


/**
 * Maneja la lógica de la tirada principal (1x o 10x).
 * @param {number} cantidad - Número de tiradas (1 o 10).
 */
function manejarTirada(cantidad) {
    let costoTotal = 0;

    if (cantidad === 1) {
        // Usa el costo del botón, que se actualiza en actualizarUI()
        costoTotal = +document.getElementById('tirada-1x').dataset.costo; 
        estado.descuento1xUsado = true;
    } else if (cantidad === 10) {
        // Usa el costo del botón, que se actualiza en actualizarUI()
        costoTotal = +document.getElementById('tirada-10x').dataset.costo; 
        estado.descuento10xUsado = true;
    }

    // 1. Actualizar gasto
    estado.diamantesGastados += costoTotal;

    // 2. Ejecutar sorteos
    for (let i = 0; i < cantidad; i++) {
        
        let esGarantizada = false;
        
        // Lógica de Garantía: Especial o mejor en la primera tirada total del evento.
        // También garantiza una Élite cada 10 si se hace un solo tiro.
        if (estado.tiradasTotales === 0 && (cantidad === 1 || cantidad === 10)) { 
            esGarantizada = true;
            // Para la primera tirada (tirada 1)
        } 
        
        // La garantía de 10x (Especial o mejor) solo aplica al primer sorteo del evento (Tirada #1), 
        // pero la interfaz sugiere una garantía fuerte en la primera tirada 10x. 
        // Mantenemos la lógica de que la **primera** tirada global es la garantizada.

        estado.tiradasTotales++;
        estado.tiradasDesdeUltimaEspecial++;

        const recompensa = generarRecompensa(esGarantizada);
        procesarRecompensa(recompensa);
        
        // NO HACEMOS BREAK: Para que el 10x siempre haga las 10 tiradas.
    }
    
    // 3. Actualizar UI
    actualizarUI();
}


// =========================================================
// IV. INICIALIZACIÓN Y LISTENERS
// =========================================================

// =========================================================
// FUNCIONALIDAD: SELECT ALL POR CATEGORIA (UX MEJORADO)
// =========================================================

/**
 * Agrega los listeners a los checkboxes de "Select All" por categoría.
 */
function configurarSelectAllListeners() {
    const selectAllCheckboxes = document.querySelectorAll('.select-all-group input[type="checkbox"]');
    
    selectAllCheckboxes.forEach(selectAllBox => {
        selectAllBox.addEventListener('change', function() {
            // Obtener las categorías asociadas a este checkbox (separadas por coma)
            const categories = this.getAttribute('data-categories').split(',');
            const isChecked = this.checked;

            // Iterar sobre todos los checkboxes individuales de skins
            const individualSkinCheckboxes = document.querySelectorAll('#lista-propiedad-skins input[type="checkbox"]');
            
            individualSkinCheckboxes.forEach(skinBox => {
                // Obtener la categoría de la skin individual usando el atributo data-category
                const skinCategory = skinBox.getAttribute('data-category');

                // Verificar si la categoría de la skin individual está incluida en el grupo
                // y si el skinCategory existe (para evitar errores con elementos sin categoría)
                if (skinCategory && categories.includes(skinCategory)) {
                    
                    // 1. Sincronizar el estado visual en el DOM
                    skinBox.checked = isChecked;
                    
                    // 2. Sincronizar el estado en SKINS_DISPONIBLES (La parte que fallaba)
                    // Eliminamos el prefijo 'skin-' del ID para obtener el ID real de la skin
                    const skinId = skinBox.id.replace('skin-', ''); 
                    
                    const skinIndex = SKINS_DISPONIBLES.findIndex(s => s.id === skinId);
                    
                    if (skinIndex !== -1) {
                        // Actualizamos el estado de la skin en el array global
                        SKINS_DISPONIBLES[skinIndex].obtenido = isChecked;
                    }
                }
            });
        });
    });
}

/**
 * Inicializa el estado y los event listeners.
 */
function iniciarSimulador() {
    // 1. Renderizar la lista de propiedad de skins
    const listaSkins = document.getElementById('lista-propiedad-skins');
    SKINS_DISPONIBLES.forEach((skin, index) => {
        const div = document.createElement('div');
        div.className = 'skin-item';
        div.innerHTML = `
            <input type="checkbox" id="skin-${skin.id}" data-category="${skin.rareza}" ${skin.obtenido ? 'checked' : ''}>
            <label for="skin-${skin.id}">${skin.nombre} (${skin.rareza})</label>    
            `;
        listaSkins.appendChild(div);

        const checkbox = document.getElementById(`skin-${skin.id}`);
        // Listener para la selección individual (Mantiene la sincronización del estado)
        checkbox.addEventListener('change', (e) => {
            SKINS_DISPONIBLES[index].obtenido = e.target.checked;
        });
    });

    // 2. Event Listeners para botones de tirada
    document.getElementById('tirada-1x').addEventListener('click', () => manejarTirada(1));
    document.getElementById('tirada-10x').addEventListener('click', () => manejarTirada(10));

    // 3. Configurar los listeners de "Select All"
    configurarSelectAllListeners();

    // 4. Inicializar la UI
    actualizarUI();
}

// Iniciar el simulador cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', iniciarSimulador);