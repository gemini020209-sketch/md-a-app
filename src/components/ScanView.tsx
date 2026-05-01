import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Zap, Scan, CheckCircle2, Image as ImageIcon, RefreshCcw, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { View, CookingMethod } from '../types';
import { COOKING_COEFFICIENTS } from '../constants';
import { cn } from '../lib/utils';
import { analyzeFoodImage, FoodAnalysisResult } from '../services/geminiService';

export function ScanView() {
  const { setView, addFoodLog } = useApp();
  const [step, setStep] = useState<'camera' | 'analysis'>('camera');
  const [isScanning, setIsScanning] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<CookingMethod>('braised');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化相机
  useEffect(() => {
    if (step === 'camera') {
      let stream: MediaStream | null = null;
      
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' },
            audio: false 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(null);
        } catch (err) {
          console.error("Camera error:", err);
          setCameraError("无法访问相机，请检查权限设置");
        }
      };

      startCamera();
      const timer = setTimeout(() => setIsScanning(false), 3000);

      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        clearTimeout(timer);
      };
    }
  }, [step]);

  const performAnalysis = async (image: string) => {
    setIsAnalyzing(true);
    setStep('analysis');
    try {
      const result = await analyzeFoodImage(image);
      setAnalysisResult(result);
      setSelectedMethod(result.bestCookingMethod);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        performAnalysis(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedImage(dataUrl);
        performAnalysis(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (!analysisResult) return;
    
    addFoodLog({
      name: analysisResult.name,
      calories: Math.round(analysisResult.baseCalories * COOKING_COEFFICIENTS[selectedMethod]),
      method: selectedMethod,
      nutrients: analysisResult.nutrients,
      purine: analysisResult.purine,
      gi: analysisResult.gi,
    });
    setView(View.DASHBOARD);
  };

  if (step === 'camera') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col font-manrope">
        <div className="relative flex-grow overflow-hidden">
          {/* Real Camera Video */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover opacity-90"
          />
          
          <canvas ref={canvasRef} className="hidden" />

          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-black/60 backdrop-blur-sm z-10">
              <div className="bg-white p-6 rounded-2xl">
                <p className="text-slate-900 font-bold mb-4">{cameraError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-primary text-white px-6 py-2 rounded-full font-bold"
                >
                  重试
                </button>
              </div>
            </div>
          )}
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 border-2 border-white/30 rounded-[32px] relative overflow-hidden">
               <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-container rounded-tl-lg" />
               <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-container rounded-tr-lg" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-container rounded-bl-lg" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-container rounded-br-lg" />
               
               <motion.div 
                animate={{ top: ['10%', '90%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-container to-transparent shadow-[0_0_15px_rgba(34,197,94,0.8)]"
               />
            </div>
          </div>

          {/* Top Controls */}
          <div className="absolute top-0 left-0 w-full p-8 pt-12 flex justify-between items-center z-20">
            <button onClick={() => setView(View.DASHBOARD)} className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="bg-black/20 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
              <span className="text-white text-[10px] font-space font-medium uppercase tracking-wider">AI 实时检测中</span>
              <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            </div>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white">
              <Zap className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 w-full p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-8 z-20">
            <AnimatePresence>
              {!isScanning && !cameraError && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3 text-white"
                >
                  <Scan className="w-5 h-5 text-primary-container" />
                  <p className="text-sm">正在寻找美食...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between w-full max-w-sm">
               {/* Gallery Button */}
               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-2xl border-2 border-white/20 flex items-center justify-center bg-black/40 overflow-hidden active:scale-90 transition-transform"
                 >
                   <ImageIcon className="w-6 h-6 text-white opacity-60" />
                   <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                   />
                 </button>
                 <span className="text-white text-[10px] font-space opacity-80 uppercase tracking-widest">相册</span>
               </div>

               {/* Shutter Button */}
               <button 
                onClick={handleCapture}
                disabled={!!cameraError}
                className="w-24 h-24 rounded-full border-4 border-white/40 flex items-center justify-center group disabled:opacity-50"
               >
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-active:scale-95 transition-all">
                    <div className="w-[72px] h-[72px] rounded-full border-2 border-black/5 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-primary-container" />
                    </div>
                 </div>
               </button>

               {/* Switch Button (Mock) */}
               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                 <button className="w-14 h-14 rounded-full flex items-center justify-center bg-black/40 border border-white/20 active:scale-90 transition-transform">
                   <RefreshCcw className="w-6 h-6 text-white" />
                 </button>
                 <span className="text-white text-[10px] font-space opacity-80 uppercase tracking-widest">翻转</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analysis Result Step (Loading OR Result)
  if (isAnalyzing || !analysisResult) {
    return (
      <div className="pt-24 pb-32 px-5 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-center">
          <h2 className="font-lexend text-2xl font-bold mb-2">正在进行 AI 分析</h2>
          <p className="text-slate-500 font-manrope">我们正在识别照片中的食材并计算营养价值...</p>
        </div>
        <div className="w-full h-48 rounded-3xl overflow-hidden shadow-sm">
           <img src={capturedImage || ''} className="w-full h-full object-cover blur-sm opacity-50" alt="Processing" />
        </div>
      </div>
    );
  }

  const finalCalories = Math.round(analysisResult.baseCalories * COOKING_COEFFICIENTS[selectedMethod]);
  
  return (
    <div className="pt-24 pb-32 px-5 max-w-md mx-auto space-y-8 h-screen overflow-y-auto no-scrollbar">
      {/* Hero Card with Captured Image */}
      <section className="relative rounded-[32px] overflow-hidden aspect-[4/3] border border-slate-200 shadow-sm">
        <img 
          src={capturedImage || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600"} 
          alt={analysisResult.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {analysisResult.detectedIngredients.slice(0, 3).map(label => (
            <div key={label} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 border border-green-100">
               <span className="w-2 h-2 rounded-full bg-primary-container" />
               <span className="text-xs font-bold font-manrope">{label}</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
          <h2 className="font-lexend text-2xl font-bold">{analysisResult.name}</h2>
          <p className="text-sm opacity-80 font-manrope">AI 检测：{analysisResult.cookingMethodConfidence}</p>
        </div>
      </section>

      {/* Cooking Methods */}
      <section className="space-y-4">
        <h3 className="font-lexend text-lg font-bold">烹饪方式</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {Object.keys(COOKING_COEFFICIENTS).map((method) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method as CookingMethod)}
              className={cn(
                "px-6 py-2 rounded-full border-2 font-bold whitespace-nowrap transition-all font-manrope",
                selectedMethod === method
                  ? "bg-primary text-white border-primary shadow-lg"
                  : "bg-white text-slate-500 border-slate-100 hover:border-primary/30"
              )}
            >
              {translateMethod(method)}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Bento */}
      <section className="grid grid-cols-2 gap-4">
         <div className="col-span-2 bg-white rounded-[24px] p-6 border border-slate-200 flex items-center justify-between shadow-md">
            <div>
              <p className="text-[10px] font-space text-slate-500 uppercase tracking-widest mb-1">总热量预估</p>
              <div className="flex items-baseline gap-2 text-primary">
                <span className="text-4xl font-lexend font-bold">{finalCalories}</span>
                <span className="font-bold font-manrope">千卡</span>
              </div>
            </div>
            <div className="w-20 h-20 rounded-full neomorphic-ring-container flex items-center justify-center relative bg-[#f8f9ff]">
               <svg className="w-full h-full -rotate-90">
                 <circle cx="40" cy="40" r="32" fill="transparent" stroke="#eff4ff" strokeWidth="6" />
                 <circle cx="40" cy="40" r="32" fill="transparent" 
                        stroke={finalCalories > 500 ? "#ba1a1a" : "#22c55e"} 
                        strokeWidth="6" 
                        strokeDasharray="200" 
                        strokeDashoffset={200 - (Math.min(1000, finalCalories) / 1000 * 200)} 
                        strokeLinecap="round" />
               </svg>
               <span className={cn(
                 "absolute text-[10px] font-space font-bold",
                 finalCalories > 500 ? "text-error" : "text-primary"
               )}>
                 {finalCalories > 500 ? "过高" : "良好"}
               </span>
            </div>
         </div>
         
         <div className="bg-white rounded-[24px] p-5 border border-slate-200">
            <p className="text-[10px] font-space text-slate-500 uppercase tracking-widest mb-2">嘌呤等级</p>
            <div className={cn(
              "inline-flex items-center px-3 py-1 rounded-full border",
              analysisResult.purine === 'high' ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full mr-2", analysisResult.purine === 'high' ? "bg-red-600" : "bg-green-600")} />
              <span className="text-xs font-bold font-manrope caps-capitalize">{analysisResult.purine === 'high' ? '高' : analysisResult.purine === 'medium' ? '中' : '低'} 嘌呤</span>
            </div>
         </div>

         <div className="bg-white rounded-[24px] p-5 border border-slate-200">
            <p className="text-[10px] font-space text-slate-500 uppercase tracking-widest mb-2">升糖负荷</p>
            <div className={cn(
               "inline-flex items-center px-3 py-1 rounded-full border",
               analysisResult.gi === 'high' ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full mr-2", analysisResult.gi === 'high' ? "bg-red-600" : "bg-green-600")} />
              <span className="text-xs font-bold font-manrope uppercase">{analysisResult.gi} GL</span>
            </div>
         </div>
      </section>

      {/* Suggestion Card */}
      <section className="bg-surface-container-low border border-surface-container-high rounded-[24px] p-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
             <Info className="w-6 h-6 text-secondary-container" />
          </div>
          <div>
            <h4 className="font-manrope font-bold text-on-surface mb-1">健康分析建议</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-manrope">
              此菜品{analysisResult.purine === 'high' ? '嘌呤含量较高，' : ''}建议搭配{analysisResult.detectedIngredients.length > 3 ? '更多' : ''}绿叶蔬菜。
              {selectedMethod === 'fried' && '油炸方式热量极高，可尝试换成蒸或烤。'}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleConfirm}
          className="w-full py-5 bg-primary text-white rounded-2xl font-lexend text-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          确认记录
          <CheckCircle2 className="w-6 h-6" />
        </button>
        <button 
          onClick={() => {
            setStep('camera');
            setAnalysisResult(null);
          }}
          className="w-full py-4 text-primary font-bold font-manrope"
        >
          取消并回退
        </button>
      </div>
    </div>
  );
}

function translateMethod(m: string) {
  const dict: any = { steamed: '清蒸', braised: '红烧', fried: '油炸', grilled: '烧烤' };
  return dict[m] || m;
}
