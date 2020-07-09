# WikiRate Visualisation Widget

This Widget allows the easy integration of chart visualisations of the data of from the [WikiRate](https://wikirate.org/) platform. 

## Simple Installation Howto
Just point a web browser towards the contents of the dist/ directory.
[(See current master.)](https://htmlpreview.github.io/?https://github.com/wikirate/wikirate-widget/blob/master/dist/index.html])

## Tinkerer Howto
...for those wishing to experiment with different WikiRate requests

The simplest way to tinker is to go directly to dist/index.html and alter arguments to renderWidget.

- *metric* can be any [numeric WikiRate metric](https://wikirate.org/Metric?filter%5Bnot_ids%5D=&sort=bookmarkers&filter%5Bname%5D=&filter%5Bvalue_type%5D%5B%5D=Number)
- *filter* can be any valid filter available on metric pages,.
- *UnitDimension* is a number by which label numbers will be divided.


## Developer Howto
...for those wishing to improve the core widget functionality.

### Requirements
- yarn: https://yarnpkg.com/

### Development environment
```
yarn install  # install dependencies
yarn build    # build code into dist/
yarn serve    # start local web server
```
