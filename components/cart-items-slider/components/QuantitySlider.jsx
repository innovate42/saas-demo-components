import * as React from "react"
import {
  getTierStopsForOffer,
  findTierStopForQuantity,
  offerHasVolumePricing,
  offerHasMultibuy,
  getOfferQuantityMinMax,
  formatNumber,
  parseTemplate
} from "../helpers"

// Slider replacement for the upstream QuantityControl dropdown.
// - If the offer has volume-pricing tiers, stops snap to each tier's max (ending_unit)
//   (or starting_unit for an open-ended final tier).
// - If the offer has multibuy but no tiers, stops run min..max in increments of 1.
// - Otherwise the slider does not render.
function QuantitySlider({ offer, quantity, onChange, disabled, tierLabelTemplate, tierUnit }) {
  const hasVolume = offerHasVolumePricing(offer)
  const hasMultibuy = offerHasMultibuy(offer)

  const stops = React.useMemo(() => {
    if (hasVolume) return getTierStopsForOffer(offer)
    if (hasMultibuy) {
      const { min, max } = getOfferQuantityMinMax(offer)
      const length = Math.max(1, (max || 1) - (min || 1) + 1)
      return Array.from({ length }, (_, i) => {
        const value = (min || 1) + i
        return {
          id: value,
          label: formatNumber(value),
          startingUnit: value,
          endingUnit: value,
          isOpenEnded: false
        }
      })
    }
    return []
  }, [offer, hasVolume, hasMultibuy])

  const currentIndex = React.useMemo(
    () => (stops.length ? findTierStopForQuantity(stops, quantity) : -1),
    [stops, quantity]
  )

  // Local index so dragging feels responsive; commit to parent on release.
  const [localIndex, setLocalIndex] = React.useState(currentIndex)
  React.useEffect(() => {
    setLocalIndex(currentIndex)
  }, [currentIndex])

  if (!stops.length) return null

  const activeStop = stops[Math.max(0, localIndex)] || stops[0]
  const activeLabel = parseTemplate(tierLabelTemplate || "{quantity} {unit}", {
    quantity: activeStop.label,
    unit: tierUnit || ""
  }).trim()

  const commit = (index) => {
    const stop = stops[index]
    if (!stop) return
    if (stop.id !== quantity) onChange(stop.id)
  }

  return (
    <div className="cis-slider" data-testid="item-quantity">
      <div className="cis-slider__track-wrapper">
        <input
          type="range"
          min="0"
          max={stops.length - 1}
          step="1"
          value={Math.max(0, localIndex)}
          disabled={disabled}
          onChange={(e) => setLocalIndex(Number(e.target.value))}
          onMouseUp={(e) => commit(Number(e.currentTarget.value))}
          onTouchEnd={(e) => commit(Number(e.currentTarget.value))}
          onKeyUp={(e) => commit(Number(e.currentTarget.value))}
          className="cis-slider__input"
          aria-label="Quantity tier"
          list={`cis-slider-ticks-${stops.length}`}
        />
        <datalist id={`cis-slider-ticks-${stops.length}`}>
          {stops.map((stop, i) => (
            <option key={stop.id} value={i} label={stop.label} />
          ))}
        </datalist>
        <div className="cis-slider__ticks" aria-hidden="true">
          {stops.map((stop, i) => (
            <span
              key={stop.id}
              className={`cis-slider__tick${i === localIndex ? " cis-slider__tick--active" : ""}`}
            />
          ))}
        </div>
      </div>
      <div className="cis-slider__label" data-testid="item-quantity-label">
        {activeLabel || activeStop.label}
      </div>
    </div>
  )
}

export default QuantitySlider
