import { Review } from '@/interfaces/dto';
import cookie from 'js-cookie';
import React from 'react';
import ProductRate from './ProductRate';
import { useUser } from '@/components/context';
import Image from 'next/image';
import { likeFilled, likeOutline } from '@/constants/app-constants';
import { updateProductReview } from '@/utils/services/products-services';
import { useToast } from '@/hooks/use-toast';

function ProductReview({ review }: { review: Review }) {
  const user = useUser();
  const { toast } = useToast();
  const [likes, setLikes] = React.useState<string[]>(
    review.likes?.map((like) => like.documentId) || []
  );

  // const isOwner = user?.documentId === review.user.documentId;

  const likeReview = async () => {
    // if user is not logged in
    const jwt = cookie.get('jwt');
    if (!user || !user.documentId || !jwt) {
      toast({
        title: 'عذراً',
        description: 'يجب عليك تسجيل الدخول أولاً',
        variant: 'destructive',
      });
      return;
    }
    // add like to the database
    const { data, error } = await updateProductReview(
      review.documentId,
      {
        likes: [...likes, user.documentId],
      },
      jwt
    );

    if (error || !data) {
      // handle error
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الإعجاب بالمراجعة',
        variant: 'destructive',
      });
      return;
    }
    setLikes([...likes, user.documentId]);
  };

  const unlikeReview = async () => {
    // if user is not logged in
    const jwt = cookie.get('jwt');
    if (!user || !user.documentId || !jwt) {
      toast({
        title: 'عذراً',
        description: 'يجب عليك تسجيل الدخول أولاً',
        variant: 'destructive',
      });
      return;
    }
    const { data, error } = await updateProductReview(
      review.documentId,
      {
        likes: likes.filter((like) => like !== user.documentId),
      },
      jwt
    );
    if (error || !data) {
      // handle error
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إلغاء الإعجاب بالمراجعة',
        variant: 'destructive',
      });
      return;
    }
    setLikes(likes.filter((like) => like !== user.documentId));
  };

  return (
    <div className='flex flex-col py-8 px-4 w-full bg-surface border-2 border-foreground rounded-xl gap-6'>
      {/* header */}
      <div className='w-full flex justify-between items-stretch'>
        {/* username/rate */}
        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='text-sm font-[500] capitalize'>
            {review?.user?.username || 'Anonymous'}
          </div>
          <ProductRate starsNumber={review.rate} />
        </div>

        {/* date */}
        <div className='h-full flex items-center justify-center text-xs text-gray-500'>
          {new Date(review.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* content */}
      <div className='w-full flex justify-center items-center'>
        <div className='w-full text-right text-sm font-[400] text-[#20202080]'>
          {review.text}
        </div>
      </div>

      {/* footer */}
      <div className='w-full flex justify-end items-end'>
        <div className='flex items-center justify-center gap-2'>
          <div className='text-sm font-[400] text-[#20202080] flex items-center justify-center'>
            {likes.length}
          </div>
          {likes.includes(user.documentId) ? (
            <div
              className='flex items-center justify-center cursor-default'
              onClick={unlikeReview}>
              <Image
                className='object-fill object-center'
                src={likeFilled}
                alt='like'
                width={20}
                height={20}
              />
            </div>
          ) : (
            <div
              className='flex items-center justify-center cursor-pointer'
              onClick={likeReview}>
              <Image
                className='object-fill object-center'
                src={likeOutline}
                alt='like'
                width={20}
                height={20}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductReview;
