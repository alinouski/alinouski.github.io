<template>
    <div>  
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
                title: 'Company Performance'
                }
            }
        }
    },
    props: {
        'levels': Object
    }
}
</script>