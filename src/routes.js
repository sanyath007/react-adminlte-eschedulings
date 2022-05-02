import Dashboard from './views/Dashboard';
import {
  ScheduleList,
  ScheduleDetail,
  ScheduleAdd,
  ScheduleEdit,
  SchedulePrint,
  SchedulePdf
} from './views/Schedule';
import PersonShiftsDetail from './views/PersonShiftsDetail';
import ShiftSwappingForm from './views/ShiftSwappingForm';
import ChartJS from './views/Report/ChartJS';
import Flot from './views/Report/Flot';
import Inline from './views/Report/Inline';
import Profile from './views/Profile';
import NotFound from './views/NotFound';

const routes = [
  { path: '/', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/schedules/list', exact: true, name: 'Schedules', component: ScheduleList },
  { path: '/schedules/add', exact: true, name: 'Schedules', component: ScheduleAdd },
  { path: '/schedules/:id/edit', exact: true, name: 'Schedules', component: ScheduleEdit },
  { path: '/schedules/:id/detail', exact: true, name: 'Schedule-detail', component: ScheduleDetail },
  { path: '/schedules/:id/print', exact: true, name: 'Schedule-print', component: SchedulePrint },
  { path: '/schedules/:id/pdf', exact: true, name: 'Schedule-print', component: SchedulePdf },
  { path: '/person-shifts/:id/detail', exact: true, name: 'Person Shifts', component: PersonShiftsDetail },
  { path: '/person-shifts/:id/:date/:shift/swapping', exact: true, name: 'Shift Swapping Form', component: ShiftSwappingForm },
  { path: '/reports/chartjs', name: 'Charts', component: ChartJS },
  { path: '/reports/flot', exact: true, name: 'Flot', component: Flot },
  { path: '/reports/inline', exact: true, name: 'Inline', component: Inline },
  { path: '/profile', exact: true, name: 'Profile', component: Profile },
  { path: '/404', exact: true, name: 'NotFound', component: NotFound },
];

export default routes;
