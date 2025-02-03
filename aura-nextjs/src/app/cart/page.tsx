"use client";
import Cookie from "js-cookie";
import React, { JSX } from "react";
import { useCart, useCartDispatcher, useUser } from "@/components/context";
import { BaseUrl } from "@/constants/api-constants";
import Image from "next/image";
import { ButtonPrimary } from "@/components/common/Buttons";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { CartProductsDTO, Product } from "@/interfaces/dto";
import AlertDialogElement from "@/components/common/alert-dialog";
import { CartEntity } from "@/entities/cart-entity";



interface CartProductProps {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function ProductControls(data: CartProductsDTO): JSX.Element {
  const { product, amount } = data.product;
  const cart = useCart() as CartEntity;
  const cartDispatcher = useCartDispatcher();
  const [quantity, setQuantity] = React.useState(amount);


  async function decreaseQuantity() {
    setQuantity(quantity - 1);
    await cart.removeProduct(product);
    cartDispatcher({ type: "UPDATE", payload: { cart } });
  }
  async function increaseQuantity() {
    setQuantity(quantity + 1);
    await cart.addProduct(product);
    cartDispatcher({ type: "UPDATE", payload: { cart } });
    console.log("cart after increas", cart);
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex">
        {/* decrease */}
        <div
          className={`flex w-[40px] h-[35px] items-center justify-center border-2 rounded-lg ${
            quantity >= product.stock && "opacity-50"
          }"`}
        >
          <button
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
          >
            <Plus size={15} fontWeight={700} color="#202020" />
          </button>
        </div>

        {/* amount */}
        <div className="flex w-[40px] h-[35px] items-center justify-center border-0 rounded-lg">
          <p className="text-[18px] font-[500] p-5">{quantity}</p>
        </div>

        {/* increase  */}
        <div
          className={`flex w-[40px] h-[35px] items-center justify-center border-2 rounded-lg ${
            quantity <= 1 && "opacity-50"
          }`}
        >
          <button onClick={decreaseQuantity} disabled={quantity <= 1}>
            <Minus size={15} fontWeight={700} color="#202020" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CartProduct(props: CartProductProps) {
  return (
    <div className="flex items-center justify-center w-[320px] h-[120px] bg-white rounded-[12px] shadow-lg mb-[16px]">
      <div className="flex items-center justify-center w-[100px] h-[100px]">
        <Image src={props.image} alt={props.name} width={100} height={100} />
      </div>
      <div className="flex flex-col mr-[60px] justify-center w-[245px] h-[100px]">
        <p>{props.name}</p>
        <p>{props.price} SDG</p>
      </div>
    </div>
  );
}

export default function CartPage() {
  const cart = useCart() as CartEntity;
  const user = useUser();
  const cartDispatcher = useCartDispatcher();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [cartProducts, setCartProducts] = React.useState(cart.products);

  React.useEffect(() => {
    console.log("cart is changed", cart);
    setCartProducts(cart.products);
  }, [cart.total_items]);

  async function clear(product: Product) {
    await cart.clearProduct(product);
    cartDispatcher({ type: "UPDATE", payload: { cart } });
    setCartProducts(cart.products);
  }

  function checkout() {
    if(!user.documentId) {
      console.log('you have to login first')
      setLoggedIn(true)
    }
    // Cookie.set('nextPage', '/cart/checkout')
    router.push('/cart/checkout')
    
  }

  if (cart?.total_items === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/icons/cart-empty.svg"
            alt="Empty Cart"
            width={64}
            height={64}
          />
          <div className="text-center pt-[24px]">
            <p>
              <strong> سلة التسويق فارغة حاليا </strong>
            </p>
            <p className="pt-[16px]">إكتشفي منتجاتنا وابدئي التسوق الأن</p>
          </div>
        </div>
        <ButtonPrimary
          className="w-[345px] mt-[50px]"
          handleClick={() => router.push("/products")}
        >
          إبدئي التسوق
        </ButtonPrimary>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen gap-5 p-4 overflow-scroll bg-blue_shade">
        {cartProducts &&
          Object.values(cartProducts).map((product) => (
            <div
              className="flex flex-col items-center gap-2 justify-between bg-white p-[24px] w-[362px] h-[248px]"
              key={product.product.documentId}
            >
              <div className="flex flex-col items-center justify-center">
                <CartProduct
                  key={product.product.documentId}
                  name={product.product.title}
                  price={product.product.price}
                  quantity={product.amount}
                  image={`${BaseUrl}${product.product.thumbnail}`}
                />
              </div>
              <div className="flex items-center justify-between w-[320px] h-[800px]">
                <ProductControls product={product} />
                <AlertDialogElement
                  header="حذف المنتج"
                  body="هل تريدين حقا حذف هذا المنتج من سلة التسوق؟"
                  action_text="تأكيد"
                  cancel="إلغاء"
                  action={async () => await clear(product.product)}
                >
                  <Image
                    src="/icons/trash.svg"
                    alt="Delete"
                    className="cursor-pointer"
                    width={24}
                    height={24}
                  />
                </AlertDialogElement>
              </div>
            </div>
          ))}
      </div>
      {/* checkout section */}
      <div className="flex flex-col items-start justify-between p-5 gap-5">
          <strong>تفاصيل الفاتورة</strong>
        {/* container of prices and titles */}
        <div className="flex justify-between w-[500px]">
          {/* title of price */}
          <div className="flex flex-col justify-center gap-5">
            <p>{`المجموع الفرعي ( ${cart.total_items} منتجات)`  }</p>
            <p>رسوم التوصيل</p>
          </div>
          {/* prices */}
          <div className="flex flex-col justify-center gap-5">
            <strong>{`${Math.floor(cart.total_pay)}`} SDG</strong>
            <strong>SDG 3000</strong>
          </div>
        </div>
        <div className="flex justify-center gap-10">
        </div>
        <div className="flex flex-col items-center gap-14">
        <p>نطاق التوصيل يشمل مدينة بورتسودان فقط في الوقت الراهن.
           نعمل على توسيع خدماتنا قريبا</p>
           <ButtonPrimary
           handleClick={checkout}
           >متابعة الشراء</ButtonPrimary>
           {loggedIn && <AlertDialogElement
           open={true}
           action_text="تسجيل الدخول"
           action={() => router.push('/login')}
           cancel="الغاء"
           body="لمتابعة عملية الشراء عليك تسجيل الدخول اولا"
           ><></></AlertDialogElement>}
          </div>
      </div>
    </>
  );
}
