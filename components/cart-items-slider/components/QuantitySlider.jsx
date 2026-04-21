import * as React from "react"
import {
  getTierStopsForOffer,
  getOfferQuantityMinMax,
  offerHasVolumePricing,
  offerHasMultibuy,
  formatNumber,
  parseTemplate
} from "../helpers"

// Continuous slider quantity picker.
// - Value can land on any integer between the offer's min and max.
// - Tier boundaries (ending_unit of each recurringVolume tier) are rendered as
//   visual tick marks along the track, but the slider does not snap to them.
// - onChange fires with the raw quantity on release (mouse/touch/keyboard),
//   so Limio's volume-pricing engine picks the right tier for that value.
function QuantitySlider({ offer, quantity, onChange, disabled, tierLabelTemplate, tierUnit }) {
  const hasVolume = offerHasVolumePricing(offer)
  const hasMultibuy = offerHasMultibuy(offer)

  const { min, max } = React.useMemo(() => {
    if (hasVolume || hasMultibuy) return getOfferQuantityMinMax(offer)
    return { min: 1, max: 1 }
  }, [offer, hasVolume, hasMultibuy])

  const tierStops = React.useMemo(
    () => (hasVolume ? getTierStopsForOffer(offer) : []),
    [offer, hasVolume]
  )

  const safeMin = Number.isFinite(min) ? min : 1
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 1

  const [localValue, setLocalValue] = React.useState(() =>
    Math.max(safeMin, Math.min(safeMax, Number(quantity) || safeMin))
  )
  React.useEffect(() => {
    setLocalValue(Math.max(safeMin, Math.min(safeMax, Number(quantity) || safeMin)))
  }, [quantity, safeMin, safeMax])

  if (!hasVolume && !hasMultibuy) return null

  const commit = (raw) => {
    const clamped = Math.max(safeMin, Math.min(safeMax, Number(raw)))
    if (clamped !== quantity) onChange(clamped)
  }

  const activeLabel = parseTemplate(tierLabelTemplate || "{quantity} {unit}", {
    quantity: formatNumber(localValue),
    unit: tierUnit || ""
  }).trim()

  const range = safeMax - safeMin || 1

  return (
    <div className="cis-slider" data-testid="item-quantity">
      <div className="cis-slider__track-wrapper">
        <input
          type="range"
          min={safeMin}
          max={safeMax}
          step="1"
          value={localValue}
          disabled={disabled}
          onChange={(e) => setLocalValue(Number(e.target.value))}
          onMouseUp={(e) => commit(Number(e.currentTarget.value))}
          onTouchEnd={(e) => commit(Number(e.currentTarget.value))}
          onKeyUp={(e) => commit(Number(e.currentTarget.value))}
          className="cis-slider__input"
          aria-label="Quantity"
          aria-valuetext={activeLabel || String(localValue)}
        />
        {tierStops.length > 0 && (
          <div className="cis-slider__ticks" aria-hidden="true">
            {tierStops.map((stop) => {
              const markValue = stop.isOpenEnded ? stop.startingUnit : stop.endingUnit
              const percent = Math.max(0, Math.min(100, ((markValue - safeMin) / range) * 100))
              const reached = localValue >= markValue
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
        {activeLabel || formatNumber(localValue)}
      </div>
    </div>
  )
}

export default QuantitySlider
