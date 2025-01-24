import { Dot } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";

function RenderMarkdown(props: { page: string }) {
  const { page } = props;
  return (
    <Markdown
      className="w-full max-w-[750px] flex flex-col space-y-4"
      components={{
        h1: ({ children }) => (
          <h1 className="text-[22px] tablet:text-[28px] laptop:text-[32px] font-[700] pt-8">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-[22px] tablet:text-[24px] laptop:text-[28px] font-[700] pt-8">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[20] tablet:text-[24px] laptop:text-[26px] font-bold mt-3">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-[13px] tablet:text-[18px] font-[500] w-full">
            {children}
          </p>
        ),
        li: ({ children }) => (
          <>
            <li className="text-[13px] tablet:text-[18px] px-2 py-2 font-[500] w-full flex items-center">
              <Dot className="w-5 h-5 text-primary-dark" />
              {children}
            </li>
          </>
        ),
      }}
    >
      {page}
    </Markdown>
  );
}

export default RenderMarkdown;
