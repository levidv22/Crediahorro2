import { Routes } from '@angular/router';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';
import { ClienteEditComponent } from './components/cliente-edit/cliente-edit.component';
import { ClientePrestamosComponent } from './components/cliente-prestamos/cliente-prestamos.component';
import { NuevoPrestamoComponent } from './components/nuevo-prestamo/nuevo-prestamo.component';
import { EditarPrestamoComponent } from './components/editar-prestamo/editar-prestamo.component';
import { CuotaListComponent } from './components/cuota-list/cuota-list.component';
import { CuotaPagoAdelantadoComponent } from './components/cuota-pago-adelantado/cuota-pago-adelantado.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { DashboardGraficosComponent } from './components/dashboard-graficos/dashboard-graficos.component';
import { AuthComponent } from './components/auth/auth.component';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/nuevo', component: ClienteFormComponent },
  { path: 'clientes/editar/:id', component: ClienteEditComponent },
  { path: 'clientes/prestamos/:id', component: ClientePrestamosComponent },
  { path: 'clientes/:clienteId/prestamos/nuevo', component: NuevoPrestamoComponent },
  { path: 'clientes/:clienteId/prestamos/:id/editar', component: EditarPrestamoComponent },
  { path: 'cuotas/:prestamoId', component: CuotaListComponent },
  { path: 'cuotas/:prestamoId/pago-adelantado', component: CuotaPagoAdelantadoComponent },
  { path: 'reportes', component: ReporteComponent },
  { path: 'graficos', component: DashboardGraficosComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'verify-code', component: VerifyCodeComponent },
  { path: '**', redirectTo: '/clientes' }
];


