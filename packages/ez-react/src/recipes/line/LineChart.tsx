import React, { FC, SVGAttributes, useMemo } from 'react';
import {
  Direction,
  Position,
  RawData,
  AnimationOptions,
  ChartPadding,
  GridConfig,
  AxisConfig,
  Dimensions,
  LineConfig,
  MarkerConfig,
} from 'eazychart-core/src/types';
import { TooltipProps, Tooltip } from '@/components/addons/tooltip/Tooltip';
import { Chart } from '@/components/Chart';
import { Points } from '@/components/Points';
import { Axis } from '@/components/scales/Axis';
import { Grid } from '@/components/scales/grid/Grid';
import { Line } from '@/components/shapes/Line';
import { Point } from '@/components/shapes/Point';
import { ScaleLinear } from 'eazychart-core/src';

export interface LineChartProps extends SVGAttributes<SVGGElement> {
  swapAxis?: boolean;
  rawData: RawData;
  line?: LineConfig;
  marker?: MarkerConfig;
  animationOptions?: AnimationOptions;
  padding?: ChartPadding;
  grid?: GridConfig;
  isRTL?: boolean;
  xAxis?: AxisConfig<Position.BOTTOM | Position.TOP>;
  yAxis?: AxisConfig<Position.LEFT | Position.RIGHT>;
  dimensions?: Partial<Dimensions>;
  scopedSlots?: {
    TooltipComponent: FC<TooltipProps>;
  };
  onResize?: (dimensions: Dimensions) => void;
}

export const LineChart: FC<LineChartProps> = ({
  swapAxis = false,
  rawData,
  line = {
    stroke: '#339999',
    strokeWidth: 2,
    curve: 'curveLinear',
  },
  marker = {
    hidden: true,
    radius: 5,
    color: '#FFF',
  },
  animationOptions = {
    easing: 'easeBack',
    duration: 400,
    delay: 0,
  },
  padding = {
    left: 100,
    bottom: 100,
    right: 100,
    top: 100,
  },
  grid = {
    directions: [Direction.HORIZONTAL, Direction.VERTICAL],
    color: '#a8a8a8',
  },
  xAxis = {
    domainKey: 'xValue',
  },
  yAxis = {
    domainKey: 'yValue',
  },
  isRTL = false,
  dimensions = {},
  scopedSlots = {
    TooltipComponent: Tooltip,
  },
  onResize,
}) => {
  const horizontalAxis = swapAxis ? yAxis : xAxis;
  const verticalAxis = swapAxis ? xAxis : yAxis;
  const xScale = useMemo<ScaleLinear>(
    () =>
      new ScaleLinear({
        direction: Direction.HORIZONTAL,
        domainKey: horizontalAxis.domainKey,
        nice: horizontalAxis.nice || 0,
        reverse: isRTL,
      }),
    [isRTL, horizontalAxis]
  );
  const yScale = useMemo<ScaleLinear>(
    () =>
      new ScaleLinear({
        direction: Direction.VERTICAL,
        domainKey: verticalAxis.domainKey,
        nice: verticalAxis.nice || 0,
      }),
    [verticalAxis]
  );
  return (
    <Chart
      dimensions={dimensions}
      rawData={rawData}
      scales={[xScale, yScale]}
      padding={padding}
      colors={[line.stroke]}
      animationOptions={animationOptions}
      scopedSlots={scopedSlots}
      onResize={onResize}
    >
      <Grid
        directions={grid.directions}
        color={grid.color}
        xScale={xScale}
        yScale={yScale}
      />
      <Points
        xScale={xScale}
        yScale={yScale}
        scopedSlots={{
          default: ({ scaledData }) => {
            return (
              <g className="ez-line">
                <Line
                  shapeData={scaledData}
                  curve={line.curve}
                  beta={line.beta}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                />
                {!marker.hidden &&
                  scaledData.map((pointDatum) => {
                    return (
                      <Point
                        key={pointDatum.id}
                        shapeDatum={pointDatum}
                        r={marker.radius}
                        fill={marker.color}
                        strokeWidth={line.strokeWidth}
                      />
                    );
                  })}
              </g>
            );
          },
        }}
      />
      <Axis
        position={horizontalAxis.position || Position.BOTTOM}
        aScale={xScale}
        title={horizontalAxis.title}
        titleAlign={horizontalAxis.titleAlign}
        tickLength={horizontalAxis.tickLength}
        tickCount={horizontalAxis.tickCount}
        tickSize={horizontalAxis.tickLength}
        tickFormat={horizontalAxis.tickFormat}
      />
      <Axis
        position={
          verticalAxis.position || (isRTL ? Position.RIGHT : Position.LEFT)
        }
        aScale={yScale}
        title={verticalAxis.title}
        titleAlign={verticalAxis.titleAlign}
        tickLength={verticalAxis.tickLength}
        tickCount={verticalAxis.tickCount}
        tickSize={verticalAxis.tickLength}
        tickFormat={verticalAxis.tickFormat}
      />
    </Chart>
  );
};
