'use client';

import { useState, useId } from 'react';
import { Button } from './Button';
import { Stack, Grid } from './layout';
import { InlineAlert } from './InlineAlert';
import { FeeCalculator } from './FeeCalculator';
import type { CalculatorConfig } from '@/lib/content/types';
import {
  calculateDetailedBOQ,
  formatChennaiCurrency,
  DEFAULT_CALCULATOR_INPUTS,
  type CalculatorInputs,
  type DomainSector,
  type QualityTier,
  type KitchenLayout,
  type CountertopMaterial,
  type CarcassMaterial,
} from '@/lib/pricing/chennaiCalculator';

export function WorldClassPricingCalculator({ config }: { config: CalculatorConfig }) {
  const [activeTab, setActiveTab] = useState<'advanced' | 'quick'>('advanced');
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_CALCULATOR_INPUTS);
  const [copied, setCopied] = useState(false);

  const result = calculateDetailedBOQ(inputs);

  const handleInputChange = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopyToClipboard = () => {
    const textSummary = `Luxe Axis Chennai Interior BOQ Estimate:
------------------------------------------
Carpet Area: ${result.carpetArea} sq.ft (${result.sector.toUpperCase()})
Finish Tier: ${result.tierLabel}
Estimated Investment: ${formatChennaiCurrency(result.totalCostLow)} to ${formatChennaiCurrency(result.totalCostHigh)}
Effective Rate: ₹${result.effectiveRatePerSqFt}/sq.ft (Incl. 18% GST)
Guaranteed Handover: ${result.estimatedDays} Days | ${result.warrantyYears}-Year Flat Warranty
Line Items Included: ${result.boqItems.length} Key Architectural Scope Components
------------------------------------------
Calculated live at https://luxeaxis.in/pricing/calculator`;

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Pre-fill parameters for audit booking
  const auditBookingUrl = `/book-audit?sqft=${result.carpetArea}&sector=${result.sector}&tier=${result.tier}&estimate=${result.totalCostHigh}`;

  return (
    <div className="w-full space-y-8">
      {/* Top Engine Mode Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-surface-deep/80 border border-accent/30 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`px-5 py-2.5 rounded-xl font-ui text-small font-bold transition-all duration-300 ${
              activeTab === 'advanced'
                ? 'bg-accent text-surface-deep shadow-lg scale-[1.02]'
                : 'text-on-surface-2 hover:text-on-surface hover:bg-surface-raised/40'
            }`}
          >
            ⚡ 90% Precision BOQ Engine (Detailed)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`px-5 py-2.5 rounded-xl font-ui text-small font-bold transition-all duration-300 ${
              activeTab === 'quick'
                ? 'bg-accent text-surface-deep shadow-lg scale-[1.02]'
                : 'text-on-surface-2 hover:text-on-surface hover:bg-surface-raised/40'
            }`}
          >
            📋 Property Tier Lookup (Quick)
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-ui text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Chennai Market Rates 2025/2026
        </div>
      </div>

      {activeTab === 'quick' ? (
        <FeeCalculator config={config} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Inputs Panel (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 lx-liquid-glass rounded-2xl p-6 sm:p-8 border border-accent/40 shadow-2xl">
            <Stack gap={5}>
              <div>
                <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                  Step 01 • Property Parameters
                </span>
                <h3 className="font-display text-h3 font-bold text-on-surface mt-1">
                  Space & Carpet Area
                </h3>
              </div>

              {/* Sector Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('sector', 'residential')}
                  className={`p-3.5 rounded-xl border text-small font-bold text-center transition-all ${
                    inputs.sector === 'residential'
                      ? 'border-accent bg-accent/20 text-accent shadow-md'
                      : 'border-border-subtle/60 text-on-surface-2 hover:border-accent/40'
                  }`}
                >
                  🏡 Residential (Home / Villa)
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('sector', 'commercial')}
                  className={`p-3.5 rounded-xl border text-small font-bold text-center transition-all ${
                    inputs.sector === 'commercial'
                      ? 'border-accent bg-accent/20 text-accent shadow-md'
                      : 'border-border-subtle/60 text-on-surface-2 hover:border-accent/40'
                  }`}
                >
                  🏢 Commercial (Office / Retail)
                </button>
              </div>

              {/* Carpet Area Slider & Input */}
              <div className="space-y-3 p-4 rounded-xl bg-surface-raised/50 border border-border-subtle/50">
                <div className="flex items-center justify-between">
                  <label htmlFor="carpet-area-input" className="font-ui text-small font-bold text-on-surface">
                    Carpet Area (sq.ft)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="carpet-area-input"
                      type="number"
                      min={400}
                      max={15000}
                      step={25}
                      value={inputs.carpetArea}
                      onChange={(e) =>
                        handleInputChange('carpetArea', Math.max(400, Number(e.target.value) || 400))
                      }
                      className="w-28 px-3 py-1.5 rounded-lg bg-surface-deep border border-accent/40 text-accent font-mono font-bold text-center text-body focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <span className="font-ui text-xs text-on-surface-muted">sq.ft</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={400}
                  max={8000}
                  step={50}
                  value={inputs.carpetArea}
                  onChange={(e) => handleInputChange('carpetArea', Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-surface-deep accent-accent cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-on-surface-muted font-mono">
                  <span>400 sq.ft</span>
                  <span>2,500 sq.ft</span>
                  <span>5,000 sq.ft</span>
                  <span>8,000+ sq.ft</span>
                </div>
              </div>

              {/* Quality Finish Tier Selection */}
              <div>
                <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold block mb-2">
                  Step 02 • Finish & Material Grade Tier
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('tier', 'essential')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      inputs.tier === 'essential'
                        ? 'border-accent bg-accent/20 text-on-surface shadow-lg'
                        : 'border-border-subtle/50 text-on-surface-2 hover:border-accent/40'
                    }`}
                  >
                    <div>
                      <strong className="block font-display text-small font-bold text-on-surface">
                        Essential Smart
                      </strong>
                      <span className="text-[11px] text-on-surface-muted block mt-1">
                        Commercial MR Ply, 0.8mm Laminates, Hafele Fittings
                      </span>
                    </div>
                    <span className="font-mono text-xs text-accent font-bold mt-3 block">
                      ~₹1,450 / sq.ft
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('tier', 'signature')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                      inputs.tier === 'signature'
                        ? 'border-accent bg-accent/25 text-on-surface shadow-xl ring-1 ring-accent'
                        : 'border-border-subtle/50 text-on-surface-2 hover:border-accent/40'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-accent text-surface-deep font-ui text-[9px] font-bold uppercase tracking-wider">
                      Recommended
                    </span>
                    <div>
                      <strong className="block font-display text-small font-bold text-accent">
                        Signature Bespoke
                      </strong>
                      <span className="text-[11px] text-on-surface-muted block mt-1">
                        BWP 710 Marine Ply, 1mm High-Gloss, Kalinga Quartz, Blum
                      </span>
                    </div>
                    <span className="font-mono text-xs text-accent font-bold mt-3 block">
                      ~₹2,450 / sq.ft
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('tier', 'elite')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      inputs.tier === 'elite'
                        ? 'border-accent bg-accent/20 text-on-surface shadow-lg'
                        : 'border-border-subtle/50 text-on-surface-2 hover:border-accent/40'
                    }`}
                  >
                    <div>
                      <strong className="block font-display text-small font-bold text-on-surface">
                        Ultra-Luxury Elite
                      </strong>
                      <span className="text-[11px] text-on-surface-muted block mt-1">
                        Italian Marble, HDMR Acrylic, Tinted Glass Wardrobes
                      </span>
                    </div>
                    <span className="font-mono text-xs text-accent font-bold mt-3 block">
                      ~₹4,200 / sq.ft
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 03: Granular Scope Customizers */}
              <div>
                <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold block mb-3">
                  Step 03 • Architectural Scope Breakdown
                </span>

                <div className="space-y-4">
                  {/* Modular Kitchen Scope */}
                  <div className="p-4 rounded-xl bg-surface-raised/40 border border-border-subtle/60 space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="font-ui text-small font-bold text-on-surface flex items-center gap-2">
                        🍳 Modular Kitchen & Pantry Suite
                      </span>
                      <input
                        type="checkbox"
                        checked={inputs.includeKitchen}
                        onChange={(e) => handleInputChange('includeKitchen', e.target.checked)}
                        className="w-5 h-5 rounded border-accent/40 text-accent focus:ring-accent accent-accent cursor-pointer"
                      />
                    </label>

                    {inputs.includeKitchen && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border-subtle/40 text-xs">
                        <div>
                          <label className="text-on-surface-muted block mb-1">Layout</label>
                          <select
                            value={inputs.kitchenLayout}
                            onChange={(e) => handleInputChange('kitchenLayout', e.target.value as KitchenLayout)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-deep border border-accent/30 text-on-surface"
                          >
                            <option value="straight">Straight Line</option>
                            <option value="l-shape">L-Shape</option>
                            <option value="parallel">Parallel Counter</option>
                            <option value="island">Island + Breakfast Bar</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-on-surface-muted block mb-1">Countertop</label>
                          <select
                            value={inputs.countertop}
                            onChange={(e) => handleInputChange('countertop', e.target.value as CountertopMaterial)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-deep border border-accent/30 text-on-surface"
                          >
                            <option value="granite">Jet Black Granite</option>
                            <option value="quartz">Kalinga Engineered Quartz</option>
                            <option value="italian-marble">Italian Marble / Sintered Stone</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-on-surface-muted block mb-1">Carcass Material</label>
                          <select
                            value={inputs.carcass}
                            onChange={(e) => handleInputChange('carcass', e.target.value as CarcassMaterial)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-deep border border-accent/30 text-on-surface"
                          >
                            <option value="commercial-mr">Commercial MR Plywood</option>
                            <option value="bwp-marine-710">BWP Grade 710 Marine Ply</option>
                            <option value="hdmr-action-tesa">Action Tesa HDMR Board</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bedroom Wardrobes & Storage */}
                  <div className="p-4 rounded-xl bg-surface-raised/40 border border-border-subtle/60 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-ui text-small font-bold text-on-surface block">
                        🛏 Full-Height Bedroom Wardrobes
                      </span>
                      <span className="text-xs text-on-surface-muted">
                        Floor-to-ceiling joinery with loft & internal LED lighting
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('wardrobes', Math.max(0, inputs.wardrobes - 1))}
                        className="w-8 h-8 rounded-lg bg-surface-deep border border-accent/40 text-accent font-bold flex items-center justify-center hover:bg-accent/20"
                      >
                        -
                      </button>
                      <span className="font-mono text-body font-bold text-on-surface w-6 text-center">
                        {inputs.wardrobes}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleInputChange('wardrobes', Math.min(8, inputs.wardrobes + 1))}
                        className="w-8 h-8 rounded-lg bg-surface-deep border border-accent/40 text-accent font-bold flex items-center justify-center hover:bg-accent/20"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* False Ceiling & Cove Lighting Toggle */}
                  <div className="p-4 rounded-xl bg-surface-raised/40 border border-border-subtle/60 flex items-center justify-between">
                    <div>
                      <span className="font-ui text-small font-bold text-on-surface block">
                        💡 Gyproc False Ceiling & Cove Lights
                      </span>
                      <span className="text-xs text-on-surface-muted">
                        Saint-Gobain Gyproc false ceiling with magnetic LED light tracks
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={inputs.includeFalseCeiling}
                      onChange={(e) => handleInputChange('includeFalseCeiling', e.target.checked)}
                      className="w-5 h-5 rounded border-accent/40 text-accent focus:ring-accent accent-accent cursor-pointer"
                    />
                  </div>

                  {/* TV Feature Wall Toggle */}
                  <div className="p-4 rounded-xl bg-surface-raised/40 border border-border-subtle/60 flex items-center justify-between">
                    <div>
                      <span className="font-ui text-small font-bold text-on-surface block">
                        📺 Cantilevered TV Wall Unit
                      </span>
                      <span className="text-xs text-on-surface-muted">
                        Fluted charcoal acoustic panels or sintered stone backdrop
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={inputs.includeTVWall}
                      onChange={(e) => handleInputChange('includeTVWall', e.target.checked)}
                      className="w-5 h-5 rounded border-accent/40 text-accent focus:ring-accent accent-accent cursor-pointer"
                    />
                  </div>

                  {/* Vastu-Tech Mandap & Automation Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="p-3.5 rounded-xl bg-surface-raised/40 border border-border-subtle/60 flex items-center justify-between cursor-pointer">
                      <span className="font-ui text-xs font-bold text-on-surface">
                        🛕 Vastu-Tech Pooja Mandap
                      </span>
                      <input
                        type="checkbox"
                        checked={inputs.includePoojaMandap}
                        onChange={(e) => handleInputChange('includePoojaMandap', e.target.checked)}
                        className="w-4 h-4 rounded border-accent/40 text-accent accent-accent cursor-pointer"
                      />
                    </label>

                    <label className="p-3.5 rounded-xl bg-surface-raised/40 border border-border-subtle/60 flex items-center justify-between cursor-pointer">
                      <span className="font-ui text-xs font-bold text-on-surface">
                        📱 Space OS Smart Automation
                      </span>
                      <input
                        type="checkbox"
                        checked={inputs.includeSmartAutomation}
                        onChange={(e) => handleInputChange('includeSmartAutomation', e.target.checked)}
                        className="w-4 h-4 rounded border-accent/40 text-accent accent-accent cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </Stack>
          </div>

          {/* Right Live Reactive BOQ Breakdown Card (5 Cols - Sticky) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6 lx-liquid-glass rounded-2xl p-6 sm:p-8 border border-accent/60 shadow-2xl backdrop-blur-2xl">
            <Stack gap={5}>
              <div className="flex items-center justify-between border-b border-accent/20 pb-4">
                <div>
                  <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                    Live Estimate Summary
                  </span>
                  <h3 className="font-display text-h3 font-bold text-on-surface">
                    Estimated Investment
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-accent/20 text-accent font-mono text-[11px] font-bold border border-accent/40">
                  {result.precisionRating}
                </span>
              </div>

              {/* Main Total Cost Display */}
              <div className="space-y-1 bg-surface-deep/90 p-5 rounded-xl border border-accent/40 shadow-inner">
                <span className="text-xs text-on-surface-2 font-medium block">
                  Total Project Cost Range (Incl. 18% GST)
                </span>
                <div className="font-mono text-[length:var(--typography-price-font-size)] font-bold text-accent tracking-tight leading-none">
                  {formatChennaiCurrency(result.totalCostLow)} – {formatChennaiCurrency(result.totalCostHigh)}
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-muted pt-2 font-mono">
                  <span>Effective Rate: ₹{result.effectiveRatePerSqFt} / sq.ft</span>
                  <span>{result.carpetArea} sq.ft</span>
                </div>
              </div>

              {/* Delivery Timeline & Warranty Badges */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/30">
                  <strong className="block font-display text-h4 font-bold text-accent">
                    {result.estimatedDays} Days
                  </strong>
                  <span className="text-[10px] text-on-surface-muted uppercase tracking-wider font-semibold">
                    Guaranteed Handover
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-accent/10 border border-accent/30">
                  <strong className="block font-display text-h4 font-bold text-accent">
                    {result.warrantyYears} Years
                  </strong>
                  <span className="text-[10px] text-on-surface-muted uppercase tracking-wider font-semibold">
                    Flat Warranty
                  </span>
                </div>
              </div>

              {/* Cost Distribution Breakdown */}
              <div className="space-y-2 pt-2 border-t border-border-subtle/50 text-xs">
                <span className="font-ui uppercase tracking-wider text-accent text-[10px] font-bold block">
                  Cost Distribution & Taxes
                </span>

                <div className="flex justify-between py-1 border-b border-border-subtle/30">
                  <span className="text-on-surface-2">Materials & Joinery (62%)</span>
                  <span className="font-mono font-bold text-on-surface">{formatChennaiCurrency(result.materialsCost)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border-subtle/30">
                  <span className="text-on-surface-2">Factory Labor & Installation (23%)</span>
                  <span className="font-mono font-bold text-on-surface">{formatChennaiCurrency(result.laborInstallationCost)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border-subtle/30">
                  <span className="text-on-surface-2">3D VR Design & Management (7%)</span>
                  <span className="font-mono font-bold text-on-surface">{formatChennaiCurrency(result.designFee)}</span>
                </div>

                <div className="flex justify-between py-1 text-accent font-semibold">
                  <span>GST (18% Statutory Tax)</span>
                  <span className="font-mono">{formatChennaiCurrency(result.gstAmount)}</span>
                </div>
              </div>

              {/* Itemized BOQ Line Items */}
              <div className="space-y-2 pt-2 border-t border-border-subtle/50">
                <span className="font-ui uppercase tracking-wider text-accent text-[10px] font-bold block">
                  Selected BOQ Scope ({result.boqItems.length} Components)
                </span>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {result.boqItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-surface-deep/60 border border-border-subtle/40 text-xs flex justify-between items-start gap-2"
                    >
                      <div className="min-w-0">
                        <strong className="block text-on-surface font-bold truncate">{item.title}</strong>
                        <span className="text-[10px] text-on-surface-muted block leading-snug">{item.specification}</span>
                      </div>
                      <span className="font-mono text-accent font-bold shrink-0">{formatChennaiCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  as="a"
                  href={auditBookingUrl}
                  size="lg"
                  className="w-full justify-center text-center font-bold shadow-2xl"
                >
                  Book Spatial Audit with this Estimate →
                </Button>

                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="w-full py-2.5 rounded-xl border border-accent/40 bg-surface-raised/60 text-accent font-ui text-xs font-bold hover:bg-accent/20 transition-all text-center"
                >
                  {copied ? '✓ BOQ Summary Copied!' : '📄 Copy BOQ Summary Text'}
                </button>
              </div>

              <InlineAlert tone="info" title="90%+ Accuracy Guarantee">
                Final itemized prices are locked in writing after a 60-minute on-site CAD measurement audit.
              </InlineAlert>
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
}
