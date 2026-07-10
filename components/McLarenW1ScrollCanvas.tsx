"use client";

import { MotionValue, useSpring, useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface McLarenW1ScrollCanvasProps {
    scrollYProgress: MotionValue<number>;
    totalFrames: number;
    imageFolderPath: string;
    onProgress?: (progress: number) => void;
    onLoaded?: () => void;
}

export default function McLarenW1ScrollCanvas({
    scrollYProgress,
    totalFrames,
    imageFolderPath,
    onProgress,
    onLoaded,
}: McLarenW1ScrollCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Performance optimization: prevent redundant drawing calls
    const lastDrawnFrameRef = useRef<number>(-1);
    const loadedImagesRef = useRef<boolean[]>([]);

    // Render Logic
    const drawImageOnCanvas = (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // High-DPI Support
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Set actual size in memory (scaled to account for extra pixel density)
        // Only set content if dimensions change to avoid clearing
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        } else {
            // Just clear if we didn't resize (resize clears automatically)
            ctx.clearRect(0, 0, rect.width, rect.height);
        }

        // Ensure scale is persistent or re-set
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw Image - Object Fit: Cover
        const scale = Math.max(rect.width / img.width, rect.height / img.height);
        const x = (rect.width / 2) - (img.width / 2) * scale;
        const y = (rect.height / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    // Find the closest loaded image index to avoid drawing empty frames
    const getClosestLoadedImageIndex = (targetIndex: number): number => {
        if (images.length === 0) return -1;
        const loadedFlags = loadedImagesRef.current;
        
        let step = 1;
        while (step < totalFrames) {
            const prev = targetIndex - step;
            const next = targetIndex + step;
            
            if (prev >= 0 && loadedFlags[prev]) {
                return prev;
            }
            if (next < totalFrames && loadedFlags[next]) {
                return next;
            }
            
            if (prev < 0 && next >= totalFrames) {
                break;
            }
            step++;
        }
        
        if (loadedFlags[0]) return 0;
        return -1;
    };

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;
        
        let targetImg = images[index];
        const loadedFlags = loadedImagesRef.current;
        
        // If image at index is not loaded, fallback to the nearest loaded image
        if (!targetImg || !loadedFlags[index]) {
            const closestIndex = getClosestLoadedImageIndex(index);
            if (closestIndex !== -1) {
                targetImg = images[closestIndex];
            } else {
                return; // No images loaded at all yet
            }
        }
        
        drawImageOnCanvas(canvas, targetImg);
    };

    // Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];
        const loadedFlags = new Array(totalFrames).fill(false);
        loadedImagesRef.current = loadedFlags;

        const loadImages = async () => {
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                img.src = `${imageFolderPath}/ezgif-frame-${i.toString().padStart(3, "0")}.jpg`;
                
                img.onload = () => {
                    loadedCount++;
                    loadedFlags[i - 1] = true;
                    
                    const progressPercent = Math.round((loadedCount / totalFrames) * 100);
                    if (onProgress) onProgress(progressPercent);

                    // Render first frame immediately
                    if (i === 1) {
                        const canvas = canvasRef.current;
                        if (canvas) {
                            drawImageOnCanvas(canvas, img);
                            lastDrawnFrameRef.current = 0;
                        }
                    }

                    if (loadedCount === totalFrames) {
                        setIsLoaded(true);
                        if (onLoaded) onLoaded();
                    }
                };
                
                img.onerror = () => {
                    // Preload fallback to prevent hangs
                    loadedCount++;
                    loadedFlags[i - 1] = true; // Mark as loaded for fallback purposes
                    
                    const progressPercent = Math.round((loadedCount / totalFrames) * 100);
                    if (onProgress) onProgress(progressPercent);
                    
                    if (loadedCount === totalFrames) {
                        setIsLoaded(true);
                        if (onLoaded) onLoaded();
                    }
                };
                
                imgArray.push(img);
            }
            setImages(imgArray);
        };

        loadImages();
    }, [totalFrames, imageFolderPath, onProgress, onLoaded]);

    // Instant Response Physics (No Delay)
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 300,
        damping: 40,
        restDelta: 0.0001
    });

    // Game Loop Rendering (Decoupled from scroll events for max smoothness)
    useAnimationFrame(() => {
        if (images.length === 0) return;

        const latest = smoothProgress.get();
        const frameIndex = Math.min(
            totalFrames - 1,
            Math.floor(latest * totalFrames)
        );

        // Performance Optimization: Only draw if frame index changed
        if (frameIndex !== lastDrawnFrameRef.current) {
            renderFrame(frameIndex);
            lastDrawnFrameRef.current = frameIndex;
        }
    });

    // Handle Resize (Re-trigger is handled by the loop naturally, but we keep this for instant feedback if paused)
    useEffect(() => {
        const handleResize = () => {
            // Force redraw on next frame
            lastDrawnFrameRef.current = -1;
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full block bg-mclaren-black"
            style={{ willChange: "transform" }}
        />
    );
}
