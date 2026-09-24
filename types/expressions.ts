export type UniversalEmotion =
    | 'alegria'
    | 'tristeza'
    | 'raiva'
    | 'medo'
    | 'surpresa'
    | 'nojo'
    | 'desprezo';

export interface EmotionDefinition {
    id: UniversalEmotion;
    label: string;
    description: string;
    keyFeatures: string[];
    actionUnits: string[];
    iconName?: string;
}

export const UNIVERSAL_EMOTIONS: EmotionDefinition[] = [
{
    id: 'alegria',
    label: 'Alegria',
    description: 'Sorriso genuíno (Duchenne) com elevação das maçãs do rosto e contração orbicular.',
    actionUnits: ['AU6 (Elevação da bochecha)', 'AU12 (Puxador do canto dos lábios)'],
    keyFeatures: ['Elevação dos cantos dos lábios', 'Rugas sutis ao redor dos olhos'],
  },
  {
    id: 'tristeza',
    label: 'Tristeza',
    description: 'Aproximação das sobrancelhas internas e abaixamento dos cantos bucais.',
    actionUnits: ['AU1 (Elevação interna da sobrancelha)', 'AU4 (Abaixador da sobrancelha)', 'AU15 (Depressor do canto da boca)'],
    keyFeatures: ['Cantos da boca voltados para baixo', 'Tensão no queixo e centro da testa'],
  },
  {
    id: 'raiva',
    label: 'Raiva',
    description: 'Sobrancelhas baixas e unidas, tensão nas pálpebras e compressão labial.',
    actionUnits: ['AU4 (Abaixador da sobrancelha)', 'AU7 (Tensionador das pálpebras)', 'AU23/24 (Compressor dos lábios)'],
    keyFeatures: ['Sobrancelhas aproximadas e tensas', 'Lábios estreitados ou cerrados'],
  },
  {
    id: 'medo',
    label: 'Medo',
    description: 'Olhos arregalados, sobrancelhas retificadas/elevadas e boca aberta lateralmente.',
    actionUnits: ['AU1 (Elevação interna da sobrancelha)', 'AU2 (Elevação externa)', 'AU5 (Elevação da pálpebra superior)', 'AU20 (Estirador dos lábios)'],
    keyFeatures: ['Abertura ocular ampla', 'Boca esticada horizontalmente'],
  },
  {
    id: 'nojo',
    label: 'Nojo',
    description: 'Franzimento evidente do dorso nasal e tração do lábio superior.',
    actionUnits: ['AU9 (Levantador da asa do nariz)', 'AU10 (Levantador do lábio superior)'],
    keyFeatures: ['Rugas verticais no nariz', 'Elevação do lábio superior'],
  },
  {
    id: 'surpresa',
    label: 'Surpresa',
    description: 'Arqueamento suave das sobrancelhas, olhos bem abertos e mandíbula relaxada.',
    actionUnits: ['AU1 (Elevação interna)', 'AU2 (Elevação externa)', 'AU5 (Elevação palpebral)', 'AU26 (Abertura mandibular)'],
    keyFeatures: ['Sobrancelhas em arco', 'Abertura limpa da boca sem tensão labial'],
  },
  {
    id: 'desprezo',
    label: 'Desprezo',
    description: 'Assimetria labial característica com leve contração em apenas um dos cantos.',
    actionUnits: ['AU14 Unilateral (Covinha / Tensão unilateral da comissura)'],
    keyFeatures: ['Sorriso unilateral assimétrico', 'Tensão concentrada em um só lado'],
  },
];


export type ExpressionIntensityLevel = 1 | 2 | 3 | 4;

export interface IntensityDefinition {
  level: ExpressionIntensityLevel;
  label: string;
  description: string;
}

export const INTENSITY_LEVELS: IntensityDefinition[] = [
  { level: 1, label: 'Sutil', description: 'Ativação inicial leve da musculatura' },
  { level: 2, label: 'Moderado', description: 'Expressão nítida e equilibrada' },
  { level: 3, label: 'Forte', description: 'Contração evidente e pronunciada' },
  { level: 4, label: 'Máximo', description: 'Pico extremo de ativação facial' },
];