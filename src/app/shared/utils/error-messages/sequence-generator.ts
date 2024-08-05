import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class SequenceGenerator {
    private current: number;
    public start: number = 0;

    constructor() {
        this.current = this.start;
    }

    // Obtiene el siguiente número en la secuencia
    getNext(): number {
        return this.current++;
    }

    // Establece el valor inicial de la secuencia
    reset(start: number = 0): void {
        this.current = start;
    }

    // Obtiene el valor actual de la secuencia
    getCurrent(): number {
        return this.current;
    }
}
