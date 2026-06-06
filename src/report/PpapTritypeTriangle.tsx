import { useLayoutEffect, useRef, useState, type Ref } from 'react';
import type { CenterKey } from '../lib/scoring';
import type { TriangleVertexSlot } from '../lib/tritype';
import {
  dynamicsBetweenCenters,
  selfLabelForType,
  type TritypeDiagramData,
  type TritypeDynamics,
} from '../lib/tritype';

interface Props {
  data: TritypeDiagramData;
}

const VB = { w: 400, h: 268, y0: 28 };
const VB_VISIBLE_H = VB.h - VB.y0;
const CX = VB.w / 2;

const TRI = {
  left: { x: 26, y: 252 },
  right: { x: 374, y: 252 },
};

/** 顶框底边 y（viewBox） */
const TOP_BOX_BOTTOM_Y = 90;

function pct(x: number, y: number) {
  return {
    left: `${(x / VB.w) * 100}%`,
    top: `${((y - VB.y0) / VB_VISIBLE_H) * 100}%`,
  };
}

/** 顶框半宽（viewBox），未测量时用几何腰间距的一半作初值 */
function defaultTopHalfW() {
  const y = TOP_BOX_BOTTOM_Y;
  const { left, right } = TRI;
  const t = (y - left.y) / (48 - left.y);
  const xLeft = left.x + t * (CX - left.x);
  const xRight = right.x + t * (CX - right.x);
  return (xRight - xLeft) / 2;
}

function topBoxAnchors(topHalfWVb: number | null) {
  const y = TOP_BOX_BOTTOM_Y;
  const half = topHalfWVb ?? defaultTopHalfW();
  return {
    cx: CX,
    y,
    bl: { x: CX - half, y },
    br: { x: CX + half, y },
  };
}

function trianglePoints(topHalfWVb: number | null) {
  const { bl, br } = topBoxAnchors(topHalfWVb);
  const { left, right } = TRI;
  return `${bl.x},${bl.y} ${br.x},${br.y} ${right.x},${right.y} ${left.x},${left.y}`;
}

type VbPoint = { x: number; y: number };

function edgeMid(
  from: VbPoint,
  to: VbPoint,
  offset: { x?: number; y?: number } = {}
): VbPoint {
  return {
    x: (from.x + to.x) / 2 + (offset.x ?? 0),
    y: (from.y + to.y) / 2 + (offset.y ?? 0),
  };
}

const EDGE_LABEL_OFFSET = {
  left: { x: 18, y: -2 },
  right: { x: -24, y: -2 },
  bottom: { y: -18 },
} as const;

function boxHalfWVb(topHalfWVb: number | null) {
  return topHalfWVb ?? defaultTopHalfW();
}

/** 底边起点内缩（viewBox），避免左端箭头被左下矩形遮挡 */
const BOTTOM_EDGE_INSET_LEFT = 5;

/** 底边：两矩形内侧相对边之间的端点（连线不穿过框体） */
function bottomEdgeEndpoints(boxHalf: number) {
  const { left, right } = TRI;
  return {
    from: { x: left.x + boxHalf + BOTTOM_EDGE_INSET_LEFT, y: left.y },
    to: { x: right.x - boxHalf, y: right.y },
  };
}

function edgeLayout(topHalfWVb: number | null) {
  const half = boxHalfWVb(topHalfWVb);
  const { bl, br } = topBoxAnchors(topHalfWVb);
  const { left, right } = TRI;
  const bottom = bottomEdgeEndpoints(half);
  return {
    bl,
    br,
    left,
    right,
    bottom,
    labelLeft: edgeMid(bl, left, EDGE_LABEL_OFFSET.left),
    labelRight: edgeMid(br, right, EDGE_LABEL_OFFSET.right),
    labelBottom: edgeMid(bottom.from, bottom.to, EDGE_LABEL_OFFSET.bottom),
  };
}

function TriangleEdges({ topHalfWVb }: { topHalfWVb: number | null }) {
  const { bl, br, left, right, bottom } = edgeLayout(topHalfWVb);

  return (
    <g className="ppap-tritype__edges">
      {/* 左腰：左下 → 顶（箭头指向顶）；联结词叠在线上方 */}
      <line
        className="ppap-tritype__edge-line"
        x1={left.x}
        y1={left.y}
        x2={bl.x}
        y2={bl.y}
        markerEnd="url(#ppap-tritype-arrow)"
      />
      {/* 右腰：右下 → 顶（箭头指向顶） */}
      <line
        className="ppap-tritype__edge-line"
        x1={right.x}
        y1={right.y}
        x2={br.x}
        y2={br.y}
        markerEnd="url(#ppap-tritype-arrow)"
      />
      {/* 底边：两矩形之间双箭头线 */}
      <line
        className="ppap-tritype__edge-line"
        x1={bottom.from.x}
        y1={bottom.from.y}
        x2={bottom.to.x}
        y2={bottom.to.y}
        markerStart="url(#ppap-tritype-arrow-start)"
        markerEnd="url(#ppap-tritype-arrow)"
      />
      {/* 顶边 */}
      <line className="ppap-tritype__edge-line" x1={bl.x} y1={bl.y} x2={br.x} y2={br.y} />
    </g>
  );
}

