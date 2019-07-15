<template>
  <div class="graph-holder">
    <div class="graph-line-holder">
      <div class="graph-line"><span>100%</span></div>
      <div class="graph-line"><span>75%</span></div>
      <div class="graph-line"><span>50%</span></div>
      <div class="graph-line"><span>25%</span></div>
      <div class="graph-line"><span></span></div>
    </div>

    <div class="graph"></div>

    <!--{{ todayWeather.probabilityOfPrecipitation }}-->
    <!--{{ todayWeather.quantitativePrecipitation }}-->
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'graph',
  props: ['todayWeather'],
  created: function () {
  },
  destroyed: function () {
  },
  mounted: function () {
    this.simpleChart(this.todayWeather)
  },
  computed: {

  },
  watch: {

  },
  methods: {
    simpleChart: function (data) {
      console.log('data', data)
      // clear elements within holder each time.  Prevents overlap
      // d3.select(element[0]).selectAll('*').remove()
      d3.select(this.$el.querySelector('.graph'))
      // d3.select(element[0]).select(".new-graph").selectAll('*').remove()

      // d3.select(element[0]).select(".graph").selectAll('*').remove()
      // d3.select(element[0]).select(".new-graph").selectAll('*').remove()
      // console.log(d3.selectAll('.percent').selectAll('.tick'))

      let probfPrecip = []
      let quanOfprecip = 0
      let margin = {top: 20, right: 20, bottom: 30, left: 50}

      data.probabilityOfPrecipitation.forEach((entry) => {
        probfPrecip.push(entry.value)
      })

      data.quantitativePrecipitation.forEach((entry) => {
        quanOfprecip += entry.value
      })

      let gaugeData = probfPrecip
      // this.precipTotal = quanOfprecip;

      // d3.select(".gauge")
      // console.log('ele', d3.select(element[0]))
      // console.log('ele + graph', d3.select(element[0]).select(".graph"))
      // console.log('graph only', d3.select(".graph"))
      // var gauge = d3.select(element[0]).select(".graph")
      // works var gauge = d3.select(element[0])

      // let margin = {top: 5, right: 5, bottom: 20, left: 10};
      let height = 70
      let width = 150

      let gx = d3.scaleTime()
        .rangeRound([0, width])
      let gy = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0])

      console.log('this.$el.querySelector(\'.graph\')', this.$el.querySelector('.graph'))
      // let graph = d3.select(element[0]).select(".graph")
      let graph = d3.select(this.$el.querySelector('.graph'))
        .selectAll('.graph')
        .data(gaugeData)
        .enter()
        .append('div')
      // .text(function(d) { return d; })
        .transition()
        .ease(d3.easeBounce)
        .attr('class', 'bar-chart-defaults')
        .style('height', function (d) { return d + '%' })
    }
  }

}
</script>
<style>
  .bar-chart-defaults {
    display: flex;
    flex: 1 1 auto;
    /*min-width:1px;*/
    /*margin:1px;*/
    width: .2rem;
    background-color: steelblue;
    /*padding:1px;*/
    margin:1px;
  }
</style>
<style scoped>
  .graph-holder {
    position:relative;
    height:100px;
    width: 100%;
    display: flex;
    flex: 1 1 auto;
  }

  .graph {
    position:relative;
    display: flex;
    flex: 1 1 auto;
    width: 100%;
    z-index: 1;
    align-items: flex-end;
  }

  .graph-line-holder {
    position:absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index:5;
    width:100%;
    height:100%;
  }
  .graph-line {
    /*position:absolute;*/
    display:flex;
    height:1px;
    width:100%;
    background-color:lightgrey;
  }
  .graph-line span {
    font-size: xx-small;
  }
</style>
