"use client";

import React, { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GlobalButton from "@/components/common/globalButton";

interface CameraBarcodeScannerProps {
  onResult: (value: string) => void;
  isScannerOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CameraBarcodeScanner: React.FC<CameraBarcodeScannerProps> = ({
  onResult,
  isScannerOpen,
  onOpenChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanning) {
      // Stop video stream if not scanning
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    setError(null);
    let active = true;

    codeReader
      .decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result, err, controls) => {
          if (!active) return;
          if (result) {
            console.log("RS_54556_RS_RS", result?.text);
            onResult( result?.text);
            setScanning(false);
            controls.stop();
            // onOpenChange(false); // Close modal
          }
          if (err && err.name !== "NotFoundException") {
            setError("Error scanning barcode");
          }
        }
      )
      .catch((e) => {
        setError("Could not access camera");
        setScanning(false);
      });

    return () => {
      active = false;
      // Stop video stream on cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [scanning, onResult]);

  useEffect(() => {
    if (!isScannerOpen) {
      setScanning(false);
      // Stop video stream if modal closes
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isScannerOpen]);

  const handleStop = () => {
    setScanning(false);
  };

  return (
    <Dialog open={isScannerOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: 8,
            padding:10
          }}
        >
          {!scanning && (
            <GlobalButton
              text="Scan Barcode"
              variant="primary"
              onClick={() => setScanning(true)}
              type="button"
              style={{ marginBottom: 8 }}
            />
          )}
          {scanning && (
            <>
              <video
                ref={videoRef}
                style={{ width: 640, height: 480, border: "1px solid #ccc" }}
                autoPlay
                muted
              />
              <GlobalButton
                text="Stop"
                onClick={handleStop}
                type="button"
                  className = "mt-5"

              />
            </>
          )}
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraBarcodeScanner;
