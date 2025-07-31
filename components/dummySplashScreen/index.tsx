"use client";

import type React from "react";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateSplashScreen } from "@/hooks/useCreateSplashScreen";
import {
  type AnimationType,
  type TransitionStyle,
} from "./splash-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
type SplashScreenConfig = {
  shopName: string;
  slogan: string;
  logoSvg: string;
  logoWidth: number;
  logoHeight: number;
  backgroundColor: string;
  textColor: string;
  animationType: AnimationType;
  transitionStyle: TransitionStyle;
  duration: number;
};

interface SplashScreenCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setShowSplash: (show: boolean) => void;
  config: SplashScreenConfig;
  setConfig: (config: SplashScreenConfig) => void;
  setSplashSetupModal: (open: boolean) => void;
}

export default function SplashScreenCreationModal({
  open,
  onOpenChange,
  setShowSplash,
  config,
  setConfig,
  setSplashSetupModal,
}: SplashScreenCreationModalProps) {
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: config,
  });
  const createSplashScreenMutation = useCreateSplashScreen();
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        setValue("logoSvg", svgContent);
      };
      reader.readAsText(file);
    }
  };

  const animationTypes: {
    value: AnimationType;
    label: string;
    description: string;
  }[] = [
    {
      value: "particles",
      label: "Particles",
      description: "Enhanced floating dots with smooth transitions",
    },
    {
      value: "waves",
      label: "Waves",
      description: "Improved radial wave patterns with depth",
    },
    {
      value: "geometric",
      label: "Geometric",
      description: "Multi-shape rotating elements",
    },
    {
      value: "gradient-flow",
      label: "Gradient Flow",
      description: "Dual-layer flowing gradients",
    },
    {
      value: "ripples",
      label: "Ripples",
      description: "Enhanced expanding ripple effects",
    },
    {
      value: "stars",
      label: "Stars",
      description: "Improved twinkling star field",
    },
    {
      value: "bubbles",
      label: "Bubbles",
      description: "Enhanced rising bubble animation",
    },
    {
      value: "matrix-rain",
      label: "Matrix Rain",
      description: "Improved digital rain with better effects",
    },
    {
      value: "dna-helix",
      label: "DNA Helix",
      description: "Enhanced rotating double helix",
    },
    {
      value: "constellation",
      label: "Constellation",
      description: "Animated star connections",
    },
    {
      value: "liquid-morphing",
      label: "Liquid Morphing",
      description: "Enhanced flowing blob shapes",
    },
    {
      value: "circuit-board",
      label: "Circuit Board",
      description: "Improved animated circuits",
    },
    {
      value: "spiral-galaxy",
      label: "Spiral Galaxy",
      description: "Enhanced rotating spiral arms",
    },
    {
      value: "neural-network",
      label: "Neural Network",
      description: "Improved connected nodes",
    },
  ];

  const transitionStyles: {
    value: TransitionStyle;
    label: string;
    description: string;
  }[] = [
    { value: "fade", label: "Fade", description: "Simple opacity transition" },
    { value: "scale", label: "Scale", description: "Zoom in/out effect" },
    {
      value: "slide-up",
      label: "Slide Up",
      description: "Slide from bottom to top",
    },
    {
      value: "slide-down",
      label: "Slide Down",
      description: "Slide from top to bottom",
    },
    {
      value: "zoom-blur",
      label: "Zoom Blur",
      description: "Scale with blur effect",
    },
    {
      value: "rotate-fade",
      label: "Rotate Fade",
      description: "Rotation with fade",
    },
    {
      value: "elastic",
      label: "Elastic",
      description: "Bouncy elastic effect",
    },
    { value: "bounce", label: "Bounce", description: "Bounce from top" },
  ];

  const presets = [
    {
      name: "Coffee Shop",
      shopName: "Brew & Bean",
      slogan: "Freshly Roasted Daily",
      bg: "#3c2415",
      text: "#f4e4bc",
      animation: "particles" as AnimationType,
      transition: "fade" as TransitionStyle,
      logoWidth: 90, // Add this
      logoHeight: 90, // Add this
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.38 0 2.5-1.12 2.5-2.5S19.88 3 18.5 3zM16 5v3H6V5h10zm2 .5c0 .28-.22.5-.5.5H16V5h.5c.28 0 .5.22.5.5z"/></svg>`,
    },
    {
      name: "Tech Store",
      shopName: "Digital Hub",
      slogan: "Innovation at Your Fingertips",
      bg: "#0f172a",
      text: "#60a5fa",
      animation: "circuit-board" as AnimationType,
      transition: "zoom-blur" as TransitionStyle,
      logoWidth: 85,
      logoHeight: 85,
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    },
    {
      name: "Fashion Boutique",
      shopName: "Elegance",
      slogan: "Style Redefined",
      bg: "#581c87",
      text: "#f3e8ff",
      animation: "liquid-morphing" as AnimationType,
      transition: "elastic" as TransitionStyle,
      logoWidth: 75,
      logoHeight: 75,
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
    },
    {
      name: "Bookstore",
      shopName: "Page Turner",
      slogan: "Stories Come Alive",
      bg: "#1e3a8a",
      text: "#dbeafe",
      animation: "constellation" as AnimationType,
      transition: "slide-up" as TransitionStyle,
      logoWidth: 95,
      logoHeight: 95,
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>`,
    },
    {
      name: "Fitness Center",
      shopName: "Power Gym",
      slogan: "Strength & Endurance",
      bg: "#dc2626",
      text: "#fecaca",
      animation: "geometric" as AnimationType,
      transition: "bounce" as TransitionStyle,
      logoWidth: 80,
      logoHeight: 80,
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"/></svg>`,
    },
    {
      name: "Art Gallery",
      shopName: "Canvas Dreams",
      slogan: "Where Art Meets Soul",
      bg: "#1f2937",
      text: "#f9fafb",
      animation: "gradient-flow" as AnimationType,
      transition: "rotate-fade" as TransitionStyle,
      logoWidth: 70,
      logoHeight: 70,
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    },
    {
      name: "Restaurant",
      shopName: "Taste Haven",
      slogan: "Culinary Excellence",
      bg: "#7c2d12",
      text: "#fed7aa",
      animation: "bubbles" as AnimationType,
      transition: "scale" as TransitionStyle,
      logoWidth: 80,
      logoHeight: 80,
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-.78-.78-2.05-.78-2.83 0s-.78 2.05 0 2.83l7.02 7.01zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/></svg>`,
    },
    {
      name: "Spa & Wellness",
      shopName: "Serenity",
      slogan: "Relax & Rejuvenate",
      bg: "#14532d",
      text: "#bbf7d0",
      animation: "ripples" as AnimationType,
      transition: "fade" as TransitionStyle,
      logoWidth: 85,
      logoHeight: 85,
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.8 21.6c-1.6 0-3.2-.6-4.4-1.8-2.4-2.4-2.4-6.4 0-8.8L12 4.4l6.6 6.6c2.4 2.4 2.4 6.4 0 8.8-2.4 2.4-6.4 2.4-8.8 0-.6-.6-1.4-.6-2 0s-.6 1.4 0 2c1.6 1.6 3.6 2.4 5.6 2.4s4-.8 5.6-2.4c3.1-3.1 3.1-8.2 0-11.3L12 2.4 5 9.4c-3.1 3.1-3.1 8.2 0 11.3.6.6 1.4.6 2 0s.6-1.4 0-2c-.6-.6-.6-1.4 0-2s1.4-.6 2 0c.6.6.6 1.4 0 2z"/></svg>`,
    },
    {
      name: "Gaming Store",
      shopName: "Pixel Paradise",
      slogan: "Level Up Your Game",
      bg: "#000000",
      text: "#22c55e",
      animation: "matrix-rain" as AnimationType,
      transition: "slide-down" as TransitionStyle,
      logoWidth: 90,
      logoHeight: 90,
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19h0c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.12.75 1.8.75h0c1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-0.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm2 3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z"/></svg>`,
    },
    {
      name: "Jewelry Shop",
      shopName: "Diamond Luxe",
      slogan: "Brilliance Redefined",
      bg: "#1e1b4b",
      text: "#fbbf24",
      animation: "stars" as AnimationType,
      transition: "elastic" as TransitionStyle,
      logoWidth: 80,
      logoHeight: 80,
      logoSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2l2 6h8l2-6H6zm3.5 7L12 22l2.5-13h-5zM2 9l2 2 8-2L2 9zm20 0l-10 2 8 2 2-2z"/></svg>`,
    },
  ];

  const handleShowSplash = () => {
    setConfig(getValues());
    setShowSplash(true);
    setSplashSetupModal(false);
  };

  const onSubmit = async (data: any) => {
    try {
      await createSplashScreenMutation.mutateAsync(data);
      setSplashSetupModal(false);
    } catch (error) {
      // Optionally handle error (e.g., show toast)
      console.error("Failed to create splash screen", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-fit overflow-y-auto max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Configure Splash Screen</DialogTitle>
          <DialogDescription>
            Customize text, animation, and preview your splash screen.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="lg:col-span-3 space-y-8">
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="shop-name">Shop Name</Label>
                        <Controller
                          name="shopName"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="shop-name"
                              {...field}
                              placeholder="Enter your shop name"
                              className="border-gray-200 focus:border-blue-400 text-lg font-medium"
                            />
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="slogan">Slogan</Label>
                        <Controller
                          name="slogan"
                          control={control}
                          render={({ field }) => (
                            <Textarea
                              id="slogan"
                              {...field}
                              placeholder="Enter your shop slogan or tagline"
                              className="border-gray-200 focus:border-blue-400 resize-none"
                              rows={2}
                            />
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="logo-upload">Shop Logo (SVG)</Label>
                        <div className="space-y-2">
                          <Input
                            id="logo-upload"
                            type="file"
                            accept=".svg,image/svg+xml"
                            onChange={handleLogoUpload}
                            className="border-gray-200 focus:border-blue-400"
                          />
                          <Controller
                            name="logoSvg"
                            control={control}
                            render={({ field }) =>
                              field.value ? (
                                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                                  <div
                                    className="flex items-center justify-center"
                                    style={{ width: "32px", height: "32px" }}
                                    dangerouslySetInnerHTML={{ __html: field.value }}
                                  />
                                  <span className="text-sm text-green-700">Logo uploaded successfully</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setValue("logoSvg", "")}
                                    className="ml-auto text-red-600 hover:text-red-700"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : <></>
                            }
                          />
                        </div>
                      </div>

                      {/* Add logo size controls */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="logo-width">Logo Width (px)</Label>
                          <Controller
                            name="logoWidth"
                            control={control}
                            render={({ field }) => (
                              <Input
                                id="logo-width"
                                type="number"
                                {...field}
                                value={field.value}
                                onChange={e => field.onChange(Number.parseInt(e.target.value) || 80)}
                                min="20"
                                max="200"
                                step="10"
                                className="border-gray-200 focus:border-blue-400"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <Label htmlFor="logo-height">Logo Height (px)</Label>
                          <Controller
                            name="logoHeight"
                            control={control}
                            render={({ field }) => (
                              <Input
                                id="logo-height"
                                type="number"
                                {...field}
                                value={field.value}
                                onChange={e => field.onChange(Number.parseInt(e.target.value) || 80)}
                                min="20"
                                max="200"
                                step="10"
                                className="border-gray-200 focus:border-blue-400"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bg-color">Background Color</Label>
                          <div className="flex gap-2">
                            <Controller
                              name="backgroundColor"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id="bg-color"
                                  type="color"
                                  {...field}
                                  value={field.value}
                                  className="w-16 h-10 p-1 border-gray-200"
                                />
                              )}
                            />
                            <Controller
                              name="backgroundColor"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  value={field.value}
                                  onChange={e => field.onChange(e.target.value)}
                                  placeholder="#0f172a"
                                  className="flex-1 border-gray-200 focus:border-blue-400"
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="text-color">Text Color</Label>
                          <div className="flex gap-2">
                            <Controller
                              name="textColor"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id="text-color"
                                  type="color"
                                  {...field}
                                  value={field.value}
                                  className="w-16 h-10 p-1 border-gray-200"
                                />
                              )}
                            />
                            <Controller
                              name="textColor"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  value={field.value}
                                  onChange={e => field.onChange(e.target.value)}
                                  placeholder="#f1f5f9"
                                  className="flex-1 border-gray-200 focus:border-blue-400"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="animation">Background Animation</Label>
                          <Controller
                            name="animationType"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="border-gray-200 focus:border-blue-400">
                                  <SelectValue placeholder="Select animation" />
                                </SelectTrigger>
                                <SelectContent>
                                  {animationTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div>
                                        <div className="font-medium">{type.label}</div>
                                        <div className="text-sm text-gray-500">{type.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div>
                          <Label htmlFor="transition">Transition Style</Label>
                          <Controller
                            name="transitionStyle"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="border-gray-200 focus:border-blue-400">
                                  <SelectValue placeholder="Select transition" />
                                </SelectTrigger>
                                <SelectContent>
                                  {transitionStyles.map((style) => (
                                    <SelectItem key={style.value} value={style.value}>
                                      <div>
                                        <div className="font-medium">{style.label}</div>
                                        <div className="text-sm text-gray-500">{style.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="duration">Duration (ms)</Label>
                        <Controller
                          name="duration"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="duration"
                              type="number"
                              {...field}
                              value={field.value}
                              onChange={e => field.onChange(Number.parseInt(e.target.value))}
                              min="1000"
                              max="10000"
                              step="500"
                              className="border-gray-200 focus:border-blue-400"
                            />
                          )}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          onClick={handleShowSplash}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          size="lg"
                        >
                          Preview Splash Screen
                        </Button>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          size="lg"
                          disabled={createSplashScreenMutation.isLoading}
                        >
                          {createSplashScreenMutation.isLoading ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
