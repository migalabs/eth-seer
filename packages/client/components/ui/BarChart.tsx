import React, { useContext, useEffect, useState, useRef } from 'react';
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

interface Props {
    data: Record<string, any>[];
    width?: number;
    height?: number;
}

const BarChartComponent: React.FC<Props> = ({ data, width, height }) => {
    const barKeys = data[0] ? Object.keys(data[0]).filter(key => key !== 'name') : [];
    const { themeMode } = useContext(ThemeModeContext) ?? {};
    const minValue = Math.min(...data.flatMap(item => barKeys.map(key => item[key]))); 
    const yMin = minValue < 0.55 ? 0 : 0.5;

    const [smallScreen, setSmallScreen] = useState(false);

    useEffect(() => {
        const updateScreenSize = () => {
            if (window.innerWidth > 640) {
                setSmallScreen(false);
            } else {
                setSmallScreen(true);
            }
        };

        updateScreenSize();

        window.addEventListener('resize', updateScreenSize);

        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart
                width={width || 500}
                height={height || 30}
                data={data}
            >
                <CartesianGrid
                    strokeDasharray='6 6'
                    vertical={false}
                    style={{ stroke: themeMode?.darkMode ? 'var(--darkGray)' : 'var(--bgBar)' }}
                />
                <XAxis
                    dataKey='name' 
                    style={themeMode?.darkMode ? { fill: 'var(--white)' } : { fill: 'var(--black)' }}
                />
                <YAxis
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    style={{
                        fill: themeMode?.darkMode ? 'var(--white)': 'var(--black)',
                        fontSize: smallScreen ? '10px' : '14px',
                    }}
                    domain={[yMin, 1]}
                    padding={{top: smallScreen ? 12 : 0}}
                    ticks={[0.5, 0.65, 0.8, 0.9, 1]}
                    overlineThickness={0}
                />
                <Tooltip
                    formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                    labelStyle={themeMode?.darkMode ? { fill: 'var(--white)' } : { fill: 'var(--black)' }}
                    itemStyle={themeMode?.darkMode ? { fill: 'var(--white)' } : { fill: 'var(--black)' }}
                    cursor={themeMode?.darkMode ? { fill: 'var(--bgDarkMode)' } : { fill: 'var(--bgBar)' }}
                    contentStyle={themeMode?.darkMode ? { backgroundColor: 'var(--bgDarkMode)', color: 'var(--white)' } : { backgroundColor: 'var(--white)', color: 'var(--black)' }}
                />
                <Legend
                    wrapperStyle={smallScreen ? { fontSize: '10px', margin: '0 auto', display: 'block', width: '100%' } : { fontSize: '14px' }}
                />
                {barKeys.map((key, index) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={themeMode?.darkMode ? ['var(--purple)', 'var(--exitedPurple)', 'var(--purpleDark)'][index] : ['var(--darkPurple)', 'var(--exitedPurple)', 'var(--purpleDark)'][index]}
                        color='var(--white)'
                    >
                        <LabelList
                            dataKey={key}
                            position={smallScreen ? 'top' : 'middle'}
                            offset={2}
                            style={{
                                fill: !themeMode?.darkMode && smallScreen ? 'var(--black)' : 'var(--white)'
                                }}
                            className='3xs:text-[8px] 2xs:text-[9px] md:text-[13px] ml:text-[16px]'
                            formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                        />
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
  );
};

export default BarChartComponent;
