import React, { useState } from 'react';
import { QrCode, Download, Copy, Check } from 'lucide-react';
import Button from './Button';
import { copyToClipboard } from '../../utils/helpers';

const QRCode = ({ 
  value, 
  size = 200, 
  className = '',
  showDownload = true,
  showCopy = true,
  title = 'QR Code'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    // Create a canvas element to generate the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    // Simple QR code generation (in a real app, you'd use a proper QR library)
    // For now, we'll create a placeholder
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 10, size - 20, size - 20);
    
    // Add some pattern to make it look like a QR code
    for (let i = 0; i < size; i += 20) {
      for (let j = 0; j < size; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(i, j, 15, 15);
        }
      }
    }

    // Download the image
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 p-4 ${className}`}>
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        
        {/* QR Code Placeholder */}
        <div className="flex justify-center">
          <div 
            className="bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <div className="text-center">
              <QrCode className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">QR Code</p>
              <p className="text-xs text-neutral-400 mt-1 break-all px-2">
                {value}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-center">
          {showCopy && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied!' : 'Copy URL'}
            </Button>
          )}
          
          {showDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              icon={<Download className="w-4 h-4" />}
            >
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCode;
