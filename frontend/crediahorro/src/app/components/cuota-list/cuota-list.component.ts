import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuotaService, Cuota, Prestamo, PrestamoCuotasResponse } from '../../services/cuota.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cuota-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cuota-list.component.html',
  styleUrls: ['./cuota-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CuotaListComponent implements OnInit {
  cuotas: Cuota[] = [];
  prestamoId!: number;
  cuotasPendientes: number = 0;
  totalAPagar: number = 0;
  totalPagado: number = 0;
  faltaPagar: number = 0;
  mensajeVencimiento: string = '';
  showModal: boolean = false;
  cuotaSeleccionada: Cuota | null = null;
  prestamo: Prestamo | null = null;

  constructor(
    private cuotaService: CuotaService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.prestamoId = +this.route.snapshot.paramMap.get('prestamoId')!;
    this.loadCuotas();
  }

  loadCuotas() {
    this.cuotaService.getCuotasByPrestamo(this.prestamoId).subscribe((data: PrestamoCuotasResponse) => {
        this.prestamo = {
          id: data.prestamoId,
          tipoCuota: data.tipoCuota,
          cuotas: data.cuotas
        };
        this.cuotas = this.prestamo.cuotas || [];
        this.cuotasPendientes = data.cuotasPendientes;

      this.totalAPagar = this.cuotas.reduce((sum, c) => sum + c.montoCuota, 0);
      this.totalPagado = this.cuotas
        .filter(c => c.estado === 'PAGADA')
        .reduce((sum, c) => sum + c.montoCuota, 0);
      this.faltaPagar = this.cuotas
        .filter(c => c.estado === 'PENDIENTE')
        .reduce((sum, c) => sum + c.montoCuota, 0);

      this.mensajeVencimiento = '';
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Medianoche local

      // Ordenar cuotas por fechaPago
      const cuotasOrdenadas = [...this.cuotas].sort(
        (a, b) => new Date(a.fechaPago).getTime() - new Date(b.fechaPago).getTime()
      );

      // Cuota próxima a vencer
      const cuotaProxima = cuotasOrdenadas.find((cuota) => {
        if (cuota.estado !== 'PENDIENTE') return false;
        const fechaPagoDate = new Date(cuota.fechaPago + 'T00:00:00');
        fechaPagoDate.setHours(0, 0, 0, 0);
        const diffTime = fechaPagoDate.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      });

      if (cuotaProxima) {
        const fechaPagoDate = new Date(cuotaProxima.fechaPago + 'T00:00:00');
        fechaPagoDate.setHours(0, 0, 0, 0);
        const diffTime = fechaPagoDate.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const index = cuotasOrdenadas.indexOf(cuotaProxima);
        this.mensajeVencimiento = diffDays === 0
          ? `Hoy vence la ${this.ordinal(index + 1)} cuota`
          : `Falta ${diffDays} día${diffDays === 1 ? '' : 's'} para vencerse la ${this.ordinal(index + 1)} cuota`;
      } else {
        // Cuota vencida
        const cuotaVencida = cuotasOrdenadas.find((cuota) => {
          if (cuota.estado !== 'PENDIENTE') return false;
          const fechaPagoDate = new Date(cuota.fechaPago + 'T00:00:00');
          fechaPagoDate.setHours(0, 0, 0, 0);
          return fechaPagoDate.getTime() < hoy.getTime();
        });

        if (cuotaVencida) {
          const fechaPagoDate = new Date(cuotaVencida.fechaPago + 'T00:00:00');
          fechaPagoDate.setHours(0, 0, 0, 0);
          const diffTime = hoy.getTime() - fechaPagoDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const index = cuotasOrdenadas.indexOf(cuotaVencida);
          this.mensajeVencimiento = `Venció la ${this.ordinal(index + 1)} cuota hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
        } else {
          const cuotasPagadas = cuotasOrdenadas.filter(c => c.estado === 'PAGADA');
          if (cuotasPagadas.length > 0) {
            const lastPagada = cuotasPagadas[cuotasPagadas.length - 1];
            const indexLastPagada = cuotasOrdenadas.indexOf(lastPagada);

            const hayPendientes = cuotasOrdenadas.some(c => c.estado === 'PENDIENTE');
            if (hayPendientes) {
              this.mensajeVencimiento = `${this.ordinal(indexLastPagada + 1)} cuota pagada`;
            }
          }
        }
      }
    });
  }

  // Método para ordinales en español
  ordinal(n: number): string {
    const ordinals = ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma', '8va', '9na', '10ma', '11va', '12va', '13va', '14va', '15va', '16va', '17va', '18va', '19va', '20va', '21va', '22va', '23va', '24va'];
    return ordinals[n - 1] || `${n}ta`;
  }

  pagarCuota(cuotaId: number) {
    this.cuotaService.pagarCuota(cuotaId).subscribe(() => {
      this.loadCuotas();
    });
  }

  irPagoAdelantado() {
    this.router.navigate(['/cuotas', this.prestamoId, 'pago-adelantado']);
  }

  volver() {
    this.router.navigate(['/clientes']);
  }

  abrirModal(cuota: Cuota): void {
    this.cuotaSeleccionada = cuota;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.cuotaSeleccionada = null;
  }

  pagarAvanzado(tipo: string): void {
    if (!this.cuotaSeleccionada) return;

    this.cuotaService.pagarCuotaAvanzado(this.cuotaSeleccionada.id, tipo).subscribe({
      next: () => {
        this.notificationService.show('success', 'Cuota pagada exitosamente.');
        this.loadCuotas();
        this.cerrarModal();
      },
      error: () => {
        this.notificationService.show('error', 'Hubo un error al pagar la cuota.');
      }
    });
  }

  get mostrarBotonPagarAdelanto(): boolean {
    if (!this.cuotas || this.cuotas.length === 0) return false;

    // Verifica si ya hay un Adelanto Capital y un Adelanto Interés
    const tieneAdelantoCapital = this.cuotas.some(c =>
      c.tipoPago?.toLowerCase().includes('adelanto') &&
      c.tipoPago?.toLowerCase().includes('capital')
    );
    const tieneAdelantoInteres = this.cuotas.some(c =>
      c.tipoPago?.toLowerCase().includes('adelanto') &&
      c.tipoPago?.toLowerCase().includes('interés')
    );

    if (tieneAdelantoCapital && tieneAdelantoInteres) {
      return false; // Ya se hicieron ambos pagos adelantados, se oculta el botón
    }

    // Regla normal de la primera cuota
    const primeraCuota = this.cuotas[0];
    if (primeraCuota.estado !== 'PAGADA') {
      return true;
    }

    if (primeraCuota.tipoPago) {
      const tipoPago = primeraCuota.tipoPago.toLowerCase();
      return !['capital', 'interes', 'completo'].includes(tipoPago);
    }

    return true; // Si está pagada pero no tiene tipoPago
  }

  get esModalSimplificado(): boolean {
    if (!this.cuotaSeleccionada) return false;

    const cuotasOrdenadas = [...this.cuotas].sort(
      (a, b) => new Date(a.fechaPago).getTime() - new Date(b.fechaPago).getTime()
    );
    const ultima = cuotasOrdenadas[cuotasOrdenadas.length - 1];
    const esUltima = this.cuotaSeleccionada.id === ultima.id;

    const esDiaria = this.prestamo?.tipoCuota?.toUpperCase() === 'DIARIO';

    return esUltima || esDiaria;
  }

  esCuotaHabilitadaParaPago(cuota: Cuota): boolean {
    if (!this.cuotas || this.cuotas.length === 0) return false;

    const index = this.cuotas.findIndex(c => c.id === cuota.id);
    if (index === -1) return false;

    // Si es la primera cuota
    if (index === 0) {
      return cuota.estado === 'PENDIENTE';
    }

    // Verifica si la cuota anterior está pagada
    const cuotaAnterior = this.cuotas[index - 1];
    return cuota.estado === 'PENDIENTE' && cuotaAnterior.estado === 'PAGADA';
  }

}
