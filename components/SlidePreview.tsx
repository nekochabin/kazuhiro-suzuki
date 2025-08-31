
import React, { useState, useEffect, useRef } from 'react';
import type { SlideData, Config, BarChartSlide, LineChartSlide, PieChartSlide, ProgressSlide } from '../types';

const FooterDecoration: React.FC<{ config: Config }> = ({ config }) => {
  const { COLORS } = config;
  return (
    <div className="absolute bottom-0 right-0 w-full h-full pointer-events-none" aria-hidden="true">
       <div 
        className="absolute rounded-full"
        style={{
          right: '-40px',
          bottom: '-40px',
          width: '120px',
          height: '120px',
          backgroundColor: COLORS.primary_blue,
          opacity: 0.1
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          right: '20px',
          bottom: '-30px',
          width: '90px',
          height: '90px',
          backgroundColor: COLORS.google_green,
          opacity: 0.15
        }}
      />
    </div>
  );
};

const renderStyledText = (text: any) => {
    const textContent = String(text || '');
    if (!textContent) return textContent;

    const parts = textContent.split(/(\*\*.*?\*\*)/g).filter(part => part);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
};

const CHART_COLORS = (colors: Config['COLORS']) => [
    colors.primary_blue, colors.google_green, colors.google_yellow, colors.google_red, colors.neutral_gray
];

