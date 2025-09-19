import { router } from '@inertiajs/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const QRScanner = () => {
    function waitForElement(id: string): Promise<HTMLElement> {
        return new Promise((resolve) => {
            const observer = new MutationObserver(() => {
                const el = document.getElementById(id);
                if (el) {
                    resolve(el);
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }

    useEffect(() => {
        waitForElement('qr-reader').then((element) => {
            const imageOnTopRight = element.firstElementChild?.firstElementChild?.nextSibling as HTMLElement;
            if (imageOnTopRight) imageOnTopRight.style.display = 'none';
        });

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: { width: 300, height: 250 },
            },
            false,
        );

        const onScanSuccess = (decodedText: string) => {
            // release kamera dulu baru redirect
            scanner
                .clear()
                .then(() => {
                    // router.get(route('equipments.show', decodedText.substring(0, 9)));
                    router.get(route('equipments.scan', { equipment_code: decodedText.substring(0, 9) }));
                })
                .catch((err) => console.error('Clear error:', err));
        };

        scanner.render(onScanSuccess, (err) => {
            console.warn('Scan error:', err);
        });

        // cleanup saat unmount
        return () => {
            scanner.clear().catch((err) => console.error('Unmount clear error:', err));
        };
    }, []);

    return (
        <div className="space-y-6 px-4 py-6">
            <div id="qr-reader" className="border text-center shadow sm:max-w-sm" />
        </div>
    );
};

export default QRScanner;
