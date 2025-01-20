import React, { useEffect, useState, Suspense } from 'react';
import  InputComponent  from '../common/Input';
import Image from 'next/image';
import { search } from '@/utils/services/search';
import { set } from 'zod';

function Result(Result: any) {
  if (!Result.Result) {
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
          <p>{Result.Result.title}</p>
          <p className='pt-2'>{Result.Result.price} SDG</p>
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
        const data = await search(key);
        setResults(data.data);
        data.data.forEach((item: any) => {
          console.log(item);
        });
      };
      fetchData();
    }, 1000);
    return () => clearTimeout(waitTime);
    }, [key]);
  
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex items-center border-black border-2 rounded-lg justify-between p-[24px] w-[495px] h-[78px] bg-blue_shade'>
        <Image
              src="/icons/search.svg"
              alt="search"
              width={20}
              height={20}
          />
            <InputComponent
              name='search'
              type="text"
              customStyles='max-w-[423px] max-h-[30px]'
              placeholder="إبحثي عن منتج, علامة تجارية ..."
              onChange={(e) => e.target.value ? setKey(e.target.value) : setKey('')}
              />
            </div>
              { results.map((product: any) => (
              <Result Result={product} key={product.documentId} /> 
            ))}
      </div>
  )
}
