import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, PageBlock, BlockType } from './types';
import { v4 as uuidv4 } from 'uuid';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: {
        displayName: 'TapBio Creator',
        bio: 'Digital Creator & Minimalist',
        avatarUrl: 'https://picsum.photos/200',
      },
      blocks: [
        { id: '1', type: 'link', title: 'My Portfolio', url: 'https://example.com', icon: 'Globe', visible: true, platformTarget: 'all', animation: 'none' },
        { id: '2', type: 'countdown', title: 'Next Drop', targetDate: new Date(Date.now() + 86400000 * 3).toISOString(), visible: true, animation: 'none' },
        { id: '3', type: 'image', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80', visible: true, animation: 'none' },
        { id: '4', type: 'tip', service: 'kofi', username: 'andokore', visible: true, animation: 'pulse' },
      ],
      theme: {
        preset: 'classic',
        borderRadius: 16,
        shadowOpacity: 0.05,
        shadowBlur: 20,
        buttonTransparency: 1,
        fontHeader: 'sans',
        fontBody: 'sans',
        backgroundType: 'color',
        backgroundValue: '#FFFFFF',
        backgroundBlur: 0,
        backgroundOverlayOpacity: 0,
        backgroundTexture: 'none',
      },
      seo: {
        pageTitle: 'TapBio',
        metaDescription: 'Check out my links and updates.',
      },

      setProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
      setSEO: (data) => set((state) => ({ seo: { ...state.seo, ...data } })),
      
      addBlock: (type: BlockType) => set((state) => {
        let newBlock: PageBlock;
        const id = uuidv4();
        const base = { id, visible: true, animation: 'none' as const };
        
        switch (type) {
          case 'link':
            newBlock = { ...base, type: 'link', title: 'New Link', url: '', icon: 'Link', platformTarget: 'all' };
            break;
          case 'countdown':
            newBlock = { ...base, type: 'countdown', title: 'Coming Soon', targetDate: new Date().toISOString() };
            break;
          case 'poll':
            newBlock = { ...base, type: 'poll', question: 'What should I create next?', optionA: 'Video', optionB: 'Blog Post' };
            break;
          case 'tip':
            newBlock = { ...base, type: 'tip', service: 'kofi', username: '' };
            break;
          case 'image':
            newBlock = { ...base, type: 'image', url: 'https://placehold.co/600x400', caption: '' };
            break;
          case 'gallery':
            newBlock = { ...base, type: 'gallery', images: ['https://placehold.co/400', 'https://placehold.co/400'] };
            break;
          case 'copy':
            newBlock = { ...base, type: 'copy', label: 'Promo Code', content: 'SAVE20', successMessage: 'Copied!' };
            break;
          case 'vcard':
            newBlock = { ...base, type: 'vcard', fullName: 'John Doe', buttonLabel: 'Save Contact', phone: '', email: '' };
            break;
          default:
            return state;
        }

        return { blocks: [...state.blocks, newBlock] };
      }),

      updateBlock: (id, data) => set((state) => ({
        blocks: state.blocks.map((b) => b.id === id ? { ...b, ...data } as PageBlock : b)
      })),

      removeBlock: (id) => set((state) => ({
        blocks: state.blocks.filter((b) => b.id !== id)
      })),

      toggleBlockVisibility: (id) => set((state) => ({
        blocks: state.blocks.map((b) => b.id === id ? { ...b, visible: !b.visible } : b)
      })),

      reorderBlocks: (newBlocks) => set({ blocks: newBlocks }),

      setTheme: (data) => set((state) => ({ theme: { ...state.theme, ...data } })),
    }),
    {
      name: 'andokore-storage',
    }
  )
);