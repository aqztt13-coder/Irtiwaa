import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'حدث خطأ غير متوقع' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearStorageAndReload = () => {
    try {
      localStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1120] text-slate-100 flex items-center justify-center p-4 dir-rtl text-right font-['IBM_Plex_Sans_Arabic',sans-serif]">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold font-['Tajawal'] text-white">
              ارتواء | حدث استثناء غير متوقع
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              حدث خطأ في تحميل الواجهة. لا تقلق، يمكنك إعادة تحميل الصفحة أو إعادة تعيين البيانات المؤقتة.
            </p>

            {this.state.errorMessage && (
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left font-mono text-[11px] text-red-400 overflow-x-auto">
                {this.state.errorMessage}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل التطبيق</span>
              </button>

              <button
                onClick={this.handleClearStorageAndReload}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="مسح البيانات المخزنة محلياً وإعادة التحميل"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>إعادة ضبط البيانات</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
