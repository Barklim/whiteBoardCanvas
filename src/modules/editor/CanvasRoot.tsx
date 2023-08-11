import React, { useEffect, useRef, WheelEvent } from "react";
import CanvasStore from "../../modules/state/CanvasStore";
import useSize from "@react-hook/size";
import InfiniteCanvas from "./InfiniteCanvas";
import useRenderLoop from "../../modules/core/RenderLoop";

const maxZoom = 165; // Figma: 25600%
const minZoom = -6000;
let currentZoom = 100;

const wheelListener = (e: WheelEvent) => {
  const friction = 1;
  const event = e as WheelEvent;
  const deltaX = event.deltaX * friction;
  const deltaY = event.deltaY * friction;
  if (!event.ctrlKey) {
    CanvasStore.moveCamera(deltaX, deltaY);
  } else {

    const isFeatureEnabled = false;

    if (!isFeatureEnabled) {
      CanvasStore.zoomCamera(deltaX, deltaY);
    } else {
      // TODO: zoom constraint
      if (currentZoom <= maxZoom) {
        currentZoom = currentZoom + -deltaY;
      }
      if (minZoom <= currentZoom) {
        currentZoom = currentZoom + -deltaY;
      }
      console.log('!!!');
      if ( minZoom <= currentZoom && currentZoom <= maxZoom) {
        CanvasStore.zoomCamera(deltaX, deltaY);
      } else {
        if (currentZoom >= maxZoom) {
          currentZoom = maxZoom
        } else {
          currentZoom = minZoom
        }
      }
    }
  }
};

const pointerListener = (event: any) => {
  console.log(event)
  CanvasStore.movePointer(event.clientX, event.clientY);
};

const CanvasRoot = () => {
  const canvas = useRef<HTMLDivElement>(null);
  const [width, height] = useSize(canvas);

  useEffect(() => {
    if (width === 0 || height === 0) return;
    CanvasStore.initialize(width, height);
  }, [width, height]);

  const frame = useRenderLoop(60);

  let isPointerDown = false;

  const startPointerScroll = (event: any) => {
    isPointerDown = true;
    const startX = event.clientX;
    const startY = event.clientY;

    const scrollListener = (event: any) => {
      if (isPointerDown) {
        const deltaX = startX - event.clientX;
        const deltaY = startY - event.clientY;
        CanvasStore.moveCamera(deltaX, deltaY);
      }
    };

    const stopScrollListener = () => {
      isPointerDown = false;
      document.removeEventListener("pointermove", scrollListener);
      document.removeEventListener("pointerup", stopScrollListener);
    };

    document.addEventListener("pointermove", scrollListener);
    document.addEventListener("pointerup", stopScrollListener);
  };

  return (
      <div className="w-full h-full">
        <div
            className="w-full h-full relative overflow-hidden overscroll-none"
            ref={canvas}
            onWheel={wheelListener}
            onPointerDown={startPointerScroll}
            onPointerUp={() => {
              isPointerDown = false;
            }}
            onPointerMove={pointerListener}
        >
          <InfiniteCanvas frame={frame}></InfiniteCanvas>
        </div>
      </div>
  );
};

export default CanvasRoot;