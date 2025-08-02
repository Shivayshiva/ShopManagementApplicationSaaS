"use client";

import { useState } from "react";
import { useSplashScreensByIds } from "@/hooks/useSplashScreensByIds";
import { usePatchSelectSplashScreen } from "@/hooks/usePatchSelectSplashScreen";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  Play,
  Palette,
  Clock,
  Maximize2,
  Type,
  Sparkles,
  Check,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface SplashScreen {
  _id: string;
  animationType: string;
  backgroundColor: string;
  duration: number;
  logoHeight: number;
  logoSvg: string;
  logoWidth: number;
  shopName: string;
  slogan: string;
  textColor: string;
  transitionStyle: string;
  previewImage: string;
}


interface SplashScreenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  splashIdList: string[];
  handlePreviewFn: (screen: SplashScreen) => void;
  shopId: string;
}

export default function SplashScreenModal({
  open,
  onOpenChange,
  splashIdList,
  handlePreviewFn,
  shopId,
}: SplashScreenModalProps) {
  const [selectedScreen, setSelectedScreen] = useState<SplashScreen | null>(
    null
  );
  const [defaultScreen, setDefaultScreen] = useState<string | null>(
    splashIdList?.[0] || null
  );

  const { data, isLoading, isError, error } =
    useSplashScreensByIds(splashIdList);
  const splashScreens: SplashScreen[] = data?.splashScreens || [];

  const patchSelectSplashScreen = usePatchSelectSplashScreen();

  const handleSetDefault = (screen: SplashScreen) => {
    // setDefaultScreen(screen._id);
    console.log("FDF_RET_W_SF_T_66666666666666666W_S_W", screen);
    patchSelectSplashScreen.mutate({ shopId: shopId?._id, splashScreenId: screen._id }, {
  
      onSuccess: (data) => {
        console.log("Set as default and updated shop:", screen.shopName);
        toast.success(`"${screen.shopName}" set as default splash screen`);
        // setDefaultScreen(screen._id);
      },
      onError: (err) => {
        console.error("Failed to update shop's default splash screen", err);
      },
    });
  };

  //   const handlePreviewFn = () => {
  //     if (selectedScreen) {
  //     //   handlePreview(selectedScreen);
  //     }
  //   };


  return (
    <div className="p-8">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold">
              Splash Screen Library
            </DialogTitle>
            <DialogDescription>
              Browse and preview available splash screen configurations for your
              app
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-120px)] w-full">
            {isLoading ? (
              <div className="p-8 text-center text-lg">
                Loading splash screens...
              </div>
            ) : isError ? (
              <div className="p-8 text-center text-red-600">
                {(error as Error)?.message || "Failed to load splash screens."}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-1">
                {splashScreens.map((screen) => (
                  <Card
                    key={screen.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow w-full"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold truncate">
                          {screen.shopName}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {screen.animationType}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{screen.slogan}"
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Preview Image */}
                      <div className="relative aspect-[4/3] h-32 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={screen.previewImage || "/placeholder.svg"}
                          alt={`${screen.shopName} splash screen preview`}
                          fill
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            backgroundColor: screen.backgroundColor + "20",
                          }}
                        >
                          <div className="text-center space-y-2">
                            <div
                              className="text-xs font-medium px-2 py-1 rounded"
                              style={{
                                color: screen.textColor,
                                backgroundColor: screen.backgroundColor + "80",
                              }}
                            >
                              {screen.shopName}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Properties Grid */}
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Play className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">Animation:</span>
                          </div>
                          <p className="text-muted-foreground pl-4">
                            {screen.animationType}
                          </p>

                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">Duration:</span>
                          </div>
                          <p className="text-muted-foreground pl-4">
                            {screen.duration}ms
                          </p>

                          <div className="flex items-center gap-1">
                            <Maximize2 className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">Logo Size:</span>
                          </div>
                          <p className="text-muted-foreground pl-4">
                            {screen.logoWidth} × {screen.logoHeight}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Palette className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">Background:</span>
                          </div>
                          <div className="flex items-center gap-2 pl-4">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundColor: screen.backgroundColor,
                              }}
                            />
                            <span className="text-muted-foreground text-xs">
                              {screen.backgroundColor}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Type className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">Text Color:</span>
                          </div>
                          <div className="flex items-center gap-2 pl-4">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: screen.textColor }}
                            />
                            <span className="text-muted-foreground text-xs">
                              {screen.textColor}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">Transition:</span>
                          </div>
                          <p className="text-muted-foreground pl-4">
                            {screen.transitionStyle}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePreviewFn(screen)}
                          className="flex-1 gap-2"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleSetDefault(screen)}
                          className="flex-1 gap-2"
                          variant={defaultScreen === screen.id ? "default" : "outline"}
                          disabled={patchSelectSplashScreen.isLoading}
                        >
                          {patchSelectSplashScreen.isLoading && defaultScreen === screen.id ? (
                            // Replace with your spinner component or text
                            <span className="animate-spin mr-2">⏳</span>
                          ) : defaultScreen === screen.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              Default
                            </>
                          ) : (
                            "Set Default"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Selected Screen Info (for demo purposes) */}
      <div className="mt-6 space-y-4">
        {selectedScreen && (
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Last Previewed:</h3>
            <p className="text-sm text-muted-foreground">
              {selectedScreen.shopName} - {selectedScreen.slogan}
            </p>
          </div>
        )}

        {defaultScreen && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-800">
              Current Default:
            </h3>
            <p className="text-sm text-green-700">
              {splashScreens.find((s) => s.id === defaultScreen)?.shopName} -{" "}
              {splashScreens.find((s) => s.id === defaultScreen)?.slogan}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
