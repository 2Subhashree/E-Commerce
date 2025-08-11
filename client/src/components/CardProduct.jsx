import React from 'react';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { Link } from 'react-router-dom';
import { validURLConvert } from '../utils/validURLConvert';
import { priceWithDiscount } from '../utils/PriceWithDiscount';
import AllApi from '../common/commonApi';
import AxiosToastError from "../utils/AxiosToastError"
import { useState } from 'react';
import Axios from "../utils/Axios"
import toast from 'react-hot-toast';
import { useGlobalContext } from '../provider/GlobalProvider';
import AddToCartButton from './AddToCartButton';

const CardProduct = ({data}) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`
  const [loading,setLoading] = useState(false)
  

  return (
    <Link to={url} className='w-[200px] h-[320px] border border-gray-300 lg:p-4 py-2 grid gap-2 lg:gap-3 min-w-36 lg:min-w-52 rounded mx-auto cursor-pointer bg-white'>
      <div className='h-[120px] min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hiddenflex items-center justify-center group '>
        <img
        src={data.image[0]}
        className='w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110'/>
      </div>
      <div className='flex items-center gap-1'>
        <div className='p-[1px] px-2 rounded-full text-xs w-fit text-green-600 bg-green-10
      0'>
          10 min
      </div>
      <div>
           {
          Boolean(data.discount) && (
            <p className='text-green-600 bg-green-100 w-fit px-2 text-sm rounded-full'>{data.discount}% discount</p>
          )
        }
        </div>
      </div>
      <div className='px-2 lg:px-0 font-medium text-eclipse text-sm lg:text-base line-clamp-2'>
          {data.name}
      </div>
      <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
        {data.unit}     
      </div>
      <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
        <div className='flex items-center gap-1'>
          <div className='font-semibold'>
          {DisplayPriceInRupees(priceWithDiscount(data.price, data.discount))}
        </div>
       
        </div>
        <div className=''>
          {
            data.stock === 0 ? (
              <p className='text-red-400 text-sm text-center'>Out of stock</p>
            ) : (
                <AddToCartButton data={data}/>
            )
          }
            
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;