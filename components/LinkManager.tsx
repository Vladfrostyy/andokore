import React, { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { useAppStore } from '../store';
import { PageBlock, BlockType, AnimationType } from '../types';
import * as Icons from 'lucide-react';
import InputField from './InputField';
import WhiteButton from './WhiteButton';

interface Props {
  className?: string;
}

const BlockEditor: React.FC<{ block: PageBlock; onClose: () => void }> = ({ block, onClose }) => {
  const { updateBlock } = useAppStore();

  const handleAnimationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateBlock(block.id, { animation: e.target.value as AnimationType });
  };

  return (
    <div className="space-y-3 py-2 animate-fade-in">
      {/* --- Common Animation Field --- */}
      <div className="mb-2">
         <label className="text-[10px] uppercase font-bold text-secondary tracking-wider mb-1 block">Emphasis Animation</label>
         <select 
            value={block.animation || 'none'} 
            onChange={handleAnimationChange}
            className="w-full bg-accent rounded-lg text-xs h-8 px-2 border-none outline-none"
         >
             <option value="none">None</option>
             <option value="pulse">Pulse</option>
             <option value="shake">Shake</option>
             <option value="glow">Glow</option>
         </select>
      </div>

      {block.type === 'link' && (
        <>
          <InputField 
            value={block.title} 
            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
            placeholder="Link Title"
            autoFocus
          />
          <InputField 
            value={block.url} 
            onChange={(e) => updateBlock(block.id, { url: e.target.value })}
            placeholder="https://"
          />
          <div className="flex gap-2 mt-2">
            <select 
               className="bg-accent rounded-xl px-3 text-sm h-10 border-none outline-none text-primary w-full"
               value={block.platformTarget || 'all'}
               onChange={(e) => updateBlock(block.id, { platformTarget: e.target.value as any })}
            >
                <option value="all">All Devices</option>
                <option value="ios">iOS Only</option>
                <option value="android">Android Only</option>
            </select>
          </div>
        </>
      )}

      {block.type === 'countdown' && (
        <>
          <InputField 
            value={block.title} 
            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
            placeholder="Event Name"
          />
          <InputField 
            type="datetime-local"
            value={block.targetDate ? block.targetDate.substring(0, 16) : ''} 
            onChange={(e) => updateBlock(block.id, { targetDate: e.target.value })}
          />
        </>
      )}

      {block.type === 'poll' && (
        <>
          <InputField 
            value={block.question} 
            onChange={(e) => updateBlock(block.id, { question: e.target.value })}
            placeholder="Ask a question..."
          />
          <div className="flex gap-2">
            <InputField 
              value={block.optionA} 
              onChange={(e) => updateBlock(block.id, { optionA: e.target.value })}
              placeholder="Option A"
            />
            <InputField 
              value={block.optionB} 
              onChange={(e) => updateBlock(block.id, { optionB: e.target.value })}
              placeholder="Option B"
            />
          </div>
        </>
      )}

      {block.type === 'tip' && (
         <>
           <div className="flex gap-2 mb-2">
             {(['paypal', 'stripe', 'kofi'] as const).map(s => (
                <button
                   key={s}
                   onClick={() => updateBlock(block.id, { service: s })}
                   className={`px-3 py-1 text-xs rounded-full border ${block.service === s ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-border'}`}
                >
                    {s}
                </button>
             ))}
           </div>
           <InputField 
            value={block.username} 
            onChange={(e) => updateBlock(block.id, { username: e.target.value })}
            placeholder={`Your ${block.service} username/email`}
          />
         </>
      )}

      {block.type === 'image' && (
          <>
            <InputField 
                value={block.url} 
                onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                placeholder="Image URL"
            />
            <InputField 
                value={block.caption || ''} 
                onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                placeholder="Caption (Optional)"
            />
          </>
      )}

      {block.type === 'gallery' && (
          <div className="space-y-2">
              <label className="text-xs font-medium text-secondary">Image URLs (comma separated for demo)</label>
              <textarea
                  className="w-full p-2 bg-accent rounded-xl text-sm border-none outline-none"
                  value={block.images.join(', ')}
                  onChange={(e) => updateBlock(block.id, { images: e.target.value.split(',').map(s => s.trim()) })}
                  rows={3}
              />
          </div>
      )}

      {block.type === 'copy' && (
          <>
            <InputField 
                value={block.label} 
                onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                placeholder="Label (e.g. Promo Code)"
            />
            <InputField 
                value={block.content} 
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Text to copy"
            />
          </>
      )}

      {block.type === 'vcard' && (
          <>
            <InputField 
                value={block.buttonLabel} 
                onChange={(e) => updateBlock(block.id, { buttonLabel: e.target.value })}
                placeholder="Button Label"
            />
            <InputField 
                value={block.fullName} 
                onChange={(e) => updateBlock(block.id, { fullName: e.target.value })}
                placeholder="Full Name"
            />
            <div className="flex gap-2">
                <InputField 
                    value={block.phone || ''} 
                    onChange={(e) => updateBlock(block.id, { phone: e.target.value })}
                    placeholder="Phone"
                />
                <InputField 
                    value={block.email || ''} 
                    onChange={(e) => updateBlock(block.id, { email: e.target.value })}
                    placeholder="Email"
                />
            </div>
          </>
      )}

      <div className="flex justify-end pt-2">
        <WhiteButton onClick={onClose} size="sm" className="h-8 text-xs">Done</WhiteButton>
      </div>
    </div>
  );
};

