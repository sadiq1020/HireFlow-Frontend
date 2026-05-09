'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Camera, CheckCircle, Loader2, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

// ─── Props ────────────────────────────────────────────────────────────────────
interface ImageUploaderProps {
  // Current image URL from the database
  currentImage?: string;
  // Fallback content when no image (initials, icon, etc.)
  fallback: React.ReactNode;
  // Called with the new Cloudinary URL after a successful upload
  onUploadSuccess: (url: string) => void;
  // Shape of the preview area
  shape?: 'circle' | 'rounded';
  // Size of the preview in px
  size?: number;
  // Upload folder in Cloudinary (e.g. 'hireflow/avatars', 'hireflow/logos')
  folder?: string;
  // Label shown below the upload button
  label?: string;
}

// ─── Next.js API route that signs the upload ──────────────────────────────────
async function getUploadSignature(folder: string): Promise<{
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
}> {
  const res = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  });
  if (!res.ok) throw new Error('Failed to get upload signature');
  return res.json();
}

// ─── Upload file directly to Cloudinary ──────────────────────────────────────
async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const { signature, timestamp, apiKey, cloudName } = await getUploadSignature(folder);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key', apiKey);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url as string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ImageUploader({
  currentImage,
  fallback,
  onUploadSuccess,
  shape = 'rounded',
  size = 80,
  folder = 'hireflow/uploads',
  label,
}: ImageUploaderProps) {
  const [preview, setPreview]         = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging]   = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const displayImage = preview || currentImage;
  const borderRadius = shape === 'circle' ? '9999px' : '16px';

  const handleFile = async (file: File) => {
    // Validate
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setError('');
    setSuccess(false);

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload to Cloudinary
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, folder);
      onUploadSuccess(url);
      setPreview(url); // replace object URL with permanent URL
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Upload failed. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess('');
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-4">
        {/* ── Image preview ── */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{
            width: size,
            height: size,
            borderRadius,
            background: 'linear-gradient(135deg, oklch(50% 0.25 285 / 0.15), oklch(60% 0.2 310 / 0.1))',
            border: isDragging
              ? '2px dashed oklch(55% 0.25 285)'
              : '2px solid oklch(50% 0.25 285 / 0.2)',
            transition: 'border-color 0.2s',
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {/* Image or fallback */}
          {displayImage ? (
            <Image
              src={displayImage}
              alt="Uploaded image"
              fill
              className="object-cover"
              unoptimized={displayImage.startsWith('blob:')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {fallback}
            </div>
          )}

          {/* Uploading overlay */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'oklch(0% 0 0 / 0.6)' }}
              >
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success flash */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'oklch(65% 0.25 145 / 0.35)' }}
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Camera button */}
          {!isUploading && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => inputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center shadow-lg cursor-pointer transition-colors"
              style={{
                background: 'linear-gradient(135deg, oklch(52% 0.26 285), oklch(58% 0.22 305))',
              }}
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </motion.button>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'oklch(50% 0.25 285 / 0.1)',
              color: 'oklch(65% 0.2 285)',
              border: '1px solid oklch(50% 0.25 285 / 0.25)',
            }}
          >
            {isUploading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" />Uploading…</>
            ) : (
              <><Upload className="w-3.5 h-3.5" />{displayImage ? 'Change' : 'Upload'}</>
            )}
          </motion.button>

          {displayImage && !isUploading && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRemove}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: 'oklch(50% 0.25 25 / 0.08)',
                color: 'oklch(60% 0.2 25)',
                border: '1px solid oklch(50% 0.2 25 / 0.2)',
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </motion.button>
          )}
        </div>
      </div>

      {/* Label + constraints */}
      <div className="space-y-0.5">
        {label && (
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        )}
        <p className="text-[11px] text-muted-foreground/60">
          JPG, PNG, WebP · Max 5MB · Drag & drop supported
        </p>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs text-destructive"
          >
            <X className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}