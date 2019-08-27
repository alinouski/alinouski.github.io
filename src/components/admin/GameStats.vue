<template>
    <div  class="content" id="content">
        <div >
            <h1><router-link to="/admin/stats">Back</router-link></h1>
        </div>
        <GameOsStatistic v-for="os in game_stats.os" v-bind:key="os.name" v-bind:game_os="os"></GameOsStatistic>
    </div>
</template>

<script>
import { db } from '../../firebase/firebaseConfig'

import GameOsStatistic from '../../components/admin/GameOsStatistic'

export default {
    components:{
        GameOsStatistic: GameOsStatistic
    },
    data: function () {
        return {
            game_stats: {
            }
        }
    },
    props: {
        'id': String
    },
    firestore(){
        let resultData = {
            os: []
        }
        let osList = db.collection('games_stats').doc(this.id).collection('os');
        osList.onSnapshot(collections => {
            collections.forEach(collection => {
                var osData = {
                    name: collection.id,
                    versions: []
                };

                osList.doc(collection.id).collection('versions').onSnapshot(versions=>{
                    versions.forEach(version=>{

                        var versionData = {
                            name: version.id,
                            levels: []
                        }

                        osList.doc(collection.id).collection('versions').doc(version.id).collection('levels').onSnapshot(levels=>{
                            levels.forEach(lvl=>{
                                versionData.levels.push(
                                    {
                                        name: lvl.id,
                                        data: lvl.data()
                                    }
                                );
                                console.log(lvl.data());
                            });
                        });

                        osData.versions.push(versionData);
                    });
                });

                resultData.os.push(osData);
            });
        });


        console.log(resultData);
        this.game_stats = resultData;
    }
}
</script>