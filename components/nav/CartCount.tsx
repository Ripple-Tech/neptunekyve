'use client'
import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation"
import  {CiShoppingCart} from 'react-icons/ci'

const CartCount = () => {
    const {cartTotalQty} = useCart();
    const router = useRouter()
  return (
    <div className='relative cursor-pointer' onClick={() => router.push('/cart')} >
     <div className="text-2xl ">
        <CiShoppingCart size={29}/>
     </div>
     <span className="absolute top-[-10px] right-[-10px] bg-primary text-white h-5 w-5 flex rounded-full items-center justify-center text-xs">
      {cartTotalQty}
     </span>
    </div>
  )
}

export default CartCount