"use client";
import { getSvgPathFromStroke } from "@/utils/utils";
import getStroke from "perfect-freehand";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8000");
  }
  return socket;
};

const options = {
  size: 12,
  thinning: 0,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t: number) => t,
  start: {
    taper: 0,
    easing: (t: number) => t,
    cap: true
  },
  end: {
    taper: 0,
    easing: (t: number) => t,
    cap: true
  }
};

export default function Example() {
  const [strokes, setStrokes] = useState<any[]>([]);
  const [currentStroke, setCurrentStroke] = useState<any[]>([]);

  useEffect(() => {
    const socket = initializeSocket();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("getStroke", (data) => {
      console.log("Received stroke:", data);
      setStrokes((prev) => [...prev, data]);
    });

    return () => {
      socket.off("getStroke");
      socket.off("connect");
    };
  }, []);

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setCurrentStroke([[e.pageX, e.pageY, e.pressure]]);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (e.buttons !== 1) return;
    setCurrentStroke((prev) => [...prev, [e.pageX, e.pageY, e.pressure]]);
  }

  function handlePointerUp() {
    if (!socket || currentStroke.length === 0) return;

    setStrokes((prev) => [...prev, currentStroke]);
    socket.emit("setStroke", currentStroke);
    setCurrentStroke([]);
  }

  return (
    <div className="h-screen flex">
      <div className="w-[70%] h-full flex justify-center items-center">
        <svg
          className="w-full h-full"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          {strokes.map((stroke, index) => (
            <path key={index} d={getSvgPathFromStroke(getStroke(stroke, options))} />
          ))}
          {currentStroke.length > 0 && (
            <path d={getSvgPathFromStroke(getStroke(currentStroke, options))} />
          )}
        </svg>
      </div>

      {/* Sidebar takes 30% width */}
      <div className="w-[30%] h-screen bg-black"></div>
    </div>
  );
}
