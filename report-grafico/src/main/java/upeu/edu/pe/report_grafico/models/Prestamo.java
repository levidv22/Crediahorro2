package upeu.edu.pe.report_grafico.models;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.List;

public class Prestamo {
    private Long id;
    private double monto;
    private double tasaInteresMensual;
    private int numeroCuotas;
    private String tipoCuota; // valores: "MENSUAL" o "DIARIO"
    private double interesTotal;
    private String usernameAdministrador;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fechaCreacion;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fechaInicio;
    private String estado; // ACTIVO o PAGADO
    private List<Cuota> cuotas;

    public Prestamo() {
    }

    public Prestamo(Long id, double monto, double tasaInteresMensual, int numeroCuotas, String tipoCuota, double interesTotal, String usernameAdministrador, LocalDate fechaCreacion, LocalDate fechaInicio, String estado, List<Cuota> cuotas) {
        this.id = id;
        this.monto = monto;
        this.tasaInteresMensual = tasaInteresMensual;
        this.numeroCuotas = numeroCuotas;
        this.tipoCuota = tipoCuota;
        this.interesTotal = interesTotal;
        this.usernameAdministrador = usernameAdministrador;
        this.fechaCreacion = fechaCreacion;
        this.fechaInicio = fechaInicio;
        this.estado = estado;
        this.cuotas = cuotas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public double getTasaInteresMensual() {
        return tasaInteresMensual;
    }

    public void setTasaInteresMensual(double tasaInteresMensual) {
        this.tasaInteresMensual = tasaInteresMensual;
    }

    public int getNumeroCuotas() {
        return numeroCuotas;
    }

    public void setNumeroCuotas(int numeroCuotas) {
        this.numeroCuotas = numeroCuotas;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<Cuota> getCuotas() {
        return cuotas;
    }

    public void setCuotas(List<Cuota> cuotas) {
        this.cuotas = cuotas;
    }

    public String getTipoCuota() {
        return tipoCuota;
    }

    public void setTipoCuota(String tipoCuota) {
        this.tipoCuota = tipoCuota;
    }

    public double getInteresTotal() {
        return interesTotal;
    }

    public void setInteresTotal(double interesTotal) {
        this.interesTotal = interesTotal;
    }

    public String getUsernameAdministrador() {
        return usernameAdministrador;
    }

    public void setUsernameAdministrador(String usernameAdministrador) {
        this.usernameAdministrador = usernameAdministrador;
    }

    public static class Builder {
        private Long id;
        private double monto;
        private double tasaInteresMensual;
        private int numeroCuotas;
        private String tipoCuota; // valores: "MENSUAL" o "DIARIO"
        private double interesTotal;
        private String usernameAdministrador;
        private LocalDate fechaCreacion;
        private LocalDate fechaInicio;
        private String estado;
        private List<Cuota> cuotas;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder monto(double monto) {
            this.monto = monto;
            return this;
        }

        public Builder tasaInteresMensual(double tasaInteresMensual) {
            this.tasaInteresMensual = tasaInteresMensual;
            return this;
        }

        public Builder tipoCuota(String tipoCuota) {
            this.tipoCuota = tipoCuota;
            return this;
        }

        public Builder interesTotal(double interesTotal) {
            this.interesTotal = interesTotal;
            return this;
        }

        public Builder usernameAdministrador(String usernameAdministrador) {
            this.usernameAdministrador = usernameAdministrador;
            return this;
        }

        public Builder numeroCuotas(int numeroCuotas) {
            this.numeroCuotas = numeroCuotas;
            return this;
        }

        public Builder fechaCreacion(LocalDate fechaCreacion) {
            this.fechaCreacion = fechaCreacion;
            return this;
        }

        public Builder fechaInicio(LocalDate fechaInicio) {
            this.fechaInicio = fechaInicio;
            return this;
        }

        public Builder estado(String estado) {
            this.estado = estado;
            return this;
        }

        public Builder cuotas(List<Cuota> cuotas) {
            this.cuotas = cuotas;
            return this;
        }

        public Prestamo build() {
            return new Prestamo(id, monto, tasaInteresMensual, numeroCuotas, tipoCuota, interesTotal, usernameAdministrador, fechaCreacion, fechaInicio, estado, cuotas);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

}