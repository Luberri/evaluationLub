import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import HelloWorld from './components/HelloWorld.vue'
import TicketList from './components/ticket/TicketList.vue'
import TicketCreate from './components/ticket/TicketCreate.vue'
import TicketTeamMemberCreate from './components/ticket/TicketTeamMemberCreate.vue'
import UserCreate from './components/user/UserCreate.vue'
import UserList from './components/user/UserList.vue'
import ItemtList from './components/item/DashboardItemList.vue'
import ItemDetail from './components/item/ItemDetailList.vue'
import Dashboard from './components/Dashboard.vue'
import Reinit from './components/Reinit.vue'

import StateList from './components/dropdown/state/StateList.vue'
import StateCreate from './components/dropdown/state/StateCreate.vue'
import StateDetail from './components/dropdown/state/StateDetail.vue'
import LocationList from './components/dropdown/location/LocationList.vue'
import LocationCreate from './components/dropdown/location/LocationCreate.vue'
import LocationDetail from './components/dropdown/location/LocationDetail.vue'
import ManufacturerList from './components/dropdown/manufacturer/ManufacturerList.vue'
import ManufacturerCreate from './components/dropdown/manufacturer/ManufacturerCreate.vue'
import ManufacturerDetail from './components/dropdown/manufacturer/ManufacturerDetail.vue'
import ItemCreate from './components/item/ItemCreate.vue'
import Import1 from './components/Import1.vue'
import Import2 from './components/Import2.vue'
import Import from './components/Import.vue'
import Kanban from './components/ticket/Kanban.vue'
import Status from './components/spring/Status.vue'
import TicketCostCreate from './components/ticket/TicketCostCreate.vue'
import TicketSolutionCreate from './components/ticket/TicketSolutionCreate.vue'
import Cout from './components/spring/Cout.vue'

const routes = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/bo',
    component: Login,
  },
  {
    path: '/bo/helloWorld',
    component: HelloWorld,
  },
  {
    path: '/bo/dashboard',
    component: Dashboard,
  },
  {
    path: '/fo/ticket',
    component: TicketList,
  },
  {
    path: '/fo/ticket/create',
    component: TicketCreate,
  },
  {
    path: '/fo/ticket/teamMember',
    component: TicketTeamMemberCreate,
  },
  {
    path: '/fo/ticket/solution',
    component: TicketSolutionCreate,
  },
  {
    path: '/fo/ticket/cost',
    component: TicketCostCreate,
  },
  {
    path: '/bo/user/create',
    component: UserCreate,
  },
  {
    path: '/bo/user',
    component: UserList,
  },
  {
    path: '/fo/item',
    component: ItemtList,
  },
  {
    path: '/fo/kanban',
    component: Kanban,
  },
  {
    path: '/fo/item/create',
    component: ItemCreate,
  },
  {
    path: '/fo/item/detailList',
    component: ItemDetail,
  },
  {
    path: '/bo/reset',
    component: Reinit,
  },
  {
    path: '/dropdown/state',
    component: StateList,
  },
  {
    path: '/dropdown/state/create',
    component: StateCreate,
  },
  {
    path: '/dropdown/state/detail/:id',
    component: StateDetail,
  },
  {
    path: '/dropdown/location',
    component: LocationList,
  },
  {
    path: '/dropdown/location/create',
    component: LocationCreate,
  },
  {
    path: '/dropdown/location/detail/:id',
    component: LocationDetail,
  },
  {
    path: '/dropdown/manufacturer',
    component: ManufacturerList,
  },
  {
    path: '/dropdown/manufacturer/create',
    component: ManufacturerCreate,
  },
  {
    path: '/dropdown/manufacturer/detail/:id',
    component: ManufacturerDetail,
  },
  {
    path: '/bo/import1',
    component: Import1,
  },
  {
    path: '/bo/import',
    component: Import,
  },
  {
    path: '/bo/import2',
    component: Import2,
  },
  {
    path: '/bo/spring/status',
    component: Status,
  },
  {
    path: '/bo/spring/cout',
    component: Cout,
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router