"use client";
import React, { useEffect, useState, Suspense } from "react";
import InputComponent from "../common/Input";
import { search } from "@/utils/services/search";
import Highlighter from "react-highlight-words";
import { MagnifyingGlass } from "react-loader-spinner";
import { useRouter } from "next/navigation";

interface ResultProps {
  Result: any;
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
  const route = useRouter();
  if (Result.length === 0) {
    return (
      <div className="flex flex-col justify-start bg-blue_shade w-[495px] m-[2px]">
        <div
          className="p-[20px] flex flex-col cursor-default items-center opacity-75"
          key={Result.documentId}
        >
          <p>-- لاتوجد نتائج --</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-start bg-blue_shade w-[495px] m-[2px]">
        <div
          className="p-[20px] flex flex-col cursor-pointer"
          onClick={() => route.push(`/products/${Result.documentId}`)}
          key={Result.documentId}
        >
          <Highlighter
            autoEscape={true}
            highlightClassName={"bg-primary text-white rounded-[5px] p-[2px]"}
            highlightStyle={{ fontWeight: "normal" }}
            searchWords={word?.split(" ")}
            textToHighlight={Result.title}
          />
          <p className="pt-2">{Result.price} SDG</p>
        </div>
      </div>
    );
  }
};

export function Search() {
  const [key, setKey] = useState("");
  const [results, setResults] = useState([]);
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
          const data: any = await search(key);
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

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex items-center rounded-lg justify-between p-[24px] w-[495px] h-[78px] bg-blue_shade has-[:focus]:ring-2 has-[:focus]:ring-black">
        <InputComponent
          name="search"
          type="search"
          customStyles="peer max-w-[423px] max-h-[30px] focus:outline-none bg-blue_shade"
          placeholder="إبحثي عن منتج, علامة تجارية ..."
          onChange={(e) =>
            e.target.value ? setKey(e.target.value) : setKey("")
          }
        />
      </div>
      {Typing ? (
        <Loading />
      ) : results ? (
        results.map((product: any) => (
          <Result Result={product} word={key} key={product.documentId} />
        ))
      ) : (
        <Result Result={[]} word={""} />
      )}
    </div>
  );
}
