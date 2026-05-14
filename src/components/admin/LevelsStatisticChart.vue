<template>
  <div class="chart-panel">  
    <GChart
      type="ColumnChart"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'

export default {
    components:{
        GChart
    },
    computed:{
        chartData(){
            if (!this.levels) return null

            let data = [['Level', 'Start', 'Complete', 'Fail']]
            
            this.levels.forEach(element => {
                data.push([element.name,element.data.start,element.data.complete,element.data.fail]);
            });

            return data;
        },
        chartOptions(){

            return {
                chart: {
                    title: 'Level funnel'
                },
                legend: { position: 'bottom' },
                height: 320,
                colors: ['#1f6f73', '#b35f1f', '#7f4bb0']
            }
        }
    },
    props: {
        'levels': Object
    }
}
</script>
