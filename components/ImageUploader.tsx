import React, { useRef, useState, useEffect } from 'react';
import { X, Image as ImageIcon, Camera } from 'lucide-react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  image: ImageFile | null;
  onImageChange: (image: ImageFile | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onImageChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera", err);
      alert("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Flip horizontally if using front camera for mirror effect
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        
        onImageChange({
          base64,
          mimeType: 'image/jpeg',
          previewUrl: dataUrl
        });
        stopCamera();
      }
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
  };

  // If camera is open, show video feed
  if (isCameraOpen) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4] flex flex-col">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover transform -scale-x-100" 
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
          <button 
            onClick={stopCamera}
            className="p-3 text-white bg-white/10 rounded-full backdrop-blur-md"
          >
            <X size={24} />
          </button>
          <button 
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full border-4 border-white bg-transparent flex items-center justify-center relative hover:bg-white/20 transition-colors"
          >
            <div className="w-12 h-12 bg-white rounded-full" />
          </button>
          <div className="w-12" /> {/* Spacer for centering */}
        </div>
      </div>
    );
  }

  // If image exists, show preview
  if (image) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
         <div className="aspect-[3/4] relative group">
            <img 
              src={image.previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
               <button 
                onClick={clearImage}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Remove image"
              >
                <X size={20} />
              </button>
            </div>
         </div>
         <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm font-medium text-green-600 flex items-center gap-1.5">
              <ImageIcon size={16} /> Photo Ready
            </p>
            <button onClick={clearImage} className="text-xs text-gray-500 underline hover:text-gray-700">
              Retake
            </button>
         </div>
      </div>
    );
  }

  // Default: Show ONLY Camera option
  return (
    <div className="space-y-3">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors h-[300px] text-center"
        onClick={startCamera}
      >
        <div className="bg-blue-100 p-4 rounded-full text-blue-600 animate-pulse">
          <Camera size={32} />
        </div>
        <div>
           <h3 className="text-lg font-bold text-gray-900">Take a Selfie</h3>
           <p className="text-sm text-gray-500 mt-1">Open camera to snap your photo</p>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        We only use your photo to generate the facial likeness.
      </p>
    </div>
  );
};

export default ImageUploader;
