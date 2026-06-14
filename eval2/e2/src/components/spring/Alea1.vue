<script setup>
import { onMounted, ref } from 'vue';
import { getAllCoutSpring } from '../../services/spring';
import { getAllCosts, getAllTicket } from '../../services/ticket';
import { listItems } from '../../services/item';

const rs = ref([])
onMounted(async () => {
    const tickets = (await getAllTicket()).data
    const avecCost = await Promise.all(tickets.map(async (t) => {
        const a = (await getAllCoutSpring()).data.filter(c => c.idTicket == t.id && c.motif != "reouv")
        const b = (await getAllCoutSpring()).data.filter(c => c.idTicket == t.id && c.motif == "reouv")
        console.log("bbbbbbb ",b)
        let a1 =(await getAllCosts(t.id)).data
        return {...t, coutSuper:a,coutGlpi:a1,reouv:b}
    }))
    console.log("ajpfhaweiofahefveg ",avecCost)
    
    function getCoutGlpi(coutGlpi)
    {
        let total = 0
        for (const c of coutGlpi) {
            const s = (c.duration/3600)*c.cost_time + c.cost_fixed
            total += s
        }
        return total
    }

    function getCoutSuper(coutSuper)
    {
        let total = 0
        for (const c of coutSuper) {
            const s = c.coutSuper
            total += s
        }
        return total
    }
    
    function getCoutReouv(reouv)
    {
        let total = 0
        for (const c of reouv) {
            const s = c.coutSuper
            total += s
        }
        return total
    }
    const itemsType = (await listItems()).data
    const parItemType = avecCost.reduce((acc,t) => {
        const totalGlpiReparti = getCoutGlpi(t.coutGlpi) / t.items.length
        const totalSuperReparti = getCoutSuper(t.coutSuper) / t.items.length
        console.log("ppppppppppp, ", getCoutReouv(t.reouv))
        const totalReouvReparti = getCoutReouv(t.reouv) / t.items.length
        for (const i of t.items) {
            const key = i.itemtype
            console.log("kiii",key)
            if (!acc[key]) {
                acc[key] = {
                    itemType : key,
                    coutGlpi : 0,
                    coutSuper : 0,
                    coutReouv : 0,
                    coutTotal : 0
                }
            }
            acc[key].coutGlpi += totalGlpiReparti
            acc[key].coutSuper += totalSuperReparti
            acc[key].coutReouv += totalReouvReparti
            acc[key].coutTotal += totalGlpiReparti + totalSuperReparti + totalReouvReparti
        }
        for (const eee of itemsType) {
            const aa = eee.itemtype
            if (!acc[aa]) {
                acc[aa] = {
                    itemType : aa,
                    coutGlpi : 0,
                    coutSuper : 0,
                    coutReouv : 0,
                    coutTotal : 0
                }
            }
        }
        return acc
    },{})

    const resultat = Object.values(parItemType)
    console.log("res",resultat)

    rs.value = resultat
})
</script>
<template>
    <h1>gogogogog</h1>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>item</th>
                <th>cout</th>
                <th>super cout</th>
                <th>reouverture cout</th>
                <th>total</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="r in rs">
                <td>{{ r.itemType }}</td>
                <td>{{ r.coutGlpi }}</td>
                <td>{{ r.coutSuper }}</td>
                <td>{{ r.coutReouv }}</td>
                <td>{{ r.coutTotal }}</td>
            </tr>
        </tbody>
    </table>
</template>