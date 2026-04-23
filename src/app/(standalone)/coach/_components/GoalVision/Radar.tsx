'use client';

import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { nanoid } from 'nanoid';

import { Theme, useTheme } from '@/contexts/ThemeContext';
import { useIsClient } from '@/hooks/useIsClient';

const LABEL_COLORS = {
  [Theme.LIGHT]: {
    disabledCircleColor: '#d8d8d8',
    circleColor: '#AFB1BD',
    dotColor: '#33B3A9',
    activeColor: '#473F65',
    highlightDotColor: '#b6b6b6',
  },
  [Theme.DARK]: {
    disabledCircleColor: '#616266',
    circleColor: '#727379',
    dotColor: '#33B3A9',
    activeColor: '#FFFFFF',
    highlightDotColor: '#b6b6b6',
  },
} as const;

const LABEL_HEIGHT = 46;
const MIN_LABEL_WIDTH = 400;
const MIN_CHART_RADIUS = 85;

export interface DataItem {
  id: string;
  name: string;
  displayName?: string;
  active?: boolean;
  labelWidth?: number;
}

export const RadarChart = <T extends DataItem>({
  data,
  ignoreDataIds,
  isDisabled,
  children,
  onClick,
}: {
  data: T[];
  ignoreDataIds?: string[];
  isDisabled?: boolean;
  children: (item: DataItem, id: string) => ReactNode;
  onClick?: (item: T) => any;
}) => {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const { dotColor, circleColor, activeColor, highlightDotColor, disabledCircleColor } = LABEL_COLORS[theme];

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [id, setId] = useState<string>();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const dimensions = useMemo(() => {
    const chartRadius = Math.min(MIN_CHART_RADIUS, (svgWidth / 3) * 0.2);
    const dataSpacingFactor = data.length <= 6 ? 1 : data.length >= 9 ? 0.95 : 1.05;
    const labelRadius = chartRadius + LABEL_HEIGHT * dataSpacingFactor;

    return {
      width: svgWidth,
      height: svgHeight,
      labelHeight: LABEL_HEIGHT,
      chartRadius,
      labelRadius,
    };
  }, [svgHeight, svgWidth, data.length]);

  const circles = d3.range(1, 11).reverse();
  const radiusScale = d3.scaleLinear().domain([0, 10]).range([0, dimensions.chartRadius]).nice();

  const getAngleScale = useCallback((dataLength: number, i: number) => {
    const angleScale = d3
      .scaleLinear()
      .domain(d3.extent(d3.range(dataLength + 1)) as any)
      .range([0, 2 * Math.PI]);

    return angleScale(i);
  }, []);

  const highlightDot = useCallback(
    (d: DataItem, highlight: boolean) => {
      const selectedDot = d3.select(`circle.${id}-dot[data-key='${d.id}']`);

      if (!selectedDot.empty() && !d.active) {
        selectedDot.attr('fill', highlight ? highlightDotColor : dotColor);
      }
    },
    [id]
  );

  const getCoordinatesForDot = useCallback(
    (angle: number, offset = 1) => {
      return [
        dimensions.chartRadius * Math.cos(angle - Math.PI / 2) * offset,
        dimensions.chartRadius * Math.sin(angle - Math.PI / 2) * offset,
      ];
    },
    [dimensions.chartRadius]
  );

  const getCoordinatesForLabel = useCallback(
    (angle: number) => {
      const angleOffset = angle - Math.PI / 2;
      // determines how close the label to the Y axis
      const verticalFactor = Math.pow(Math.abs(Math.sin(angleOffset)), 1.5);
      const verticalItemOffset =
        svgWidth < 600
          ? dimensions.labelHeight * (verticalFactor === 1 ? 0.6 : 0.2)
          : dimensions.labelHeight * (verticalFactor === 1 ? 0.8 : 0.3);
      const extraPush = verticalFactor > 0.9 ? verticalItemOffset : 0;
      const adjustedRadius = dimensions.labelRadius + dimensions.labelHeight * 0.5 + extraPush;

      return [dimensions.labelRadius * Math.cos(angleOffset), adjustedRadius * Math.sin(angleOffset)];
    },
    [dimensions.labelRadius, dimensions.labelHeight, svgWidth]
  );

  const calculateLabelWidth = (index: number) => {
    const angle = getAngleScale(data.length, index);
    const [labelX] = getCoordinatesForLabel(angle);
    let maxLabelWidth = svgWidth / 2 - dimensions.labelRadius;

    if (labelX > 0) maxLabelWidth = svgWidth / 2 - labelX;
    if (labelX < 0) maxLabelWidth = svgWidth / 2 + labelX;

    return Math.max(0, Math.min(maxLabelWidth, MIN_LABEL_WIDTH));
  };

  const actualData = useMemo(() => data.filter((d) => !ignoreDataIds?.includes(d.id)), [data, ignoreDataIds]);
  const foreignObjectData = useMemo(
    () => data.map((item, i) => ({ ...item, labelWidth: calculateLabelWidth(i) })),
    [data, svgWidth, dimensions.chartRadius]
  );

  useEffect(() => {
    setId(CSS.escape(`id-${nanoid()}`));

    const updateSvgWidth = () => {
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        setSvgHeight(svgRect.height);
        setSvgWidth(svgRect.width);
      }
    };

    updateSvgWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateSvgWidth();
    });

    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <svg
      id={id}
      width="100%"
      height="100%"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      preserveAspectRatio="xMidYMid meet"
      ref={svgRef}
      className="overflow-visible"
    >
      <g className={`${id}-chartGroup`} transform={`translate(${svgWidth / 2} ,${svgHeight / 2} )`}>
        {circles.map((circle: number, i: number) => (
          <circle
            key={`circle-${i}`}
            className={`${id}-circle`}
            r={radiusScale(circle)}
            fill="none"
            strokeWidth="0.5"
            {...(isClient ? { stroke: isDisabled ? disabledCircleColor : circleColor } : {})}
          />
        ))}

        {actualData.map((item: DataItem, i: number) => {
          const angle = getAngleScale(actualData.length, i);
          const [x, y] = getCoordinatesForDot(angle);

          return (
            <g key={`axis-${i}`} className={`${id}-axis`}>
              <line
                x1="0"
                x2={x}
                y1="0"
                y2={y}
                {...(isClient ? { stroke: isDisabled ? disabledCircleColor : circleColor } : {})}
                strokeWidth="0.5"
              />
              <circle
                className={`${id}-dot z-10 cursor-pointer`}
                data-key={item.id}
                cx={x}
                cy={y}
                r={dimensions.chartRadius / 10}
                fill={isDisabled ? disabledCircleColor : item.active ? activeColor : dotColor}
                onMouseEnter={() => highlightDot(item, true)}
                onMouseLeave={() => highlightDot(item, false)}
                onClick={() => onClick?.(item as T)}
              />
            </g>
          );
        })}

        {foreignObjectData.map((item: DataItem, i: number) => {
          const angle = getAngleScale(foreignObjectData.length, i);
          const [labelX, labelY] = getCoordinatesForLabel(angle);
          const offsetX = labelX < 0 ? item.labelWidth : labelX < 3 ? item.labelWidth! / 2 : 0;
          const isPlaceholder = ignoreDataIds?.includes(item.id);

          return (
            <foreignObject
              key={`label-${i}`}
              x={labelX - offsetX!}
              y={labelY - dimensions.labelHeight / 2}
              width={item.labelWidth}
              height={dimensions.labelHeight}
              className={`${id}-label`}
              onMouseEnter={() => !isPlaceholder && highlightDot(item, true)}
              onMouseLeave={() => !isPlaceholder && highlightDot(item, false)}
              onClick={() => onClick?.(item as T)}
            >
              {children(item, id || i.toString())}
            </foreignObject>
          );
        })}
      </g>
    </svg>
  );
};
