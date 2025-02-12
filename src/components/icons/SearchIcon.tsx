import * as React from "react";

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="none"
    viewBox="0 0 28 28"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth="2"
      d="m24.5 24.5-5.234-5.243m2.9-7.007a9.917 9.917 0 1 1-19.832 0 9.917 9.917 0 0 1 19.833 0z"
    ></path>
  </svg>
);

export default SearchIcon;
