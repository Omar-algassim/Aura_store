'use client'
import React, { useEffect, useState, Suspense } from 'react';
import  InputComponent  from '../common/Input';
import Image from 'next/image';
import { search } from '@/utils/services/search';
import Highlighter from "react-highlight-words";


interface ResultProps {
  Result: any;
  word: string;
}

const Result: React.FC<ResultProps> = ({ Result, word }) => {
  if (Result.length === 0) {
    console.log('there is no data');
    return (
      <div className='flex flex-col justify-start bg-blue_shade w-[495px] m-[2px]'>
        <div className='p-[20px] flex flex-col cursor-pointer' key={Result.documentId} >
        <p>لاتوجد نتائج</p>
      </div>
    </div>
  )} else {
  return (
    <div className='flex flex-col justify-start bg-blue_shade w-[495px] m-[2px]'>
        <div className='p-[20px] flex flex-col cursor-pointer' key={Result.documentId} >
        <Highlighter
          autoEscape={true}
          highlightClassName={'bg-primary text-white rounded-[5px] p-[2px]'}
          highlightStyle={{ fontWeight: 'normal' }}
          searchWords={word?.split(' ')}
          textToHighlight={Result.title}
        />
          <p className='pt-2'>{Result.price} SDG</p>
        </div>
    </div>
  
  )
};
}

export function Search() {
  const [key, setKey] = useState('');
  const [results, setResults] = useState([]);
  const [Typing, setTyping] = useState(false);

  useEffect(() => {
    if (!key) {
      setResults([]);
      return;
    } else setTyping(true);

    const waitTime = setTimeout(() => {
      setTyping(false);
      console.log('Search component mounted');
      const fetchData = async () => {
        const data: any = await search(key);
        setResults(data);
      };
      fetchData();
    }, 1000);
    return () => clearTimeout(waitTime);
    }, [key]);
  
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex items-center rounded-lg justify-between p-[24px] w-[495px] h-[78px] bg-blue_shade'>
        <Image
              src="/icons/search.svg"
              alt="search"
              width={20}
              height={20}
          />
            <InputComponent
              name='search'
              type="text"
              customStyles='max-w-[423px] max-h-[30px] focus:outline-none ring-2'
              placeholder="إبحثي عن منتج, علامة تجارية ..."
              onChange={(e) => e.target.value ? setKey(e.target.value) : setKey('')}
              />
            </div>
              { results ? results.map((product: any) => (
              <Result Result={product} word={key} key={product.documentId} /> 
            )) : <Result Result={[]} word={''} />}
      </div>
  )
}