const BarChartPreview: React.FC<{ slide: BarChartSlide; config: Config; isVisible: boolean }> = ({ slide, config, isVisible }) => {
    const data = slide.data || [];
    const maxValue = Math.max(0, ...data.map(d => d.value));
    const colors = CHART_COLORS(config.COLORS);
    const multiplier = config.FONTS.fontSizeMultiplier;
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        if (isVisible) {
          const timer = setTimeout(() => setIsAnimated(true), 100);
          return () => clearTimeout(timer);
        } else {
          setIsAnimated(false);
        }
    }, [isVisible]);
    
    return (
        <div className="flex flex-col h-full">
            <h3 className="font-bold border-b-4 pb-2" style={{ borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt` }}>{slide.title}</h3>
            {slide.subhead && <p className="mt-2 opacity-80" style={{ fontSize: `${config.FONTS.sizes.subhead * multiplier}pt` }}>{slide.subhead}</p>}
            <div className="flex-1 mt-4 flex items-end justify-around gap-2 px-4">
                {data.map((item, i) => (
                    <div key={i} className="flex flex-col items-center h-full w-full justify-end">
                        <div className="font-bold" style={{fontSize: `${config.FONTS.sizes.chip * multiplier}pt`}}>{item.value}</div>
                        <div 
                            className="w-full rounded-t-sm"
                            style={{
                                height: isAnimated ? `${maxValue > 0 ? (item.value / maxValue) * 80 : 0}%` : '0%',
                                backgroundColor: colors[i % colors.length],
                                transition: 'height 700ms ease-out'
                            }}
                        ></div>
                        <div className="text-center mt-1" style={{fontSize: `${config.FONTS.sizes.small * multiplier}pt`}}>{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChartPreview: React.FC<{ slide: LineChartSlide; config: Config; isVisible: boolean }> = ({ slide, config, isVisible }) => {
    const { datasets = [], labels = [] } = slide.data || {};
    const allValues = datasets.flatMap(ds => ds.values);
    const maxValue = Math.max(0, ...allValues);
    const minValue = Math.min(0, ...allValues);
    const colors = CHART_COLORS(config.COLORS);
    const multiplier = config.FONTS.fontSizeMultiplier;
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    const PADDING = { top: 10, right: 20, bottom: 20, left: 30 };
    const WIDTH = 500;
    const HEIGHT = 250;
    const FONT_SIZE = config.FONTS.sizes.small * multiplier;
    
    const x = (index: number) => PADDING.left + index * (WIDTH - PADDING.left - PADDING.right) / Math.max(1, labels.length - 1);
    const y = (value: number) => HEIGHT - PADDING.bottom - ((value - minValue) / (maxValue - minValue)) * (HEIGHT - PADDING.top - PADDING.bottom);

    useEffect(() => {
      if (isVisible) {
        pathRefs.current.forEach(pathEl => {
            if (pathEl) {
                const length = pathEl.getTotalLength();
                pathEl.style.strokeDasharray = `${length} ${length}`;
                pathEl.style.strokeDashoffset = `${length}`;
                setTimeout(() => {
                    pathEl.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
                    pathEl.style.strokeDashoffset = '0';
                }, 100);
            }
        });
      }
    }, [datasets, isVisible]);

    return (
        <div className="flex flex-col h-full">
            <h3 className="font-bold border-b-4 pb-2" style={{ borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt` }}>{slide.title}</h3>
            {slide.subhead && <p className="mt-2 opacity-80" style={{ fontSize: `${config.FONTS.sizes.subhead * multiplier}pt` }}>{slide.subhead}</p>}
            <div className="flex-1 mt-4 flex justify-center items-center">
                 <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full">
                    {/* Y-Axis */}
                    <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={HEIGHT - PADDING.bottom} stroke={config.COLORS.faint_gray} />
                    <text x={PADDING.left - 5} y={PADDING.top + 5} textAnchor="end" fontSize={FONT_SIZE} fill="currentColor">{maxValue}</text>
                    <text x={PADDING.left - 5} y={HEIGHT - PADDING.bottom} textAnchor="end" fontSize={FONT_SIZE} fill="currentColor">{minValue}</text>
                    
                    {/* X-Axis */}
                    <line x1={PADDING.left} y1={HEIGHT - PADDING.bottom} x2={WIDTH-PADDING.right} y2={HEIGHT - PADDING.bottom} stroke={config.COLORS.faint_gray} />
                    {labels.map((label, i) => (
                        <text key={i} x={x(i)} y={HEIGHT - PADDING.bottom + 12} textAnchor="middle" fontSize={FONT_SIZE} fill="currentColor">{label}</text>
                    ))}

                    {/* Lines and Points */}
                    {datasets.map((dataset, i) => {
                        const path = dataset.values.map((val, j) => `${j === 0 ? 'M' : 'L'}${x(j)},${y(val)}`).join(' ');
                        return (
                            <g key={i}>
                                <path ref={el => { pathRefs.current[i] = el; }} d={path} fill="none" stroke={colors[i % colors.length]} strokeWidth="2" />
                                {dataset.values.map((val, j) => (
                                    <circle key={j} cx={x(j)} cy={y(val)} r="3" fill={colors[i % colors.length]} />
                                ))}
                            </g>
                        );
                    })}
                </svg>
            </div>
            {datasets.length > 1 && (
                 <div className="flex justify-center space-x-4 mt-2" style={{fontSize: `${config.FONTS.sizes.small * multiplier}pt`}}>
                    {datasets.map((ds, i) => (
                        <div key={i} className="flex items-center">
                            <div className="w-3 h-3 rounded-sm mr-1.5" style={{backgroundColor: colors[i % colors.length]}}></div>
                            <span>{ds.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const PieChartPreview: React.FC<{ slide: PieChartSlide; config: Config; isVisible: boolean }> = ({ slide, config, isVisible }) => {
    const data = slide.data || [];
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = CHART_COLORS(config.COLORS);
    const multiplier = config.FONTS.fontSizeMultiplier;
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        if (isVisible) {
          const timer = setTimeout(() => setIsAnimated(true), 100);
          return () => clearTimeout(timer);
        } else {
          setIsAnimated(false);
        }
    }, [isVisible]);

    const getArcPath = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
        const start = {
            x: cx + radius * Math.cos(startAngle),
            y: cy + radius * Math.sin(startAngle)
        };
        const end = {
            x: cx + radius * Math.cos(endAngle),
            y: cy + radius * Math.sin(endAngle)
        };
        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} L ${cx} ${cy} Z`;
    };

    let cumulativeAngle = -Math.PI / 2;

    return (
        <div className="flex flex-col h-full">
            <h3 className="font-bold border-b-4 pb-2" style={{ borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt` }}>{slide.title}</h3>
            {slide.subhead && <p className="mt-2 opacity-80" style={{ fontSize: `${config.FONTS.sizes.subhead * multiplier}pt` }}>{slide.subhead}</p>}
            <div className="flex-1 mt-4 grid grid-cols-2 items-center">
                <div className="h-full flex justify-center items-center">
                     <svg viewBox="0 0 100 100" className={`w-4/5 h-4/5 origin-center transition-transform duration-700 ease-out ${isAnimated ? 'scale-100' : 'scale-0'}`}>
                        {data.map((item, i) => {
                            const angle = total > 0 ? (item.value / total) * 2 * Math.PI : 0;
                            const path = getArcPath(50, 50, 45, cumulativeAngle, cumulativeAngle + angle);
                            cumulativeAngle += angle;
                            return <path key={i} d={path} fill={colors[i % colors.length]} />;
                        })}
                    </svg>
                </div>
                <div className="space-y-2" style={{fontSize: `${config.FONTS.sizes.body * multiplier}pt`}}>
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center">
                            <div className="w-3 h-3 rounded-sm mr-2" style={{backgroundColor: colors[i % colors.length]}}></div>
                            <span>{item.label}: {item.value} ({total > 0 ? ((item.value/total)*100).toFixed(1) : 0}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProgressItem: React.FC<{ item: { label: string; percent: number }; config: Config; isVisible: boolean }> = ({ item, config, isVisible }) => {
    const [animatedPercent, setAnimatedPercent] = useState(0);
    const multiplier = config.FONTS.fontSizeMultiplier;
    
    useEffect(() => {
        if (isVisible) {
          const timer = setTimeout(() => setAnimatedPercent(item.percent), 100);
          return () => clearTimeout(timer);
        } else {
          setAnimatedPercent(0);
        }
    }, [item.percent, isVisible]);

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="font-medium" style={{fontSize: `${config.FONTS.sizes.body * multiplier}pt`}}>{item.label}</span>
                <span className="font-medium" style={{color: config.COLORS.primary_blue, fontSize: `${config.FONTS.sizes.chip * multiplier}pt`}}>{item.percent}%</span>
            </div>
            <div className="w-full rounded-full h-2.5" style={{backgroundColor: config.COLORS.faint_gray}}>
                <div 
                    className="h-2.5 rounded-full" 
                    style={{
                        width: `${animatedPercent}%`, 
                        backgroundColor: config.COLORS.google_green,
                        transition: 'width 700ms ease-out'
                    }}>
                </div>
            </div>
        </div>
    );
};

const Slide: React.FC<{ slide: SlideData; config: Config; isVisible: boolean }> = ({ slide, config, isVisible }) => {
  const multiplier = config.FONTS.fontSizeMultiplier;
  const hasDecoration = (type: SlideData['type']) => !['title', 'section', 'closing'].includes(type);
  const slideBgColor = slide.type === 'section' ? config.COLORS.background_gray : config.COLORS.background_white;
  const textColor = slide.type === 'section' ? config.COLORS.readable_text_on_gray : config.COLORS.readable_text_on_white;

  return (
    <div 
      className="aspect-[16/9] w-full rounded-lg shadow-xl overflow-hidden flex flex-col p-6 relative"
      style={{ 
        backgroundColor: slideBgColor,
        color: textColor || config.COLORS.text_primary
      }}
    >
      {(() => {
        switch (slide.type) {
          case 'title':
            return (
              <div className="flex flex-col justify-center h-full">
                <h1 className="font-bold" style={{ fontSize: `${config.FONTS.sizes.title * multiplier}pt` }}>{slide.title}</h1>
                <p className="mt-4" style={{ fontSize: `${config.FONTS.sizes.date * multiplier}pt` }}>{slide.date}</p>
              </div>
            );
          case 'section':
            return (
              <div className="flex flex-col justify-center items-center h-full relative">
                 <span className="absolute font-bold opacity-10" style={{color: config.COLORS.ghost_gray, fontSize: `${config.FONTS.sizes.ghostNum * multiplier}pt`}}>
                    {(slide.sectionNo || 0).toString().padStart(2, '0')}
                </span>
                <h2 className="font-bold z-10" style={{ fontSize: `${config.FONTS.sizes.sectionTitle * multiplier}pt` }}>{slide.title}</h2>
              </div>
            );
          case 'content': {
            return (
              <div className="flex flex-col h-full">
                <h3 className="font-bold border-b-4 pb-2" style={{ borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt` }}>{slide.title}</h3>
                {slide.subhead && <p className="mt-2 opacity-80" style={{ fontSize: `${config.FONTS.sizes.subhead * multiplier}pt` }}>{slide.subhead}</p>}
                
                <div className="flex-1 mt-4">
                  <div className={`${(slide.twoColumn || slide.columns) ? 'grid grid-cols-2 gap-6' : ''}`} style={{ fontSize: `${config.FONTS.sizes.body * multiplier}pt` }}>
                    {slide.points && !slide.columns &&
                      <ul className="list-disc list-inside space-y-2">
                        {slide.points.map((p, i) => <li key={i}>{renderStyledText(p)}</li>)}
                      </ul>
                    }
                    {slide.columns && slide.columns.map((col, cIdx) => (
                      <ul key={cIdx} className="list-disc list-inside space-y-2">
                        {col.map((p, pIdx) => <li key={pIdx}>{renderStyledText(p)}</li>)}
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          case 'compare':
            return (
                <div style={{fontSize: `${config.FONTS.sizes.body * multiplier}pt`}}>
                    <h3 className="font-bold border-b-4 pb-2" style={{borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt`}}>{slide.title}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="border rounded-lg shadow-sm" style={{borderColor: config.COLORS.lane_border}}>
                            <h4 className="font-bold text-center p-2 rounded-t-md" style={{backgroundColor: config.COLORS.primary_blue, color: config.COLORS.background_white, fontSize: `${config.FONTS.sizes.laneTitle * multiplier}pt`}}>{slide.leftTitle}</h4>
                            <ul className="p-4 list-disc list-inside space-y-1">
                                {slide.leftItems.map((item, i) => <li key={i}>{renderStyledText(item)}</li>)}
                            </ul>
                        </div>
                         <div className="border rounded-lg shadow-sm" style={{borderColor: config.COLORS.lane_border}}>
                            <h4 className="font-bold text-center p-2 rounded-t-md" style={{backgroundColor: config.COLORS.primary_blue, color: config.COLORS.background_white, fontSize: `${config.FONTS.sizes.laneTitle * multiplier}pt`}}>{slide.rightTitle}</h4>
                            <ul className="p-4 list-disc list-inside space-y-1">
                                {slide.rightItems.map((item, i) => <li key={i}>{renderStyledText(item)}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )
          case 'cards':
            return (
                 <div>
                    <h3 className="font-bold border-b-4 pb-2" style={{borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt`}}>{slide.title}</h3>
                    <div className={`mt-4 grid gap-4 grid-cols-${slide.columns || 3}`}>
                        {slide.items.map((item, i) => (
                            <div key={i} className="p-3 border rounded-lg shadow-sm" style={{backgroundColor: config.COLORS.card_bg, borderColor: config.COLORS.card_border, fontSize: `${config.FONTS.sizes.body * multiplier}pt`}}>
                                {typeof item === 'string' ? renderStyledText(item) : (
                                    <div>
                                        <div className="font-bold">{renderStyledText(item.title)}</div>
                                        {item.desc && <p className="mt-1" style={{ fontSize: `${config.FONTS.sizes.small * multiplier}pt` }}>{renderStyledText(item.desc)}</p>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )
          case 'diagram':
            return (
              <div className="flex flex-col h-full">
                <h3 className="font-bold border-b-4 pb-2 mb-4" style={{borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt`}}>{slide.title}</h3>
                {slide.subhead && <p className="-mt-2 mb-2 opacity-80" style={{fontSize: `${config.FONTS.sizes.subhead * multiplier}pt`}}>{slide.subhead}</p>}
                <div className="flex-1 flex justify-around items-stretch gap-2">
                  {slide.lanes.map((lane, laneIndex) => (
                    <React.Fragment key={laneIndex}>
                      <div className="flex-1 flex flex-col">
                        <div className="text-center font-bold p-2 rounded-t-md" style={{backgroundColor: config.COLORS.lane_title_bg, border: `1px solid ${config.COLORS.lane_border}`, fontSize: `${config.FONTS.sizes.laneTitle * multiplier}pt`}}>
                          {lane.title}
                        </div>
                        <div className="flex-1 flex flex-col gap-2 p-2 rounded-b-md" style={{border: `1px solid ${config.COLORS.lane_border}`, borderTop: 'none'}}>
                          {lane.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="p-3 text-center rounded-md flex-grow flex items-center justify-center shadow-sm" style={{backgroundColor: config.COLORS.card_bg, border: `1px solid ${config.COLORS.card_border}`, fontSize: `${config.FONTS.sizes.body * multiplier}pt`}}>
                              {renderStyledText(item)}
                            </div>
                          ))}
                        </div>
                      </div>
                      {laneIndex < slide.lanes.length - 1 && (
                        <div className="flex items-center justify-center px-2">
                          <svg className="w-8 h-8" style={{color: config.COLORS.primary_blue}} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          case 'table':
            return (
              <div style={{fontSize: `${config.FONTS.sizes.body * multiplier}pt`}}>
                <h3 className="font-bold border-b-4 pb-2 mb-4" style={{borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt`}}>{slide.title}</h3>
                 {slide.subhead && <p className="-mt-2 mb-2 opacity-80" style={{fontSize: `${config.FONTS.sizes.subhead * multiplier}pt`}}>{slide.subhead}</p>}
                 <div className="overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                {slide.headers.map((header, i) => (
                                    <th key={i} className="p-2 border-b-2 font-bold" style={{borderColor: config.COLORS.lane_border, backgroundColor: config.COLORS.background_gray}}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {slide.rows.map((row, i) => (
                                <tr key={i} style={{backgroundColor: i % 2 === 0 ? 'transparent' : config.COLORS.background_gray}}>
                                    {row.map((cell, j) => (
                                        <td key={j} className="p-2 border-b" style={{borderColor: config.COLORS.faint_gray}}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>
            );
          case 'process':
            return (
                <div>
                    <h3 className="font-bold border-b-4 pb-2 mb-4" style={{borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt`}}>{slide.title}</h3>
                    {slide.subhead && <p className="-mt-2 mb-2 opacity-80" style={{fontSize: `${config.FONTS.sizes.subhead * multiplier}pt`}}>{slide.subhead}</p>}
                    <div className="relative pl-10 pt-4">
                        <div className="absolute left-6 top-8 bottom-8 w-0.5" style={{backgroundColor: config.COLORS.faint_gray, left: '1.5rem'}}></div>
                        {slide.steps.map((step, i) => (
                            <div key={i} className="relative mb-6 flex items-center">
                                <div className="z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{backgroundColor: config.COLORS.primary_blue, color: config.COLORS.background_white, fontSize: `${config.FONTS.sizes.chip * multiplier}pt`}}>
                                    {i + 1}
                                </div>
                                <div className="ml-6 p-3 rounded-md flex-1" style={{backgroundColor: config.COLORS.background_gray, fontSize: `${config.FONTS.sizes.processStep * multiplier}pt`}}>
                                    {renderStyledText(step)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'timeline':
            return (
                <div>
                    <h3 className="font-bold border-b-4 pb-2 mb-4" style={{borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt`}}>{slide.title}</h3>
                    {slide.subhead && <p className="-mt-2 mb-2 opacity-80" style={{fontSize: `${config.FONTS.sizes.subhead * multiplier}pt`}}>{slide.subhead}</p>}
                    <div className="flex justify-center items-center h-4/5">
                        <div className="w-full relative px-4">
                            <div className="absolute top-1/2 left-0 w-full h-0.5" style={{backgroundColor: config.COLORS.faint_gray}}></div>
                            <div className="relative flex justify-between">
                                {slide.milestones.map((m, i) => {
                                    const stateColor = {
                                        done: config.COLORS.google_green,
                                        next: config.COLORS.google_yellow,
                                        todo: config.COLORS.neutral_gray,
                                    }[m.state || 'todo'];
                                    const isTop = i % 2 === 0;
                                    return (
                                        <div key={i} className={`flex flex-col items-center ${isTop ? 'mb-8' : 'mt-8'}`}>
                                            {isTop && <div className="text-center mb-2 font-semibold" style={{fontSize: `${config.FONTS.sizes.small * multiplier}pt`}}>{m.label}<br/><span className="font-normal opacity-70">{m.date}</span></div>}
                                            <div className="w-4 h-4 rounded-full" style={{backgroundColor: stateColor, border: `3px solid ${slideBgColor}`}}></div>
                                            {!isTop && <div className="text-center mt-2 font-semibold" style={{fontSize: `${config.FONTS.sizes.small * multiplier}pt`}}>{m.label}<br/><span className="font-normal opacity-70">{m.date}</span></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
         case 'progress':
            return (
                <div>
                    <h3 className="font-bold border-b-4 pb-2 mb-4" style={{borderColor: config.COLORS.primary_blue, width: 'fit-content', fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt`}}>{slide.title}</h3>
                    {slide.subhead && <p className="-mt-2 mb-2 opacity-80" style={{fontSize: `${config.FONTS.sizes.subhead * multiplier}pt`}}>{slide.subhead}</p>}
                    <div className="space-y-5 mt-6">
                        {(slide as ProgressSlide).items.map((item, i) => (
                            <ProgressItem key={i} item={item} config={config} isVisible={isVisible} />
                        ))}
                    </div>
                </div>
            );
          case 'barchart':
            return <BarChartPreview slide={slide} config={config} isVisible={isVisible} />;
          case 'linechart':
            return <LineChartPreview slide={slide} config={config} isVisible={isVisible} />;
          case 'piechart':
            return <PieChartPreview slide={slide} config={config} isVisible={isVisible} />;
          case 'closing':
            return (
              <div className="flex items-center justify-center h-full">
                <p className="font-bold" style={{fontSize: `${config.FONTS.sizes.title * multiplier}pt`}}>ご清聴ありがとうございました</p>
              </div>
            );
          default: {
            const unknownSlide = slide as Record<string, any>;
            return (
                <div className="text-center flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h3 className="font-semibold" style={{fontSize: `${config.FONTS.sizes.contentTitle * multiplier}pt`}}>{unknownSlide.title ?? '無題のスライド'}</h3>
                    <p className="mt-2" style={{color: config.COLORS.neutral_gray, fontSize: `${config.FONTS.sizes.body * multiplier}pt`}}>'{unknownSlide.type}' のプレビューは実装されていません。</p>
                    <p className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded" style={{fontSize: `${config.FONTS.sizes.small * multiplier}pt`}}>
                        このスライドタイプは現在プレビューできませんが、生成されるスクリプトには正しく反映されます。
                    </p>
                </div>
            );
          }
        }
      })()}
      {hasDecoration(slide.type) && <FooterDecoration config={config} />}
    </div>
  )
};

interface SlidePreviewProps {
  slides: SlideData[];
  config: Config;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slides, config }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  
  const goToNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);
  const goToPrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div>
      <div className="relative">
         <Slide slide={activeSlide} config={config} isVisible={true}/>
         {slides.length > 1 && (
           <>
             <button onClick={goToPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-opacity duration-300 opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             </button>
             <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-opacity duration-300 opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </button>
           </>
         )}
      </div>

      {slides.length > 1 && (
        <div className="mt-4">
          <p className="text-center text-sm font-semibold mb-2">{activeIndex + 1} / {slides.length}</p>
          <div className="flex justify-center items-center gap-2 overflow-x-auto p-2">
            {slides.map((slide, index) => (
              <button 
                key={index} 
                onClick={() => setActiveIndex(index)}
                className={`w-24 h-[54px] rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 ${activeIndex === index ? 'ring-2 ring-g-blue ring-offset-2 dark:ring-offset-gray-800' : 'opacity-60 hover:opacity-100'}`}
                style={{
                  backgroundColor: slide.type === 'section' ? config.COLORS.background_gray : config.COLORS.background_white,
                }}
              >
                <div className="transform scale-[0.15] origin-top-left">
                   <div className="w-[960px] h-[540px] overflow-hidden">
                       <Slide slide={slide} config={config} isVisible={false} />
                   </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidePreview;
