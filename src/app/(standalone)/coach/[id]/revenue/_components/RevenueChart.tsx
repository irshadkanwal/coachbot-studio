'use client';

import { Fragment, ReactElement, useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Theme, useTheme } from '@/contexts/ThemeContext';
import { getFormatedDate } from '@/lib/utils/date.utils';

export const revenueData = [
  {
    month: getFormatedDate(new Date(new Date().getFullYear(), new Date().getMonth() - 1), 'en-US', { month: 'short' }),
    revenue: 0,
  },
  { month: getFormatedDate(new Date(), 'en-US', { month: 'short' }), revenue: 0 },
  // { month: 'Aug', revenue: 1300, priceUpdate: { date: 'May 25, 2025', monthly: '€27.00' } },
];

const COLORS_MAP = {
  [Theme.LIGHT]: {
    backgroundAreaColor: '#3ABEB80F',
    gridColor: '#443F572E',
    inactiveDotColor: '#473F65',
    activeDotColor: '#3EBBA7',
    xLableColor: '#AFB1BD',
    yLabelColor: '#7B7592',
  },
  [Theme.DARK]: {
    backgroundAreaColor: '#3ABEB80F',
    gridColor: '#FFFFFF0F',
    inactiveDotColor: '#FFFFFF',
    activeDotColor: '#3ABEB8',
    xLableColor: '#727379',
    yLabelColor: '#B6B6B6',
  },
} as const;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { priceUpdate } = payload[0].payload || {};

    if (!priceUpdate) return null;

    return (
      <div className="flex flex-col gap-y-2 rounded-xl bg-main p-3.5 text-center text-background">
        <div className="mb-3 text-xs font-bold">Price updated: {priceUpdate.date}</div>
        <div
          className={`flex flex-col gap-y-1 text-xs ${!!priceUpdate.yearly ? 'border-b border-background pb-2' : ''}`}
        >
          <strong>
            *MONTHLY <span className="font-light">(Required)</span>:
          </strong>
          <span className="text-lg"> {priceUpdate.monthly}</span>
        </div>
        {priceUpdate.yearly && (
          <div className={`flex flex-col gap-y-1 text-xs`}>
            <strong>
              YEARLY <span className="font-light">(Optional)</span>:
            </strong>
            <span className="text-lg"> {priceUpdate.yearly}</span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const CustomDot = ({
  cx,
  cy,
  payload,
  isActive,
  theme = Theme.DARK,
}: {
  cx: number;
  cy: number;
  payload: any;
  isActive: boolean;
  theme?: Theme;
}): ReactElement | null => {
  if (!payload || !payload.priceUpdate || !cx || !cy) return null;

  const { activeDotColor, inactiveDotColor } = COLORS_MAP[theme];
  const color = isActive ? activeDotColor : inactiveDotColor;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={!!payload.priceUpdate.yearly ? 10 : 6}
      fill={color}
      stroke={color}
      strokeWidth={2}
      style={{ transition: 'all 0.2s ease' }}
    />
  );
};

export default function RevenueChart() {
  const { theme } = useTheme();
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
  const numTicks = 7;
  const roughStep = maxRevenue / numTicks;
  const stepMagnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const roundedStep = Math.ceil(roughStep / stepMagnitude) * stepMagnitude;
  const paddedMax = Math.ceil(maxRevenue / roundedStep) * roundedStep;
  const yTicks = Array.from({ length: Math.floor(paddedMax / roundedStep) + 1 }, (_, i) => i * roundedStep);

  const oddAreas = useMemo(() => {
    const areas = [];
    for (let i = 0; i < revenueData.length; i++) {
      if (i % 2 === 0) continue;
      const start = revenueData[i - 1]?.month;
      const end = revenueData[i]?.month;

      if (start && end) {
        areas.push(<ReferenceArea key={`bg-${i}`} x1={start} x2={end} strokeOpacity={0} fill="#3ABEB80F" />);
      }
    }
    return areas;
  }, [revenueData]);

  return (
    <div className="flex h-full min-h-[35dvh] w-full flex-grow flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={revenueData}
          margin={{
            right: 20,
            top: 20,
          }}
        >
          <CartesianGrid stroke={COLORS_MAP[theme].gridColor} horizontal vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: COLORS_MAP[theme].xLableColor, fontSize: 14, textAnchor: 'start' }}
            padding={{ right: 30 }}
          />
          <YAxis
            dataKey="revenue"
            axisLine={false}
            tickLine={false}
            ticks={yTicks.length ? yTicks : [0, 200, 400, 600, 800, 1000]}
            allowDataOverflow={true}
            tickFormatter={(value) => (value === 0 ? '€' : value)}
            tick={{ fill: COLORS_MAP[theme].yLabelColor, fontSize: 14 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          {oddAreas}

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3ABEB8"
            fill="#3ABEB8"
            strokeWidth={4}
            dot={({ key, payload, cx, cy }) =>
              payload?.priceUpdate ? (
                <CustomDot key={key} cx={cx} cy={cy} payload={payload} isActive={false} theme={theme} />
              ) : (
                <Fragment key={key} />
              )
            }
            activeDot={({ key, payload, cx, cy }) =>
              payload?.priceUpdate ? (
                <CustomDot key={key} cx={cx} cy={cy} payload={payload} isActive={true} theme={theme} />
              ) : (
                <Fragment key={key} />
              )
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
