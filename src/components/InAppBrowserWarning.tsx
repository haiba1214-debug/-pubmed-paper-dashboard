import { useEffect, useState } from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';

export function InAppBrowserWarning() {
    const [isInAppBrowser, setIsInAppBrowser] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        // Common in-app browser distinct strings
        const isInApp = /Line|FBAN|FBAV|Instagram|Twitter|Pinterest/i.test(ua);

        setIsInAppBrowser(isInApp);
    }, []);

    if (!isInAppBrowser) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                ブラウザで開いてください
            </h2>
            <p className="text-slate-600 mb-8 max-w-md">
                現在お使いのアプリ内ブラウザでは、Googleログインが制限されています。<br />
                お手数ですが、以下の手順で標準ブラウザで開き直してください。
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 w-full max-w-sm text-left space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                    <div>
                        <p className="font-semibold text-slate-800">右上のメニュー「︙」または「<ExternalLink className="w-3 h-3 inline" />」をタップ</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                    <div>
                        <p className="font-semibold text-slate-800">「デフォルトのブラウザで開く」または「Safariで開く」を選択</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
