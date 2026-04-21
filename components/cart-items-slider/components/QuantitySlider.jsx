import * as React from "react"
import {
  getTierStopsForOffer,
  getOfferQuantityMinMax,
  offerHasVolumePricing,
  offerHasMultibuy,
  formatNumber
} from "../helpers"

// Slider with uniformly-spaced tier dots.
// Internally the track is divided into N equal segments (one per
// recurringVolume tier). Each segment maps linearly onto that tier's
// [starting_unit, ending_unit] range, so the thumb reaches every integer
// in the offer's quantity range while the dots stay evenly spaced.
//
// The displayed quantity is the interpolated value; onChange fires with
// that raw quantity on release — Limio's volume-pricing engine picks the
// correct tier for that number.
const SEGMENT_STEPS = 1000

function QuantitySlider({ offer, quantity, onChange, disabled, tierPrefix, tierUnit }) {
  const hasVolume = offerHasVolumePricing(offer)
  const hasMultibuy = offerHasMultibuy(offer)

  const tierStops = React.useMemo(
    () => (hasVolume ? getTierStopsForOffer(offer) : []),
    [offer, hasVolume]
  )

  const { min, max } = React.useMemo(() => getOfferQuantityMinMax(offer), [offer])
  const safeMin = Number.isFinite(min) ? min : 1
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 1

  const segmentCount = tierStops.length || 1
  const sliderMax = segmentCount * SEGMENT_STEPS

  const sliderToQuantity = React.useCallback(
    (s) => {
      const clamped = Math.max(0, Math.min(sliderMax, Number(s)))
      if (!tierStops.length) {
        const range = safeMax - safeMin
        return Math.round(safeMin + (clamped / sliderMax) * range)
      }
      const raw = clamped / SEGMENT_STEPS
      const idx = Math.min(tierStops.length - 1, Math.floor(raw))
      const frac = Math.min(1, Math.max(0, raw - idx))
      const stop = tierStops[idx]
      const start = stop.startingUnit
      const end = stop.isOpenEnded ? stop.startingUnit : stop.endingUnit
      return Math.round(start + frac * (end - start))
    },
    [tierStops, sliderMax, safeMin, safeMax]
  )

  const quantityToSlider = React.useCallback(
    (q) => {
      const qty = Number(q)
      if (!tierStops.length) {
        const range = safeMax - safeMin || 1
        return Math.round(((qty - safeMin) / range) * sliderMax)
      }
      for (let i = 0; i < tierStops.length; i++) {
        const stop = tierStops[i]
        const start = stop.startingUnit
        const end = stop.isOpenEnded ? stop.startingUnit : stop.endingUnit
        if (qty >= start && qty <= end) {
          const frac = end === start ? 0 : (qty - start) / (end - start)
          return Math.round((i + frac) * SEGMENT_STEPS)
        }
      }
      if (qty < tierStops[0].startingUnit) return 0
      return sliderMax
    },
    [tierStops, sliderMax, safeMin, safeMax]
  )

  const [sliderVal, setSliderVal] = React.useState(() =>
    quantityToSlider(quantity || safeMin)
  )
  React.useEffect(() => {
    setSliderVal(quantityToSlider(quantity || safeMin))
  }, [quantity, quantityToSlider, safeMin])

  if (!hasVolume && !hasMultibuy) return null

  const currentQty = sliderToQuantity(sliderVal)
  const labelText = `${tierPrefix || ""}${formatNumber(currentQty)}${tierUnit ? ` ${tierUnit}` : ""}`

  const commit = (s) => {
    const qty = sliderToQuantity(Number(s))
    if (qty !== quantity) onChange(qty)
  }

  return (
    <div className="cis-slider" data-testid="item-quantity">
      <div className="cis-slider__track-wrapper">
        <input
          type="range"
          min={0}
          max={sliderMax}
          step={1}
          value={sliderVal}
          disabled={disabled}
          onChange={(e) => setSliderVal(Number(e.target.value))}
          onMouseUp={(e) => commit(e.currentTarget.value)}
          onTouchEnd={(e) => commit(e.currentTarget.value)}
          onKeyUp={(e) => commit(e.currentTarget.value)}
          className="cis-slider__input"
          aria-label="Quantity"
          aria-valuetext={labelText}
        />
        {tierStops.length > 0 && (
          <div className="cis-slider__ticks" aria-hidden="true">
            {tierStops.map((stop, i) => {
              const percent = ((i + 1) / tierStops.length) * 100
              const reached = sliderVal >= (i + 1) * SEGMENT_STEPS
              return (
                <span
                  key={stop.id}
                  className={`cis-slider__tick${reached ? " cis-slider__tick--active" : ""}`}
                  style={{ left: `${percent}%` }}
                  title={stop.label}
                />
              )
            })}
          </div>
        )}
      </div>
      <div className="cis-slider__label" data-testid="item-quantity-label">
        {labelText}
      </div>
    </div>
  )
}

export default QuantitySlider
