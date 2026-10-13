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

    useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

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
            map.on('click', async event => {
                const { lat, lng } = event.latlng
                if (markerRef.current) markerRef.current.setLatLng(event.latlng)
                else markerRef.current = L.marker(event.latlng).addTo(map)
                const coordinates = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) }
                onSelectRef.current({ ...coordinates, address: `Pinned location (${coordinates.lat}, ${coordinates.lng})` })
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
                    if (response.ok) {
                        const data = await response.json()
                        if (data.display_name) onSelectRef.current({ ...coordinates, address: data.display_name })
                    }
                } catch (error) {
                    // Keep the selected coordinates even when reverse geocoding is unavailable.
                }
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
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Tap the map to pin an exact meetup point.</p>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">OpenStreetMap</span>
            </div>
            <div ref={mapElement} className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100" role="application" aria-label="Select delivery location on map" />
            {mapError && <p className="text-xs text-amber-600">{mapError}</p>}
        </div>
    )
}
