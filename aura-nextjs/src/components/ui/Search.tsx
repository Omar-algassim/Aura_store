/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import InputComponent from "../common/Input";
import { search } from "@/utils/services/search";
import Highlighter from "react-highlight-words";
import { MagnifyingGlass } from "react-loader-spinner";
import Link from "next/link";
import { Product } from "@/interfaces/dto";

interface ResultProps {
  Result: Product | null;
  word: string;
}

function Loading() {
  return (
    <div className="flex flex-col justify-center items-center bg-blue_shade w-[495px] m-[2px]">
      <MagnifyingGlass
        visible={true}
        height="50"
        width="50"
        ariaLabel="magnifying-glass-loading"
        wrapperStyle={{}}
        wrapperClass="magnifying-glass-wrapper"
        glassColor="#c0efff"
        color="#8b0e50"
      />
    </div>
  );
}
const Result: React.FC<ResultProps> = ({ Result, word }) => {
  console.log("Result", Result);
  if (!Result) {
    return (
      <div className="flex flex-col justify-start bg-blue_shade w-[495px] m-[2px]">
        <div
          className="p-[20px] flex flex-col cursor-default items-center opacity-75"
          key={word}
        >
          <p>-- لاتوجد نتائج --</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-start bg-blue_shade w-full m-[2px]">
        <Link
          className="p-[20px] flex flex-col cursor-pointer"
          href={`/products/${Result.documentId}`}
          key={Result.documentId}
        >
          <Highlighter
            autoEscape={true}
            highlightClassName={"bg-primary text-white rounded-[5px] p-[2px]"}
            highlightStyle={{ fontWeight: "normal" }}
            searchWords={word?.split(" ")}
            textToHighlight={Result.title}
          />
          <div className="flex gap-x-2 pt-2">
            <p className={`${Result?.discount && "opacity-75 line-through"}`}>
              {Result.price} SDG
            </p>
            {Result?.discount && (
              <p className="text-primary">
                {Math.round(
                  Result.price - (Result.price * Result.discount) / 100
                )}
              </p>
            )}
          </div>
        </Link>
      </div>
    );
  }
};

export function Search() {
  const [key, setKey] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [Typing, setTyping] = useState(false);

  useEffect(() => {
    if (!key) {
      setResults([]);
      setTyping(false);
      return;
    } else setTyping(true);

    const waitTime = setTimeout(() => {
      console.log("Search component mounted");
      const fetchData = async () => {
        try {
          const { error, data } = await search(key);
          if (error || !data) {
            throw new Error("Error fetching data");
          }
          setTyping(false);
          setResults(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }, 1000);
    return () => clearTimeout(waitTime);
  }, [key]);

  // for hiding the search results when clicked outside
  useEffect(() => {
    const handleClick = (e: any) => {
      if (e.target.id === "result-container") return;
      setResults([]);
      setKey("");
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center relative z-30">
        <div className="flex items-center rounded-lg justify-between p-[24px] w-full max-w-[495px] h-[78px] bg-blue_shade has-[:focus]:ring-2 has-[:focus]:ring-primary">
          <InputComponent
            name="search"
            type="search"
            value={key}
            customStyles="peer shadow-none max-w-[423px] max-h-[30px] focus:outline-none bg-blue_shade"
            placeholder="إبحثي عن منتج, علامة تجارية ..."
            onChange={(e) =>
              e.target.value ? setKey(e.target.value) : setKey("")
            }
          />
        </div>
        <div
          className="w-full max-w-[495px] max-h-[420px] p-0 m-0 mt-2 overflow-x-hidden overflow-y-auto rounded-xl flex flex-col justify-center peer-focus:animate-scaleIn peer-placeholder-shown:animate-scaleOut"
          id="result-container"
          onClick={() => {
            setKey("");
            setResults([]);
          }}
        >
          {Typing ? (
            <Loading />
          ) : results?.length > 0 ? (
            <>
              {results.map((product: Product) => (
                <Result Result={product} word={key} key={product.documentId} />
              ))}
              {/* <div className="w-full flex items-center justify-center absolute bottom-0 left-0 right-0">
                <ArrowDownCircle
                  size={32}
                  color="#f2f2f2"
                  fill="#00000080"
                  className="animate-caret-blink ease-in-out"
                />
              </div> */}
            </>
          ) : (
            key.length > 0 && <Result Result={null} word={""} />
          )}
        </div>
      </div>
      {/* overlay */}
      {(Typing || results.length > 0) && (
        <div
          className="fixed z-20 bg-[#00000065] top-0 bottom-0  w-full h-screen  left-0 peer-has-[:focus]:animate-fadeIn peer-placeholder-shown:animate-scaleOut"
          aria-expanded
        ></div>
      )}
    </>
  );
}
