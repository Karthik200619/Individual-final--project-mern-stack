import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'

function DeliveryTracker() {

    const { deliveryId } = useParams()

    const [delivery,setDelivery] = useState(null)
    const [loadError, setLoadError] = useState('')

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
                setLoadError('')

            }
            catch(err){

                console.log(err)
                setLoadError(err.response?.data?.message || 'Could not load this delivery. Please check access and try again.')

            }

        }

        getDelivery()

    },[deliveryId])

    if(!delivery){
        return <div className='mx-auto my-8 max-w-3xl rounded-2xl border border-slate-300 bg-white p-6 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100' role={loadError ? 'alert' : 'status'}>{loadError || 'Loading delivery details…'}</div>
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

        <div className='min-h-screen rounded-2xl bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>

            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900'>

                <h1 className='text-2xl font-bold'>
                    Delivery Tracker
                </h1>

                <p className='text-sm text-slate-700 mt-2 dark:text-slate-300'>
                    Meetup Location:
                    {delivery.meetupLocation}
                </p>

                <p className='text-sm text-slate-700 mt-1 dark:text-slate-300'>
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
                                        : 'bg-slate-300 dark:bg-slate-700'
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