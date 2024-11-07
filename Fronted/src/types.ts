import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Bottle = {
  id: string;
  from: string;
  to?: string;
  displayMsg: string;
  createAt: string;
  msgs: {
    content: string;
    mediaType: string;
  }[];
  isOpen:boolean,
};
