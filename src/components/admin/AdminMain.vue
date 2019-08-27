<template>
<div class="content" id="content">
    AdminPanel<br>
    Total games on db {{gamesCount}}
</div>
</template>

<script>
import { db } from '../../firebase/firebaseConfig'

export default {
    components: {
    },    
    data: function () {
        return {
            gamesCount: 0
        }
    },
    firestore() {
        db.collection('games').get().then(snap => {
            this.gamesCount = snap.size
        })
    }
}
</script>