export class ErrorMessage{

    getErrorMessage(field: string, error: string): string {
        const messages: any = {
            'id': {
                'required': 'El ID es obligatorio',
                'minlength': 'El ID debe tener al menos 3 caracteres',
                'maxlength': 'El ID no puede tener más de 10 caracteres'
            },
            'name': {
                'required': 'El nombre es obligatorio',
                'minlength': 'El nombre debe tener al menos 5 caracteres',
                'maxlength': 'El nombre no puede tener más de 100 caracteres'
            },
            'description': {
                'required': 'La descripción es obligatoria',
                'minlength': 'La descripción debe tener al menos 10 caracteres',
                'maxlength': 'La descripción no puede tener más de 200 caracteres'
            },
            'logo': {
                'required': 'La URL del logo es obligatoria'
            },
            'date_release': {
                'required': 'La fecha de liberación es obligatoria'
            },
            'date_revision': {
                'required': 'Debes seleccionar una fecha de liberación'
            }
        };
        return messages[field] ? messages[field][error] || 'Valor invalido' : 'Valor invalido';
    }
}