---
name: High-Velocity Academic
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#55433d'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#88726c'
  outline-variant: '#dbc1b9'
  surface-tint: '#99462a'
  primary: '#99462a'
  on-primary: '#ffffff'
  primary-container: '#d97757'
  on-primary-container: '#541400'
  inverse-primary: '#ffb59e'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#919292'
  on-tertiary-container: '#292b2c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#390b00'
  on-primary-fixed-variant: '#7a2f15'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1280px
---

## Brand & Style

This design system is built for high-performance academic and intellectual environments where information density meets raw energy. The brand personality is authoritative, energetic, and uncompromisingly clear. 

The aesthetic follows a **Neo-Brutalist** movement: it prioritizes function and structure through heavy borders, high-contrast intersections, and vibrant solid surfaces. It rejects the softness of modern SaaS trends in favor of a "printed-matter" digital experience. By utilizing sharp edges and a bold color palette, the UI evokes an emotional response of urgency, precision, and intellectual rigor. All elements are flat and tactile, removing any decorative gradients to ensure maximum legibility and a no-nonsense professional tone.

## Colors

The palette is anchored by **Burnt Sienna (#d97757)**, a warm yet commanding accent that provides an energetic spark to the scholarly layout. This is paired with a deep, authoritative Charcoal and crisp White to maintain a high-contrast ratio that exceeds accessibility standards.

Surface colors are strictly solid; gradients are prohibited. Functional colors (Success, Warning, Error) must use saturated, flat tones to match the intensity of the primary Burnt Sienna. Backgrounds should remain predominantly neutral to allow the high-velocity content and bold borders to define the visual hierarchy.

## Typography

The typography system is unified under **IBM Plex Sans**, chosen for its exceptional performance in both Latin and Arabic scripts. This creates a seamless, premium reading experience across multilingual academic content. The font's mechanical yet humanist details reinforce the "High-Velocity Academic" theme—precise, technical, yet accessible.

For metadata, citations, and technical labels, **JetBrains Mono** is used to introduce a disciplined, data-driven feel. All headings use heavy weights (600-700) to stand up against the bold architectural borders of the UI. Tracking is tightened on display sizes to increase visual impact and loosened on labels for clarity.

## Layout & Spacing

The layout philosophy is a **Rigid Grid** system. It utilizes a 12-column structure for desktop that collapses to 4 columns on mobile. In keeping with the Brutalist aesthetic, gutters are wide (24px) to create distinct visual "gutters" between content blocks.

Elements should be aligned to a strict 8px baseline grid to ensure mathematical precision. Padding within containers should be generous to balance the weight of the thick borders. Layouts should prioritize vertical stacking for mobile, while desktop views can utilize asymmetrical column spans (e.g., a 4-column sidebar with an 8-column main content area) to create a dynamic, editorial feel.

## Elevation & Depth

This design system eschews traditional shadows and blurs. Depth is conveyed exclusively through **Hard Offsets** and **Thick Outlines**. 

Instead of soft drop shadows, "elevated" elements use a solid black offset (e.g., 4px down, 4px right) to create a physical "stacked" appearance. Every container and interactive element must feature a 2px solid border in the secondary color (Charcoal). When an element is active or hovered, the offset shadow should increase in distance or shift color to the primary Burnt Sienna, creating a tactile, mechanical response without using z-axis transparency.

## Shapes

The shape language is strictly **Sharp**. A `0` roundedness setting is applied to all components, including buttons, input fields, and cards. This reinforces the architectural and brutalist nature of the design. 

The only exception to the "sharp" rule is for specific circular iconography or avatars, which should be contained within square frames with heavy borders to maintain consistency with the overall structural logic. Lines and dividers must be solid and 2px thick to match the component stroke weights.

## Components

- **Buttons:** Rectangular with a 2px Charcoal border and a 4px hard offset shadow. Primary buttons use the Burnt Sienna background with white text. Hover states should remove the shadow and shift the button position by 2px to simulate a physical press.
- **Input Fields:** Solid white background with a 2px Charcoal border. Labels use JetBrains Mono in all caps. Focus states swap the border color to Burnt Sienna.
- **Cards:** Heavy 2px borders with no radius. The card header should be separated by a solid 2px horizontal line. Use a "paper" white background to contrast against the neutral site background.
- **Chips/Tags:** Small rectangular blocks with solid fills and JetBrains Mono text. They do not have shadows, keeping them "flat" against the surface.
- **Lists:** Items are separated by 2px solid lines. Hovering over a list item should trigger a full-width Burnt Sienna background fill.
- **Checkboxes/Radios:** Pure geometric squares and diamonds. No rounded corners. Selected states use a solid Burnt Sienna fill with a 2px inset white border.