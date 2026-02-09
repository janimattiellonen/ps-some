# puskis-some context

React19+TS+Vite(5165)+StyleX+react-hook-form+zod+snapdom

## structure

src/App.tsx=router, src/pages/{PlayerPage,ScoresPage}.tsx, src/components/{Dashboard,common/PageLayout}.tsx, src/styles/shared.ts=all stylex
public/images/ps-logo.png=club logo, public/images/templates/\*.png

## routes

/=Dashboard, /player=PlayerPage, /scores=ScoresPage

## PlayerPage

form: pdgaNumber,name,row2,row3 (all optional strings)
templates: green|pink, dims: 551x690
features: file upload(png/jpeg,20MB max), drag positioning via pointer events, zoom 0.5-3x, arrow keys move 10px, reset btn
transform state: {x,y,scale} applied as CSS transform
export: snapdom DOM→PNG at 2x scale

## ScoresPage

form: competitionName, row1-5(text), row1-5Member(bool), logoBackground(bool)
templates: blue|green, dims: 419x518
member=true shows ps-logo.png, logoBackground adds white bg
export: snapdom DOM→PNG at 2x scale

## stylex

NO shorthand borders, use borderWidth+borderStyle+borderColor
shared.ts exports: layoutStyles,formStyles,typographyStyles,templateSelectorStyles,utilityStyles

## pre-commit

1.typecheck 2.build 3.format
conventional commits, explicit git add (no --all), wcag audit for UI changes

## code rules

type>interface, type-only imports, no any

## deps

react@19, react-router@7, @stylexjs/stylex, react-hook-form, zod, @zumer/snapdom
