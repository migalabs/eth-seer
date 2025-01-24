import React, { useContext, useEffect, useState, useRef } from 'react';
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';

interface Props {
    data: Record<string, any>[];
    width?: number;
    height?: number;
}

const BarChartComponent: React.FC<Props> = ({ data, width, height }) => {
    const barKeys = data[0] ? Object.keys(data[0]).filter(key => key !== 'name') : [];
    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart
                width={width || 500}
                height={height || 300}
                data={data}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                <Legend />
                {barKeys.map((key, index) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={['var(--darkPurple)', 'var(--exitedPurple)', 'var(--purpleDark)', 'var(--purple)'][index]}
                    >
                        <LabelList
                            dataKey={key}
                            position="middle"
                            style={{ fill: 'var(--white)' }}
                            className='3xs:text-[8px] 2xs:text-[9px] md:text-[16px]'
                            formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                        />
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
  );
};

export default BarChartComponent;
