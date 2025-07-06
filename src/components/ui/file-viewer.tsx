import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image, 
  File, 
  Download, 
  Eye, 
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileViewerProps {
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  className?: string;
}

const FileViewer: React.FC<FileViewerProps> = ({
  fileUrl,
  fileName,
  fileType,
  fileSize,
  className
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  useEffect(() => {
    const loadFile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // For images, we can preview directly
        if (fileType?.startsWith('image/')) {
          setPreviewUrl(fileUrl);
          setIsLoading(false);
          return;
        }

        // For other file types, we'll show a preview card
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load file preview');
        setIsLoading(false);
      }
    };

    if (fileUrl) {
      loadFile();
    }
  }, [fileUrl, fileType]);

  const getFileIcon = () => {
    if (fileType?.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    if (fileType?.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (fileType?.includes('word') || fileType?.includes('document')) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    }
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) {
      return <FileText className="h-8 w-8 text-green-600" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const getFileTypeLabel = () => {
    if (fileType?.startsWith('image/')) {
      return 'Image';
    }
    if (fileType?.includes('pdf')) {
      return 'PDF';
    }
    if (fileType?.includes('word') || fileType?.includes('document')) {
      return 'Document';
    }
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) {
      return 'Spreadsheet';
    }
    return fileType || 'Unknown';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'document';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (fileType?.startsWith('image/')) {
      setShowFullPreview(true);
    } else {
      window.open(fileUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-red-200 bg-red-50", className)}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-800">Error loading file</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon()}
              <div>
                <p className="font-medium">{fileName || 'Document'}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {getFileTypeLabel()}
                  </Badge>
                  {fileSize && (
                    <span className="text-xs text-gray-500">
                      {formatFileSize(fileSize)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          {fileType?.startsWith('image/') && previewUrl ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt={fileName || 'Document preview'}
                  className="w-full max-h-64 object-contain rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowFullPreview(true)}
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/50 text-white text-xs">
                    Click to enlarge
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleView}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="text-center">
                  {getFileIcon()}
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {fileName || 'Document'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileTypeLabel()} • {formatFileSize(fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleView}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Open File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full-size image preview modal */}
      {showFullPreview && fileType?.startsWith('image/') && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-w-full max-h-full">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
              onClick={() => setShowFullPreview(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={previewUrl}
              alt={fileName || 'Document preview'}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export { FileViewer }; 