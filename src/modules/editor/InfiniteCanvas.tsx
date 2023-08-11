import React from "react";
import { RECT_H, RECT_W } from "../../modules/core/constants";
import { CanvasPosition, Position } from "../../modules/core/foundation";
import CanvasStore from "../../modules/state/CanvasStore";
import { memo } from "react";

interface TextBlockProps extends CanvasPosition {
  text: string;
  color: string;
  width: number;
  height: number;
}

const TextBlock = ({
  text,
  color,
  left,
  top,
  width,
  height
}: TextBlockProps) => {
  return (
    <Position left={left} top={top} width={width} height={height}>
      <div
        className="flex items-center justify-center"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: color
        }}
      >
        {text}
      </div>
    </Position>
  );
};

const InfiniteCanvas = ({ frame }: { frame: string }) => {
  function createCustomSequenceArray(sequence: Array<string>, length: number) {
    const result = [];

    for (let i = 0; i < length; i++) {
      result.push(sequence[i % sequence.length]);
    }

    return result;
  }

  const arrayLength = 64;
  const colorSequence = ["#769656", "#eeeed2", "#baca44"];
  const textsSequence = [
    "Infinite Canvases Are Easy When You Know The Fundamentals",
    "Canvases",
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  ];

  const texts = createCustomSequenceArray(textsSequence, arrayLength);
  const colors = createCustomSequenceArray(colorSequence, arrayLength);

  const rectW = RECT_W;
  const rectH = RECT_H;
  const scale = CanvasStore.scale;

  return (
    <div
      className="w-full h-full"
      style={{
        transform: `scale(${(scale.x, scale.y)})`,
        transformOrigin: "top left"
      }}
    >
      {texts.map((text, index) => (
        <TextBlock
          key={index}
          text={text}
          color={colors[index]}
          left={(index % 8) * rectW}
          top={Math.floor(index / 8) * rectH}
          width={rectW}
          height={rectH}
        />
      ))}
    </div>
  );
};

export default memo(InfiniteCanvas);
