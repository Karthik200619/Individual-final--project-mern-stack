import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'

function DeliveryTracker() {

    const { deliveryId } = useParams()

    const [delivery,setDelivery] = useState(null)

    useEffect(()=>{

        const getDelivery = async()=>{

            try{

                const res = await axios.get(
                    `https://individual-final-project-mern-stack.onrender.com/user-api/delivery/${deliveryId}`,
                    {
                        withCredentials:true
                    }
                )

                setDelivery(res.data.payload)

            }
            catch(err){

                console.log(err)

            }

        }

        getDelivery()

    },[deliveryId])

    if(!delivery){

        return <div>Loading...</div>

    }

    const statuses = [

        'pending',

        'accepted',

        'meetup_confirmed',

        'out_for_delivery',

        'delivered',

        'completed'

    ]

    const currentIndex = statuses.indexOf(
        delivery.status
    )

    return (

        <div className='min-h-screen bg-gray-100 p-4'>

            <div className='bg-white rounded-2xl p-5'>

                <h1 className='text-2xl font-bold'>
                    Delivery Tracker
                </h1>

                <p className='text-sm text-gray-500 mt-2'>
                    Meetup Location:
                    {delivery.meetupLocation}
                </p>

                <p className='text-sm text-gray-500 mt-1'>
                    Type:
                    {delivery.deliveryType}
                </p>

                <div className='mt-8 space-y-5'>

                    {
                        statuses.map((status,index)=>(

                            <div
                                key={index}
                                className='flex items-center gap-4'
                            >

                                <div
                                    className={`
                                    w-5 h-5 rounded-full
                                    ${
                                        index <= currentIndex
                                        ? 'bg-indigo-600'
                                        : 'bg-gray-300'
                                    }
                                    `}
                                />

                                <p className='capitalize text-sm'>
                                    {status.replaceAll('_',' ')}
                                </p>

                            </div>

                        ))
                    }

                </div>

            </div>

        </div>

    )
}

export default DeliveryTracker