function EdgeDynamicsLabel({
  point,
  dynamics,
  variant,
}: {
  point: VbPoint;
  dynamics: TritypeDynamics;
  variant: 'left' | 'right' | 'bottom';
}) {
  return (
    <div
      className={`ppap-tritype__edge-label ppap-tritype__edge-label--${variant}`}
      style={{
        left: pct(point.x, point.y).left,
        top: pct(point.x, point.y).top,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <span className="ppap-tritype__edge-kw">{dynamics.keyword}</span>
      <p className="ppap-tritype__edge-desc">{dynamics.description}</p>
    </div>
  );
}

function SelfBox({ slot, boxRef }: { slot: TriangleVertexSlot; boxRef?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={boxRef}
      className={`ppap-tritype__box ppap-tritype__box--${slot.variant}`}
    >
      <span className="ppap-tritype__box-self">{selfLabelForType(slot.type)}</span>
    </div>
  );
}

function CornerTop({
  slot,
  wingType,
  topHalfWVb,
  topBoxRef,
}: {
  slot: TriangleVertexSlot;
  wingType: number | null;
  topHalfWVb: number | null;
  topBoxRef: Ref<HTMLDivElement>;
}) {
  const { cx, y } = topBoxAnchors(topHalfWVb);

  return (
    <div
      className="ppap-tritype__pin-top"
      style={{
        left: pct(cx, y).left,
        top: pct(cx, y).top,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <span className={`ppap-tritype__tag ppap-tritype__tag--${slot.variant} ppap-tritype__tag--above`}>
        {slot.axisLabel}
      </span>
      <div className="ppap-tritype__top-wrap">
        <SelfBox slot={slot} boxRef={topBoxRef} />
        {wingType != null && (
          <div className={`ppap-tritype__wing-ext ppap-tritype__wing-ext--${slot.variant}`}>
            <span className={`ppap-tritype__top-connector ppap-tritype__top-connector--${slot.variant}`} aria-hidden />
            <span className={`ppap-tritype__wing-name ppap-tritype__wing-name--${slot.variant}`}>
              {selfLabelForType(wingType)}
              <sup className="ppap-tritype__aux-sup">辅助自我</sup>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CornerBottomLeft({ slot }: { slot: TriangleVertexSlot }) {
  return (
    <div
      className="ppap-tritype__pin-bl"
      style={{ ...pct(TRI.left.x, TRI.left.y), transform: 'translate(-50%, -50%)' }}
    >
      <SelfBox slot={slot} />
      <span className={`ppap-tritype__tag ppap-tritype__tag--${slot.variant} ppap-tritype__tag--left-of`}>
        {slot.axisLabel}
      </span>
    </div>
  );
}

function CornerBottomRight({ slot }: { slot: TriangleVertexSlot }) {
  return (
    <div
      className="ppap-tritype__pin-br"
      style={{ ...pct(TRI.right.x, TRI.right.y), transform: 'translate(-50%, -50%)' }}
    >
      <SelfBox slot={slot} />
      <span
        className={`ppap-tritype__tag ppap-tritype__tag--${slot.variant} ppap-tritype__tag--right-of`}
      >
        {slot.axisLabel}
      </span>
    </div>
  );
}

export function PpapTritypeTriangle({ data }: Props) {
  const { top, bottomLeft, bottomRight } = data.layout;
  const stageRef = useRef<HTMLDivElement>(null);
  const topBoxRef = useRef<HTMLDivElement>(null);
  const [topHalfWVb, setTopHalfWVb] = useState<number | null>(null);

  const { labelLeft, labelRight, labelBottom } = edgeLayout(topHalfWVb);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const box = topBoxRef.current;
    if (!stage || !box) return;

    const measure = () => {
      const stageW = stage.getBoundingClientRect().width;
      const boxW = box.getBoundingClientRect().width;
      if (stageW <= 0 || boxW <= 0) return;
      setTopHalfWVb(((boxW / stageW) * VB.w) / 2);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(box);
    return () => ro.disconnect();
  }, [data.tritype, top.type, data.auxiliaryType]);

  const edgeLeft = dynamicsBetweenCenters(bottomLeft.centerKey, top.centerKey, data.edges);
  const edgeRight = dynamicsBetweenCenters(bottomRight.centerKey, top.centerKey, data.edges);
  const edgeBottom = dynamicsBetweenCenters(bottomLeft.centerKey, bottomRight.centerKey, data.edges);

  return (
    <figure className="ppap-tritype" aria-label={`三中心三角 ${data.tritype}`}>
      <div ref={stageRef} className="ppap-tritype__stage">
        <svg
          className="ppap-tritype__frame"
          viewBox={`0 ${VB.y0} ${VB.w} ${VB_VISIBLE_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <marker
              id="ppap-tritype-arrow"
              markerWidth="6"
              markerHeight="6"
              refX="5.5"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" className="ppap-tritype__arrow-head" />
            </marker>
            <marker
              id="ppap-tritype-arrow-start"
              markerWidth="6"
              markerHeight="6"
              refX="0.5"
              refY="3"
              orient="auto-start-reverse"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" className="ppap-tritype__arrow-head" />
            </marker>
          </defs>
          <polygon className="ppap-tritype__ghost" points={trianglePoints(topHalfWVb)} />
          <TriangleEdges topHalfWVb={topHalfWVb} />
        </svg>

        {edgeLeft && (
          <EdgeDynamicsLabel point={labelLeft} dynamics={edgeLeft} variant="left" />
        )}
        {edgeRight && (
          <EdgeDynamicsLabel point={labelRight} dynamics={edgeRight} variant="right" />
        )}
        {edgeBottom && (
          <EdgeDynamicsLabel point={labelBottom} dynamics={edgeBottom} variant="bottom" />
        )}

        <CornerTop
          slot={top}
          wingType={data.auxiliaryType}
          topHalfWVb={topHalfWVb}
          topBoxRef={topBoxRef}
        />
        <CornerBottomLeft slot={bottomLeft} />
        <CornerBottomRight slot={bottomRight} />
      </div>
    </figure>
  );
}
