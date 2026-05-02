import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Camera, Compass, Crosshair, Star, CheckCircle, Navigation, SlidersHorizontal, AlertCircle } from 'lucide-react';
import useStarStore from '../../store/useStarStore';
import { useTranslation } from '../../hooks/useTranslation';

export default function ARCameraView({ targetStar, targetAzimuth, targetAltitude }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  
  // Heading & Mode State
  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [isManualMode, setIsManualMode] = useState(false);
  const [sensorAvailable, setSensorAvailable] = useState(null); // null = unknown, true = yes, false = no
  const [permissionRequested, setPermissionRequested] = useState(false);

  const [isFound, setIsFound] = useState(false);
  const addStarToCollection = useStarStore(state => state.addStarToCollection);

  // Camera Setup
  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (err) {
        console.error("Camera access denied or not available", err);
      }
    };

    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Orientation Handler
  const handleOrientation = useCallback((event) => {
    if (event.alpha === null) {
      if (sensorAvailable !== false) {
        setSensorAvailable(false);
        setIsManualMode(true);
      }
      return;
    }

    if (sensorAvailable !== true) {
      setSensorAvailable(true);
    }

    if (!isManualMode) {
      let compassHeading = event.webkitCompassHeading;
      if (compassHeading === undefined || compassHeading === null) {
        compassHeading = Math.abs(event.alpha - 360);
      }
      setHeading(compassHeading || 0);
      setPitch(event.beta || 0); 
    }
  }, [isManualMode, sensorAvailable]);

  useEffect(() => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Must wait for user interaction to request permission on iOS
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
      setPermissionRequested(true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  const requestOrientationPermission = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
            setSensorAvailable(true);
          } else {
            setSensorAvailable(false);
            setIsManualMode(true);
          }
          setPermissionRequested(true);
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    if (!targetAzimuth || isFound) return;

    const diffAzimuth = Math.abs(heading - targetAzimuth);
    const isPointingAtStar = (diffAzimuth < 15 || diffAzimuth > 345);

    if (isPointingAtStar && targetStar) {
      setIsFound(true);
      addStarToCollection(targetStar.id);
    }
  }, [heading, targetAzimuth, targetStar, isFound, addStarToCollection]);

  // Constellation Overlay logic
  // Render generic constellation lines if the user is pointing close to the target star
  const diffAzimuth = targetAzimuth ? Math.abs(heading - targetAzimuth) : 180;
  const showConstellation = diffAzimuth < 30 || diffAzimuth > 330;
  const arrowRotation = targetAzimuth ? targetAzimuth - heading : 0;

  // Mock constellation points relative to center
  const getConstellationLines = (constellation) => {
    switch (constellation) {
      case 'Ursa Minor':
        return "M 100,50 L 80,120 L 30,150 L 0,200 M 80,120 L 150,130 L 170,80 L 100,50";
      case 'Canis Major':
        return "M 100,20 L 120,80 L 180,150 L 150,200 M 120,80 L 50,130 L 20,180 M 50,130 L 100,200";
      case 'Orion':
        return "M 50,20 L 150,30 L 100,100 L 80,110 L 120,115 L 60,180 L 160,190 M 100,100 L 60,180 M 100,100 L 160,190";
      case 'Lyra':
        return "M 100,20 L 150,80 L 130,160 L 50,140 L 70,60 L 100,20 M 70,60 L 150,80";
      default:
        // Generic triangle pattern
        return "M 100,50 L 50,150 L 150,150 Z";
    }
  };

  return (
    <div className="relative w-full h-[75vh] min-h-[600px] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
      
      {/* Video Background */}
      {hasCameraPermission ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
          <Camera className="w-12 h-12 mb-4 text-white/30" />
          <p>{t('ar', 'cameraRequired')}</p>
          <p className="text-sm mt-2">{t('ar', 'cameraAllow')}</p>
        </div>
      )}

      {/* Permission Button for iOS */}
      {!permissionRequested && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 p-8 rounded-3xl border border-white/10 text-center max-w-sm mx-4">
            <Compass className="w-12 h-12 text-neon-purple mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('ar', 'enableCompass')}</h3>
            <p className="text-gray-400 text-sm mb-6">{t('ar', 'compassDesc')}</p>
            <button 
              onClick={requestOrientationPermission}
              className="w-full py-3 bg-neon-purple hover:bg-white text-black font-bold rounded-xl transition-colors"
            >
              {t('ar', 'grantPermission')}
            </button>
          </div>
        </div>
      )}

      {/* Constellation Overlay */}
      {targetStar && showConstellation && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-60">
           <svg width="300" height="300" viewBox="0 0 200 250" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
             <path 
               d={getConstellationLines(targetStar.constellation)} 
               fill="none" 
               stroke="white" 
               strokeWidth="3" 
               strokeDasharray="5,5" 
             />
             {/* Draw stars at vertices by analyzing the path roughly (simplified visually) */}
             <circle cx="100" cy="50" r="4" fill="white" />
             <circle cx="80" cy="120" r="3" fill="white" />
             <circle cx="150" cy="80" r="5" fill="white" />
           </svg>
        </div>
      )}

      {/* AR UI Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-between">
        
        {/* Top Info Bar */}
        <div className="flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 pointer-events-auto shadow-lg">
            <Compass className="w-4 h-4 text-neon-purple" />
            <span className="text-white font-mono">{Math.round(heading)}° {isManualMode ? `(${t('ar', 'manual')})` : 'N'}</span>
          </div>

          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex flex-col items-end shadow-lg">
            <span className="text-xs text-gray-400 uppercase">{t('ar', 'target')}</span>
            <span className="text-white font-bold">{targetStar?.name || t('ar', 'none')}</span>
          </div>
        </div>

        {/* Center Reticle / Arrow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {isFound ? (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-32 h-32 rounded-full border-4 border-green-500 bg-green-500/20 flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle className="w-16 h-16 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              </div>
              <div className="mt-4 bg-green-500 text-black font-bold px-6 py-2 rounded-full text-lg shadow-[0_0_20px_rgba(34,197,94,0.5)] whitespace-nowrap">
                {t('ar', 'starFound')}
              </div>
            </motion.div>
          ) : (
            <div className="relative">
              <Crosshair className="w-32 h-32 text-white/20" />
              {targetAzimuth && (
                <motion.div 
                  className="absolute inset-0 flex flex-col items-center justify-start -mt-10"
                  animate={{ rotate: arrowRotation }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                  <Navigation className="w-12 h-12 text-neon-purple drop-shadow-[0_0_15px_rgba(168,85,247,0.9)] fill-neon-purple" />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Manual Mode Slider */}
      {isManualMode && (
        <div className="absolute bottom-24 left-6 right-6 z-40 bg-black/70 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
          {sensorAvailable === false && (
            <div className="flex items-start gap-3 mb-4 text-amber-400/90 text-sm bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{t('ar', 'noCompassDesc').replace('{targetAzimuth}', targetAzimuth)}</p>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm font-mono w-10">0°</span>
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={heading} 
              onChange={(e) => setHeading(Number(e.target.value))}
              className="w-full accent-neon-purple h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-gray-400 text-sm font-mono w-12 text-right">360°</span>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-6 right-6 z-30 flex justify-center pointer-events-auto">
        <button 
          onClick={() => setIsManualMode(!isManualMode)}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all backdrop-blur-md border shadow-lg ${isManualMode ? 'bg-neon-purple text-black border-neon-purple' : 'bg-black/60 text-white border-white/20 hover:bg-white/10'}`}
        >
          <SlidersHorizontal className="w-5 h-5" /> 
          <span>{isManualMode ? t('ar', 'compassMode') : t('ar', 'manualMode')}</span>
        </button>
      </div>

    </div>
  );
}
