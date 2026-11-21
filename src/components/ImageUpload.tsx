'use client';

import React, { useState, useRef } from 'react';
import { uploadToImgBB } from '@/lib/imgbb';
import { UploadCloud, Image as ImageIcon, CheckCircle2, Loader2, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  shape?: 'circle' | 'rounded';
  aspectRatio?: 'square' | 'video' | 'banner';
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Upload Photo',
  helperText = 'PNG, JPG, WebP up to 5MB (automatically hosted)',
  shape = 'rounded',
  aspectRatio = 'square',
  required = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be less than 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadToImgBB(file);
      onChange(uploadedUrl);
      toast.success('Photo uploaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine styling based on shape & aspect ratio
  const isCircle = shape === 'circle';
  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-[16/9]'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9]'
      : 'aspect-square';

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {value ? (
        /* Preview with Replace / Remove controls */
        <div
          className={`relative group overflow-hidden border-2 border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 transition-all ${
            isCircle ? 'w-24 h-24 rounded-full mx-auto' : `w-full max-w-sm rounded-2xl ${aspectClass}`
          }`}
        >
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2">
              <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-1" />
              <span className="text-[10px] font-bold">Uploading...</span>
            </div>
          )}

          {!isUploading && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl bg-white/90 text-stone-900 hover:bg-white text-xs font-bold shadow-md flex items-center gap-1 cursor-pointer"
                title="Change Photo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {!isCircle && <span>Change</span>}
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="p-2 rounded-xl bg-red-600/90 text-white hover:bg-red-600 text-xs font-bold shadow-md cursor-pointer"
                title="Remove Photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Dropzone uploader */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
              : 'border-stone-300 dark:border-stone-700 hover:border-red-400 dark:hover:border-red-500/50 bg-stone-50/50 dark:bg-stone-900/40 hover:bg-stone-100/50 dark:hover:bg-stone-800/40'
          } ${isCircle ? 'w-28 h-28 rounded-full mx-auto' : 'w-full max-w-sm'}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-red-600" />
              <p className="text-xs font-bold text-stone-600 dark:text-stone-300">
                Uploading photo...
              </p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shadow-xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Click to select photo <span className="font-normal text-stone-400">or drag here</span>
                </p>
                {helperText && !isCircle && (
                  <p className="text-[11px] text-stone-400 mt-0.5">{helperText}</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
