import React, { useState, useRef } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import ImageCropper from "../shared/imageCropper";

export interface NewSkill {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  creditsHour: number;
  tags: string[];
  image?: string; 
}

interface SkillAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (skill: NewSkill, file?: Blob) => void;
}

interface FormDataState {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  creditsHour: string;
  tags: string[];
  tagInput: string;
}

const categories = ["Technology", "Languages", "Music", "Fitness", "Creative", "Professional", "Business"];
const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export default function SkillAddModal({ isOpen, onClose, onSubmit }: SkillAddModalProps) {
  const [formData, setFormData] = useState<FormDataState>({
    title: "", description: "", category: "", level: "", duration: "", creditsHour: "", tags: [], tagInput: "",
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null); 
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (cat: string) => {
    setFormData((prev) => ({ ...prev, category: cat }));
    setShowCategoryDropdown(false);
  };

  const handleLevelSelect = (lv: string) => {
    setFormData((prev) => ({ ...prev, level: lv }));
    setShowLevelDropdown(false);
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: "",
      }));
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedImage(reader.result?.toString() || null);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setCroppedImageBlob(croppedBlob);
    setPreviewUrl(URL.createObjectURL(croppedBlob));
    setShowCropper(false);
  };

  const handleRemoveImage = () => {
    setCroppedImageBlob(null);
    setPreviewUrl(null);
    setSelectedImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credits = Number.parseInt(formData.creditsHour, 10) || 0;
    const payload: NewSkill = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      level: formData.level,
      duration: formData.duration,
      creditsHour: credits,
      tags: formData.tags,
      image: previewUrl || undefined,
    };
    onSubmit(payload, croppedImageBlob || undefined);
    
    setFormData({
        title: "", description: "", category: "", level: "", 
        duration: "", creditsHour: "", tags: [], tagInput: ""
    });
    handleRemoveImage();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
          <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 z-10">
            <h2 className="text-lg font-bold text-gray-900">Add New Skill</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm focus:border-blue-500 outline-none" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">Category</label>
                    <div className="relative">
                        <button type="button" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="w-full text-left border-2 border-gray-300 rounded-lg px-4 py-3 text-sm">
                            {formData.category || "Select"}
                        </button>
                        {showCategoryDropdown && (
                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-auto">
                                {categories.map(c => (
                                    <div key={c} onClick={() => handleCategorySelect(c)} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">{c}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">Level</label>
                    <div className="relative">
                        <button type="button" onClick={() => setShowLevelDropdown(!showLevelDropdown)} className="w-full text-left border-2 border-gray-300 rounded-lg px-4 py-3 text-sm">
                            {formData.level || "Select"}
                        </button>
                        {showLevelDropdown && (
                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                                {levels.map(l => (
                                    <div key={l} onClick={() => handleLevelSelect(l)} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">Duration</label>
                    <input type="text" name="duration" value={formData.duration} onChange={handleChange} required className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">Credits/Hour</label>
                    <input type="number" name="creditsHour" value={formData.creditsHour} onChange={handleChange} required min="0" className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500" />
                </div>
            </div>

            <div>
               <label className="mb-2 block text-sm font-bold text-gray-900">Tags</label>
               <div className="flex gap-2">
                   <input type="text" name="tagInput" value={formData.tagInput} onChange={handleChange} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500" placeholder="Add tag" />
                   <button type="button" onClick={handleAddTag} className="bg-gray-900 text-white px-4 rounded-lg text-sm">Add</button>
               </div>
               <div className="flex flex-wrap gap-2 mt-2">
                   {formData.tags.map((t, i) => (
                       <span key={i} className="bg-gray-200 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                           {t} <button type="button" onClick={() => handleRemoveTag(i)}>&times;</button>
                       </span>
                   ))}
               </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">Skill Image</label>
              {!previewUrl ? (
                <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center text-sm transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
                  <input ref={fileInputRef} id="file-upload" type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                  <label htmlFor="file-upload" className="block cursor-pointer">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-gray-600">Click or drag to upload skill image</p>
                  </label>
                </div>
              ) : (
                <div className="relative mt-2 w-full h-48 rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              )}
            </div>

            <div className="flex gap-4 border-t border-gray-200 pt-6">
              <button type="button" onClick={onClose} className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50">Cancel</button>
              <button type="submit" className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700">Publish Skill</button>
            </div>
          </form>
        </div>
      </div>

      {showCropper && selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCancel={() => { setShowCropper(false); setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
          onCropComplete={handleCropComplete}
          aspect={16 / 9}
        />
      )}
    </>
  );
}