const BlockCard: React.FC<{ block: PageBlock }> = ({ block }) => {
  const controls = useDragControls();
  const { removeBlock, toggleBlockVisibility } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);

  const getIcon = () => {
    switch (block.type) {
      case 'link': return <Icons.Link size={18} />;
      case 'countdown': return <Icons.Timer size={18} />;
      case 'poll': return <Icons.BarChartBig size={18} />;
      case 'tip': return <Icons.HeartHandshake size={18} />;
      case 'image': return <Icons.Image size={18} />;
      case 'gallery': return <Icons.Images size={18} />;
      case 'copy': return <Icons.Copy size={18} />;
      case 'vcard': return <Icons.Contact size={18} />;
      default: return <Icons.Box size={18} />;
    }
  };

  const getLabel = () => {
      switch (block.type) {
          case 'link': return block.title;
          case 'countdown': return `Timer: ${block.title}`;
          case 'poll': return `Poll: ${block.question}`;
          case 'tip': return `Tip Jar (${block.service})`;
          case 'image': return 'Image Banner';
          case 'gallery': return `Gallery (${block.images.length} images)`;
          case 'copy': return `Copy: ${block.label}`;
          case 'vcard': return `Contact: ${block.fullName}`;
      }
  }

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={controls}
      className="bg-white rounded-2xl border border-border p-4 mb-3 shadow-sm select-none relative group"
      whileDrag={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div 
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab active:cursor-grabbing p-2 mt-1 hover:bg-accent rounded-lg text-secondary opacity-50 group-hover:opacity-100 transition-opacity"
        >
          <Icons.GripVertical size={16} />
        </div>

        {/* Content */}
        <div className="flex-1">
          {isEditing ? (
             <BlockEditor block={block} onClose={() => setIsEditing(false)} />
          ) : (
            <div onClick={() => setIsEditing(true)} className="cursor-pointer py-2">
              <div className="flex items-center gap-2 mb-1">
                 <div className="text-secondary">{getIcon()}</div>
                 <h3 className="font-semibold text-primary text-sm">{getLabel() || "Untitled Block"}</h3>
              </div>
              {block.animation && block.animation !== 'none' && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 px-2 py-0.5 rounded-full text-purple-600 border border-purple-100 uppercase font-bold tracking-wider">
                      <Icons.Sparkles size={10} /> {block.animation}
                  </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
             <div className="flex items-center gap-1">
                <button 
                 onClick={() => toggleBlockVisibility(block.id)}
                 className={`p-2 rounded-full transition-colors ${block.visible ? 'text-green-600 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-50'}`}
               >
                 {block.visible ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
               </button>
               <button 
                 onClick={() => removeBlock(block.id)}
                 className="p-2 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
               >
                 <Icons.Trash2 size={16} />
               </button>
             </div>
        )}
      </div>
    </Reorder.Item>
  );
};

const LinkManager: React.FC<Props> = ({ className }) => {
  const { blocks, reorderBlocks, addBlock } = useAppStore();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleAdd = (type: BlockType) => {
      addBlock(type);
      setShowAddMenu(false);
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-primary">Content Blocks</h2>
        <div className="relative">
             <WhiteButton onClick={() => setShowAddMenu(!showAddMenu)} icon={<Icons.Plus size={16} />}>
                Add Block
             </WhiteButton>
             {showAddMenu && (
                 <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl border border-border z-20 overflow-hidden animate-fade-in flex flex-col">
                     <div className="p-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Basics</div>
                     <button onClick={() => handleAdd('link')} className="text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-primary"><Icons.Link size={14} /> Link</button>
                     <button onClick={() => handleAdd('copy')} className="text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-primary"><Icons.Copy size={14} /> Copy Text</button>
                     <button onClick={() => handleAdd('vcard')} className="text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-primary"><Icons.Contact size={14} /> Save Contact</button>
                     
                     <div className="p-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-t border-gray-100">Media</div>
                     <button onClick={() => handleAdd('image')} className="text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-primary"><Icons.Image size={14} /> Image</button>
                     <button onClick={() => handleAdd('gallery')} className="text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-primary"><Icons.Images size={14} /> Gallery</button>

                     <div className="p-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-t border-gray-100">Widgets</div>
                     <button onClick={() => handleAdd('countdown')} className="text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-primary"><Icons.Timer size={14} /> Countdown</button>
                     <button onClick={() => handleAdd('poll')} className="text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-primary"><Icons.BarChartBig size={14} /> Poll</button>
                     <button onClick={() => handleAdd('tip')} className="text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-primary"><Icons.HeartHandshake size={14} /> Tip Jar</button>
                 </div>
             )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar pb-20">
        <Reorder.Group axis="y" values={blocks} onReorder={reorderBlocks}>
          {blocks.map((block) => (
            <BlockCard key={block.id} block={block} />
          ))}
        </Reorder.Group>
        
        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-secondary border-2 border-dashed border-border rounded-xl">
            <p>No blocks yet.</p>
            <p className="text-sm opacity-60">Add content to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkManager;