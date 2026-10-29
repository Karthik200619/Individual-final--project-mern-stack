import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { FaArrowLeft, FaCloudUploadAlt, FaImage, FaVideo, FaCheckCircle, FaSpinner, FaChartLine } from 'react-icons/fa'

const API = 'https://individual-final-project-mern-stack.onrender.com/user-api/additem'
const fieldClass = 'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400'

function AddItem() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({ mode: 'onBlur', defaultValues: { category: '', rating: '5' } })
  const coverFiles = watch('coverImage')
  const extraFiles = watch('images')
  const videoFiles = watch('videos')
  const selectedCategory = watch('category')
  const titleValue = watch('title')
  const [priceEstimate, setPriceEstimate] = useState(null)
  const [estimatingPrice, setEstimatingPrice] = useState(false)
  const [coverPreview, setCoverPreview] = useState('')
  const [imagePreviews, setImagePreviews] = useState([])

  useEffect(() => {
    if (!coverFiles?.[0]) {
      setCoverPreview('')
      return
    }
    const url = URL.createObjectURL(coverFiles[0])
    setCoverPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [coverFiles])

  useEffect(() => {
    const files = Array.from(extraFiles || [])
    const urls = files.map(file => URL.createObjectURL(file))
    setImagePreviews(urls)
    return () => urls.forEach(url => URL.revokeObjectURL(url))
  }, [extraFiles])

  const estimatePrice = async () => {
    if (!selectedCategory) return
    try {
      setEstimatingPrice(true)
      const res = await axios.get('https://individual-final-project-mern-stack.onrender.com/user-api/price-prediction', {
        params: { category: selectedCategory, title: titleValue || '' },
        withCredentials: true
      })
      setPriceEstimate(res.data.payload || null)
      if (!res.data.payload?.available) {
        alert('There are not enough active listings in this category to estimate a price yet.')
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Could not estimate a price right now.')
    } finally {
      setEstimatingPrice(false)
    }
  }

  const onceDone = async (data) => {
    if (!data.coverImage?.[0]) return
    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('title', data.title.trim())
      formData.append('description', data.description.trim())
      formData.append('price', String(data.price))
      formData.append('quantity', String(data.quantity))
      formData.append('category', data.category)
      formData.append('rating', data.rating || '5')
      formData.append('coverImage', data.coverImage[0])
      for (const image of Array.from(data.images || [])) formData.append('images', image)
      if (data.videos?.[0]) formData.append('videos', data.videos[0])

      await axios.post(API, formData, { withCredentials: true })
      alert('Your listing has been submitted for review.')
      navigate('/myitems')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to add item. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] -mx-4 -my-4 md:-mx-6 md:-my-8 bg-slate-50 dark:bg-slate-950 px-4 py-8 md:px-6 md:py-10 transition-colors">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-indigo-600 dark:hover:bg-slate-900">
          <FaArrowLeft /> Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                <FaCloudUploadAlt />
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Seller studio</p>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">List an item</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Share something useful with your campus community. Clear photos and an honest description help buyers decide with confidence.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onceDone)} encType="multipart/form-data" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Item title <span className="text-rose-500">*</span></label>
                  <input {...register('title', { required: 'Enter a title for your item.', minLength: { value: 3, message: 'Use at least 3 characters.' }, maxLength: { value: 90, message: 'Keep the title under 90 characters.' } })} className={fieldClass} placeholder="e.g. Engineering Mathematics textbook" maxLength={90} />
                  {errors.title && <p className="mt-1.5 text-xs text-rose-500">{errors.title.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Category <span className="text-rose-500">*</span></label>
                  <select {...register('category', { required: 'Choose a category.' })} className={fieldClass}>
                    <option value="">Choose the closest match</option>
                    <option value="BOOKS">Books</option>
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="FASHION">Fashion</option>
                    <option value="FURNITURE">Furniture</option>
                    <option value="SPORTS">Sports</option>
                    <option value="STATIONERY">Stationery</option>
                    <option value="OTHERS">Others</option>
                  </select>
                  {errors.category && <p className="mt-1.5 text-xs text-rose-500">{errors.category.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Description <span className="text-rose-500">*</span></label>
                  <textarea {...register('description', { required: 'Describe the item.', minLength: { value: 10, message: 'Add a little more detail (at least 10 characters).' }, maxLength: { value: 1500, message: 'Keep the description under 1,500 characters.' } })} className={fieldClass + ' min-h-32 resize-y'} placeholder="Mention the condition, age, included accessories, defects, or anything a buyer should know." maxLength={1500} />
                  {errors.description && <p className="mt-1.5 text-xs text-rose-500">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Price (₹) <span className="text-rose-500">*</span></label>
                    <input type="number" min="1" step="1" {...register('price', { required: 'Enter a price.', valueAsNumber: true, min: { value: 1, message: 'Price must be at least ₹1.' } })} className={fieldClass} placeholder="e.g. 450" />
                    {errors.price && <p className="mt-1.5 text-xs text-rose-500">{errors.price.message}</p>}
                    <button type="button" onClick={estimatePrice} disabled={!selectedCategory || estimatingPrice} className="mt-2 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                      {estimatingPrice ? <FaSpinner className="animate-spin" /> : <FaChartLine />} {estimatingPrice ? 'Estimating…' : 'Predict a fair price'}
                    </button>
                    {priceEstimate?.available && (
                      <div className="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 dark:border-indigo-900 dark:bg-indigo-950/30">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Comparable listing estimate</p>
                        <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">₹{priceEstimate.suggestedPrice?.toLocaleString('en-IN')}</p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Typical range ₹{priceEstimate.lowEstimate?.toLocaleString('en-IN')}–₹{priceEstimate.highEstimate?.toLocaleString('en-IN')} · based on {priceEstimate.sampleSize} listing(s)</p>
                        <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Confidence: {priceEstimate.confidence}. This is an estimate, not a guaranteed sale price.</p>
                        <button type="button" onClick={() => setValue('price', priceEstimate.suggestedPrice, { shouldValidate: true, shouldDirty: true })} className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-bold text-white">Use suggested price</button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Available quantity <span className="text-rose-500">*</span></label>
                    <input type="number" min="1" step="1" {...register('quantity', { required: 'Enter available quantity.', valueAsNumber: true, min: { value: 1, message: 'Quantity must be at least 1.' }, validate: value => Number.isInteger(value) || 'Use a whole number.' })} className={fieldClass} placeholder="e.g. 1" />
                    {errors.quantity && <p className="mt-1.5 text-xs text-rose-500">{errors.quantity.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Listing rating</label>
                  <select {...register('rating')} className={fieldClass} defaultValue="5">
                    <option value="5">★★★★★ — 5 stars</option>
                    <option value="4">★★★★☆ — 4 stars</option>
                    <option value="3">★★★☆☆ — 3 stars</option>
                    <option value="2">★★☆☆☆ — 2 stars</option>
                    <option value="1">★☆☆☆☆ — 1 star</option>
                  </select>
                  <p className="mt-1.5 text-xs text-slate-400">This is a listing preference, not a verified buyer review.</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Photos and video</h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Use clear, genuine photos. The first image is the main cover shown in your listing.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Cover photo <span className="text-rose-500">*</span></label>
                    <label className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-indigo-950/20">
                      {coverPreview ? (
                        <img src={coverPreview} alt="Cover preview" className="mb-3 max-h-56 w-full rounded-xl object-contain" />
                      ) : (
                        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-indigo-600 shadow-sm dark:bg-slate-900"><FaImage /></span>
                      )}
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{coverPreview ? 'Change cover photo' : 'Choose a cover photo'}</span>
                      <span className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP or another supported image type</span>
                      <input type="file" accept="image/*" className="sr-only" {...register('coverImage', { required: 'Choose a cover photo.', validate: files => !files?.[0] || files[0].size <= 10 * 1024 * 1024 || 'Cover photo must be 10 MB or smaller.' })} />
                    </label>
                    {errors.coverImage && <p className="mt-1.5 text-xs text-rose-500">{errors.coverImage.message}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Extra photos <span className="font-normal normal-case tracking-normal text-slate-400">(optional)</span></label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-400 dark:border-slate-700">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-indigo-600 dark:bg-slate-800"><FaImage /></span>
                      <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">Add more angles</span><span className="block text-xs text-slate-500">Select multiple images</span></span>
                      <span className="text-xs font-bold text-indigo-600">Browse</span>
                      <input type="file" accept="image/*" multiple className="sr-only" {...register('images', { validate: files => Array.from(files || []).every(file => file.size <= 10 * 1024 * 1024) || 'Each extra photo must be 10 MB or smaller.' })} />
                    </label>
                    {imagePreviews.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">{imagePreviews.map((url, index) => <img key={url} src={url} alt={`Extra photo ${index + 1}`} className="aspect-square w-full rounded-xl border border-slate-200 object-cover dark:border-slate-700" />)}</div>}
                    {errors.images && <p className="mt-1.5 text-xs text-rose-500">{errors.images.message}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Short video <span className="font-normal normal-case tracking-normal text-slate-400">(optional)</span></label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-400 dark:border-slate-700">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-indigo-600 dark:bg-slate-800"><FaVideo /></span>
                      <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{videoFiles?.[0]?.name || 'Show the item in action'}</span><span className="block text-xs text-slate-500">Choose one video file</span></span>
                      <span className="text-xs font-bold text-indigo-600">Browse</span>
                      <input type="file" accept="video/*" className="sr-only" {...register('videos', { validate: files => !files?.[0] || files[0].size <= 100 * 1024 * 1024 || 'Video must be 100 MB or smaller.' })} />
                    </label>
                    {errors.videos && <p className="mt-1.5 text-xs text-rose-500">{errors.videos.message}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                <FaCheckCircle className="mr-2 inline" /> Your listing may need admin approval before it appears to buyers.
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button type="button" onClick={() => navigate(-1)} disabled={submitting} className="h-12 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-1/3">Cancel</button>
                <button type="submit" disabled={submitting} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/15 transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? <><FaSpinner className="animate-spin" /> Submitting listing…</> : <><FaCloudUploadAlt /> Submit for review</>}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Listing preview</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
                {coverPreview ? <img src={coverPreview} alt="Listing preview" className="aspect-[4/3] w-full bg-slate-100 object-cover dark:bg-slate-950" /> : <div className="flex aspect-[4/3] items-center justify-center bg-slate-50 text-4xl text-slate-300 dark:bg-slate-950"><FaImage /></div>}
                <div className="p-4">
                  <p className="truncate font-bold text-slate-900 dark:text-white">{watch('title') || 'Your item title'}</p>
                  <p className="mt-1 line-clamp-3 min-h-10 text-xs leading-5 text-slate-500">{watch('description') || 'A clear description helps buyers know what you are selling.'}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-lg font-extrabold text-indigo-600">{watch('price') ? `₹${watch('price')}` : '₹—'}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">{watch('category') || 'Category'}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Quantity: {watch('quantity') || '—'}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
              <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-100">Tips for a better listing</h3>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-indigo-900/80 dark:text-indigo-200/80">
                <li>• Use a short, searchable title.</li>
                <li>• Photograph the actual item in good light.</li>
                <li>• Mention wear, defects and included accessories.</li>
                <li>• Set a fair price and accurate quantity.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default AddItem
