package upeu.edu.pe.admin_core_service.service;

import upeu.edu.pe.admin_core_service.entities.Prestamo;

public interface PagoAdelantadoService {
    Prestamo aplicarPagoAdelantado(Long prestamoId, double monto, String tipoPago);
}