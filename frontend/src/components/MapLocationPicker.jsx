import React, { useEffect, useRef, useState } from 'react'

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L)
    return new Promise((resolve, reject) => {
        let script = document.querySelector('script[data-campus-kart-leaflet]')
        if (!document.querySelector('link[data-campus-kart-leaflet]')) {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = LEAFLET_CSS
            link.dataset.campusKartLeaflet = 'true'
            document.head.appendChild(link)
        }
        if (script) {
            script.addEventListener('load', () => resolve(window.L), { once: true })
            script.addEventListener('error', reject, { once: true })
            return
        }
        script = document.createElement('script')
        script.src = LEAFLET_JS
        script.async = true
        script.dataset.campusKartLeaflet = 'true'
        script.onload = () => resolve(window.L)
        script.onerror = reject
        document.body.appendChild(script)
    })
}

export default function MapLocationPicker({ onSelect, selectedLocation }) {
    const mapElement = useRef(null)
    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const onSelectRef = useRef(onSelect)
    const [mapError, setMapError] = useState('')
    const [locating, setLocating] = useState(false)
    const [locationMessage, setLocationMessage] = useState('')

    useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

    const chooseCoordinates = async (lat, lng, L = window.L) => {
        const point = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) }
        if (mapRef.current) {
            mapRef.current.setView([lat, lng], 16)
            if (markerRef.current) markerRef.current.setLatLng([lat, lng])
            else if (L) markerRef.current = L.marker([lat, lng]).addTo(mapRef.current)
        }
        onSelectRef.current({ ...point, address: `Pinned location (${point.lat}, ${point.lng})` })
        setLocationMessage('Location selected. Looking up the address…')
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
            if (response.ok) {
                const data = await response.json()
                if (data.display_name) {
                    onSelectRef.current({ ...point, address: data.display_name })
                    setLocationMessage('Address found for your selected location.')
                    return
                }
            }
            setLocationMessage('Pin saved. The street address could not be found.')
        } catch (error) {
            setLocationMessage('Pin saved with coordinates. Address lookup is temporarily unavailable.')
        }
    }

    const useCurrentLocation = () => {
        setLocationMessage('')
        if (!navigator.geolocation) {
            setLocationMessage('Your browser does not support location access. Tap the map to choose a point.')
            return
        }
        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            position => {
                chooseCoordinates(position.coords.latitude, position.coords.longitude)
                    .finally(() => setLocating(false))
            },
            error => {
                setLocating(false)
                const message = error.code === 1
                    ? 'Location permission was denied. Allow location access in your browser or tap the map instead.'
                    : error.code === 2
                        ? 'Your current location is unavailable. Try again or tap the map.'
                        : 'Location request timed out. Try again or tap the map.'
                setLocationMessage(message)
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
        )
    }

    useEffect(() => {
        let cancelled = false
        let map
        loadLeaflet().then(L => {
            if (cancelled || !mapElement.current || mapRef.current) return
            map = L.map(mapElement.current).setView([17.385, 78.4867], 13)
            mapRef.current = map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map)
            map.on('click', event => {
                chooseCoordinates(event.latlng.lat, event.latlng.lng, L)
            })
            setTimeout(() => map?.invalidateSize(), 100)
        }).catch(() => setMapError('The map could not be loaded. You can still use the campus location list above.'))

        return () => {
            cancelled = true
            if (map) map.remove()
            mapRef.current = null
            markerRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!mapRef.current || !selectedLocation?.lat || !selectedLocation?.lng) return
        const L = window.L
        const point = [selectedLocation.lat, selectedLocation.lng]
        mapRef.current.setView(point, 16)
        if (markerRef.current) markerRef.current.setLatLng(point)
        else markerRef.current = L.marker(point).addTo(mapRef.current)
    }, [selectedLocation?.lat, selectedLocation?.lng])

    return (
        <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">Tap the map to pin an exact meetup point.</p>
                <button type="button" onClick={useCurrentLocation} disabled={locating} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-3 py-2 text-xs font-bold text-white transition">
                    {locating ? <span className="animate-spin">◌</span> : <span aria-hidden="true">◎</span>}
                    {locating ? 'Finding you…' : 'Use my current location'}
                </button>
            </div>
            <div ref={mapElement} className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100" role="application" aria-label="Select delivery location on map" />
            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">OpenStreetMap</span>
                {selectedLocation?.lat && selectedLocation?.lng && <span className="text-[10px] text-slate-500">Pin selected</span>}
            </div>
            {locationMessage && <p role="status" className="text-xs text-slate-600 dark:text-slate-300">{locationMessage}</p>}
            {mapError && <p className="text-xs text-amber-600">{mapError}</p>}
            <p className="text-[10px] text-slate-400">Current location works when you allow browser location access and the site is served over HTTPS.</p>
        </div>
    )
}
