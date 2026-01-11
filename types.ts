export type BlockType = 'link' | 'countdown' | 'poll' | 'tip' | 'image' | 'gallery' | 'copy' | 'vcard';
export type AnimationType = 'none' | 'pulse' | 'shake' | 'glow';

export interface BaseBlock {
  id: string;
  type: BlockType;
  visible: boolean;
  animation?: AnimationType;
  // Smart Logic
  scheduleStart?: string; // ISO date string
  scheduleEnd?: string; // ISO date string
  platformTarget?: 'all' | 'ios' | 'android';
}

export interface LinkBlock extends BaseBlock {
  type: 'link';
  title: string;
  url: string;
  icon: string; // Icon name from Lucide
}

export interface CountdownBlock extends BaseBlock {
  type: 'countdown';
  targetDate: string;
  title: string;
}

export interface PollBlock extends BaseBlock {
  type: 'poll';
  question: string;
  optionA: string;
  optionB: string;
}

export interface TipBlock extends BaseBlock {
  type: 'tip';
  service: 'paypal' | 'stripe' | 'kofi';
  username: string;
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    url: string;
    alt?: string;
    caption?: string;
}

export interface GalleryBlock extends BaseBlock {
    type: 'gallery';
    images: string[]; // URLs
}

export interface CopyBlock extends BaseBlock {
    type: 'copy';
    label: string;
    content: string; // Text to copy
    successMessage?: string;
}

export interface VCardBlock extends BaseBlock {
    type: 'vcard';
    fullName: string;
    phone?: string;
    email?: string;
    buttonLabel: string;
}

export type PageBlock = LinkBlock | CountdownBlock | PollBlock | TipBlock | ImageBlock | GalleryBlock | CopyBlock | VCardBlock;

export interface UserProfile {
  displayName: string;
  bio: string;
  avatarUrl: string;
}

export interface ThemeSettings {
  preset: 'classic' | 'soft' | 'glass';
  borderRadius: number; // 0 - 30
  shadowOpacity: number; // 0 - 0.2
  shadowBlur: number; // 0 - 60 (px)
  buttonTransparency: number; // 0 - 1 (1 is opaque)
  fontHeader: string;
  fontBody: string;
  // Background Engine
  backgroundType: 'color' | 'image' | 'video' | 'gradient';
  backgroundValue: string; // Hex color, Image URL, Video URL, or Gradient CSS
  backgroundBlur: number; // 0 - 20px
  backgroundOverlayOpacity: number; // 0 - 0.9 (Dimmer)
  backgroundTexture: 'none' | 'noise' | 'dots';
}

export interface SEOSettings {
  pageTitle: string;
  metaDescription: string;
}

export interface AppState {
  profile: UserProfile;
  blocks: PageBlock[];
  theme: ThemeSettings;
  seo: SEOSettings;
  
  setProfile: (profile: Partial<UserProfile>) => void;
  setSEO: (seo: Partial<SEOSettings>) => void;
  
  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, data: Partial<PageBlock>) => void;
  removeBlock: (id: string) => void;
  toggleBlockVisibility: (id: string) => void;
  reorderBlocks: (newBlocks: PageBlock[]) => void;
  
  setTheme: (theme: Partial<ThemeSettings>) => void;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}