import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cuota {
  id: number;
  fechaPago: string;
  montoCuota: number;
  capital: number;
  interes: number;
  estado: string;
  tipoPago: string;
  fechaPagada: string;
}

export interface Prestamo {
  id?: number;
  monto: number;
  tasaInteresMensual: number;
  numeroCuotas: number;
  tipoCuota: 'MENSUAL' | 'DIARIO';
  fechaInicio: string;
  estado?: string;
  fechaCreacion?: string;
  cuotas?: Cuota[]
}

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private baseUrl = `${environment.apiUrl}/admin-service/prestamos`;

  constructor(private http: HttpClient) {}

  getPrestamoById(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.baseUrl}/${id}`);
  }

  crearPrestamo(clienteId: number, prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.baseUrl}/cliente/${clienteId}`, prestamo);
  }

  actualizarPrestamo(id: number, prestamo: Prestamo): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.baseUrl}/${id}`, prestamo);
  }

  eliminarPrestamo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
