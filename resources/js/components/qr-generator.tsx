import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Equipment, Material } from '@/types';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
    modelName?: string;
    model: Equipment | Material;
    isQROpen: boolean;
    setIsQROpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function QRCodeGenerator({ modelName, model, isQROpen, setIsQROpen }: QRCodeGeneratorProps) {
    return (
        <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{model.code}</DialogTitle>
                    <DialogDescription>QR code generated from {modelName ? modelName : 'Asset'} code</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center bg-white p-2">
                    <QRCodeSVG value={model.code} className="h-auto w-full" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
