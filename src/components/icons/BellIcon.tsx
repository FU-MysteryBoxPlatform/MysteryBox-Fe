import * as React from "react";

const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="none"
    viewBox="0 0 28 28"
    {...props}
  >
    <g
      stroke="#000"
      strokeMiterlimit="10"
      strokeWidth="2"
      clipPath="url(#clip0_9_1269)"
    >
      <path
        strokeLinecap="round"
        d="M14.025 4.274c-4.138 0-7.5 3.026-7.5 6.75v3.251c0 .686-.325 1.733-.713 2.318L4.375 18.74c-.888 1.328-.275 2.802 1.35 3.297a28.9 28.9 0 0 0 16.587 0c1.513-.45 2.175-2.06 1.35-3.297l-1.437-2.148c-.375-.585-.7-1.632-.7-2.318v-3.251c0-3.713-3.375-6.75-7.5-6.75Z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.337 4.6a9.347 9.347 0 0 0-4.625 0c.363-.833 1.263-1.418 2.313-1.418s1.95.585 2.312 1.418"
      ></path>
      <path d="M17.775 22.443c0 1.856-1.687 3.375-3.75 3.375-1.025 0-1.975-.383-2.65-.99-.675-.608-1.1-1.463-1.1-2.385"></path>
    </g>
    <defs>
      <clipPath id="clip0_9_1269">
        <path fill="#fff" d="M0 0h28v28H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default BellIcon;
