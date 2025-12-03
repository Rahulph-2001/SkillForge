import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Trash2, Search, Loader2 } from "lucide-react";
import ImageCropper from "../shared/imageCropper";
import { skillTemplateService, SkillTemplate } from "../../services/skillTemplateService";

export interface NewSkill {
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsHour: number;
  tags: string[];
  image?: string;
  templateId?: string;
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
  durationHours: string;
  creditsHour: string;
  tags: string[];
  tagInput: string;
  templateId: string;
}

const categories = ["Technology", "Languages", "Music", "Fitness", "Creative", "Professional", "Business"];
const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const durationOptions = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SkillAddModal({ isOpen, onClose, onSubmit }: SkillAddModalProps) {
  const [formData, setFormData] = useState<FormDataState>({
    title: "", description: "", category: "", level: "", durationHours: "", creditsHour: "", tags: [], tagInput: "", templateId: "",
  });

  const [skillTemplates, setSkillTemplates] = useState<SkillTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<SkillTemplate[]>([]);
  const [templateSearch, setTemplateSearch] = useState("");
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null); 
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fetch skill templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const response = await skillTemplateService.getAllActive();
        setSkillTemplates(response.data.data || []);
        setFilteredTemplates(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch skill templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  // Filter templates based on search
  useEffect(() => {
    if (templateSearch.trim() === "") {
      setFilteredTemplates(skillTemplates);
    } else {
      const filtered = skillTemplates.filter(template =>
        template.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
        template.category.toLowerCase().includes(templateSearch.toLowerCase())
      );
      setFilteredTemplates(filtered);
    }
  }, [templateSearch, skillTemplates]);

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

  const handleDurationSelect = (hours: number) => {
    setFormData((prev) => ({ ...prev, durationHours: hours.toString() }));
    setShowDurationDropdown(false);
  };

  const handleTemplateSelect = (template: SkillTemplate) => {
    setFormData((prev) => ({
      ...prev,
      templateId: template.id,
      category: template.category,
      title: template.title,
      description: template.description,
    }));
    setShowTemplateDropdown(false);
    setTemplateSearch("");
  };

  const getSelectedTemplate = () => {
    return skillTemplates.find(t => t.id === formData.templateId);
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
    const hours = Number.parseInt(formData.durationHours, 10) || 1;
    const payload: NewSkill = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      level: formData.level,
      durationHours: hours,
      creditsHour: credits,
      tags: formData.tags,
      image: previewUrl || undefined,
      templateId: formData.templateId || undefined,
    };
    onSubmit(payload, croppedImageBlob || undefined);
    
    setFormData({
        title: "", description: "", category: "", level: "", 
        durationHours: "", creditsHour: "", tags: [], tagInput: "", templateId: ""
    });
    setTemplateSearch("");
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
            {/* Skill Template Selection */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">Select Skill Template (Optional)</label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    onFocus={() => setShowTemplateDropdown(true)}
                    placeholder="Search skill templates..."
                    className="w-full rounded-lg border-2 border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                {showTemplateDropdown && (
                  <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
                    {loadingTemplates ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-gray-600">Loading templates...</span>
                      </div>
                    ) : filteredTemplates.length > 0 ? (
                      filteredTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 ${
                            formData.templateId === template.id ? 'bg-blue-100' : ''
                          }`}
                        >
                          <div className="font-medium text-sm text-gray-900">{template.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{template.category} • {template.levels.join(', ')}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No templates found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {getSelectedTemplate() && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">{getSelectedTemplate()?.title}</p>
                    <p className="text-xs text-blue-700">Template selected - fields auto-filled</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, templateId: '', title: '', description: '', category: '' }));
                      setTemplateSearch('');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

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
                    <label className="mb-2 block text-sm font-bold text-gray-900">Duration (Hours) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <button type="button" onClick={() => setShowDurationDropdown(!showDurationDropdown)} className="w-full text-left border-2 border-gray-300 rounded-lg px-4 py-3 text-sm">
                            {formData.durationHours ? `${formData.durationHours} hour${formData.durationHours !== '1' ? 's' : ''}` : "Select hours"}
                        </button>
                        {showDurationDropdown && (
                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-auto">
                                {durationOptions.map(hours => (
                                    <div key={hours} onClick={() => handleDurationSelect(hours)} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                                        {hours} hour{hours !== 1 ? 's' : ''}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">Credits/Hour <span className="text-red-500">*</span></label>
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