import type { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';

type Props = {
  onPick?: (value: string) => void; // 'YYYY-MM-DD'
};

const MenuCalender: NextPage<Props> = ({ onPick }) => {
  // 브라우저 기본 date-picker도 같이 쓰고 싶으면 투명 input을 맨 위에 올려둔다.
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value; // 'YYYY-MM-DD'
    if (v) onPick?.(v);
  };

  return (
    <div className="relative w-[214px] h-[222px] text-center text-xs text-white font-dm-sans select-none">
      {/* 투명 date input (원하면 제거 가능) */}
      <input
        type="date"
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        onChange={handleChange}
        aria-label="pick date"
      />

      {/* === 네가 준 Figma UI 그대로 === */}
      <div className="absolute top-0 left-0 w-[214px] h-[222px] text-left">
        <div className="absolute top-0 left-0 rounded-[7px] border border-[rgba(248,248,255,1)] box-border w-[214px] h-[222px] bg-box" />
        <Image className="absolute top-[25px] left-[167.25px] w-[27px] h-2" width={27} height={8} sizes="100vw" alt="" src="/Group 269.svg" />
        <div className="absolute top-[20px] left-[20.78px] inline-block w-[111.2px] h-3">December 2, 2021</div>
      </div>

      <div className="absolute top-[190px] left-[20.78px] w-[173.5px] h-4">
        <div className="absolute left-[0px] inline-block w-[14.5px]">27</div>
        <div className="absolute left-[27.01px] inline-block w-[14.5px]">28</div>
        <div className="absolute left-[54.02px] inline-block w-[15.6px]">29</div>
        <div className="absolute left-[79.99px] inline-block w-[16.6px]">30</div>
        <div className="absolute left-[110.12px] inline-block w-[11.4px]">31</div>
        <div className="absolute left-[140.24px] inline-block w-[4.2px]">1</div>
        <div className="absolute left-[166.21px] inline-block w-[7.3px]">2</div>
      </div>

      <div className="absolute top-[50px] left-[24.93px] w-[169.3px] h-4 text-[rgba(176,196,222,1)]">
        <div className="absolute left-0 inline-block w-[7.3px]">S</div>
        <div className="absolute left-[27.01px] inline-block w-[7.3px]">S</div>
        <div className="absolute left-[54.02px] inline-block w-[11.4px]">M</div>
        <div className="absolute left-[81.03px] inline-block w-[7.3px]">T</div>
        <div className="absolute left-[104.92px] inline-block w-[12.5px]">W</div>
        <div className="absolute left-[135.05px] inline-block w-[7.3px]">T</div>
        <div className="absolute left-[162.06px] inline-block w-[7.3px]">F</div>
      </div>

      <div className="absolute top-[74px] left-[123.62px] shadow-[0px_4px_4px_rgba(96,91,255,0.25)] rounded-full bg-button w-[24.9px] h-6" />
      <div className="absolute top-[78px] left-[20.78px] w-[173.5px] h-4">
        <div className="absolute left-0 text-[rgba(176,196,222,1)] inline-block w-[15.6px]">29</div>
        <div className="absolute left-[25.97px] text-[rgba(176,196,222,1)] inline-block w-[16.6px]">30</div>
        <div className="absolute left-[59.21px] inline-block w-[4.2px]">1</div>
        <div className="absolute left-[85.18px] inline-block w-[7.3px]">2</div>
        <div className="absolute left-[111.16px] inline-block w-[8.3px]">3</div>
        <div className="absolute left-[138.17px] inline-block w-[8.3px]">4</div>
        <div className="absolute left-[165.17px] inline-block w-[8.3px]">5</div>
      </div>

      <div className="absolute top-[106px] left-[23.89px] w-[172.4px] h-4">
        <div className="absolute left-0 inline-block w-[8.3px]">6</div>
        <div className="absolute left-[28.05px] inline-block w-[7.3px]">7</div>
        <div className="absolute left-[54.02px] inline-block w-[8.3px]">8</div>
        <div className="absolute left-[81.03px] inline-block w-[8.3px]">9</div>
        <div className="absolute left-[105.96px] inline-block w-[12.5px]">10</div>
        <div className="absolute left-[135.05px] inline-block w-[8.3px]">11</div>
        <div className="absolute left-[161.02px] inline-block w-[11.4px]">12</div>
      </div>

      <div className="absolute top-[134px] left-[22.85px] w-[173.5px] h-4">
        <div className="absolute left-0 inline-block w-[11.4px]">13</div>
        <div className="absolute left-[27.01px] inline-block w-[11.4px]">14</div>
        <div className="absolute left-[54.02px] inline-block w-[11.4px]">15</div>
        <div className="absolute left-[79.99px] inline-block w-[12.5px]">16</div>
        <div className="absolute left-[108.04px] inline-block w-[11.4px]">17</div>
        <div className="absolute left-[135.05px] inline-block w-[11.4px]">18</div>
        <div className="absolute left-[161.02px] inline-block w-[12.5px]">19</div>
      </div>

      <div className="absolute top-[162px] left-[19.74px] w-[178.7px] h-4">
        <div className="absolute left-0 inline-block w-[16.6px]">20</div>
        <div className="absolute left-[30.13px] inline-block w-[11.4px]">21</div>
        <div className="absolute left-[55.06px] inline-block w-[14.5px]">22</div>
        <div className="absolute left-[82.07px] inline-block w-[14.5px]">23</div>
        <div className="absolute left-[109.08px] inline-block w-[14.5px]">24</div>
        <div className="absolute left-[136.09px] inline-block w-[15.6px]">25</div>
        <div className="absolute left-[163.1px] inline-block w-[15.6px]">26</div>
      </div>
    </div>
  );
};

export default MenuCalender;
