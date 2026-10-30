export const getStatusClass = (status: string) => {
    switch (status) {
      case 'AGUARDANDO':
        return 'status-aguardando';

      case 'ENTREGUE':
        return 'status-entregue';

      case 'EM ROTA':
        return 'status-em-rota';

      case 'EXPEDIDO':
        return 'status-expedido';

      case 'NF IMPRESSA':
        return 'status-nf-impressa';
        
      case 'PROCESSADO':
        return 'status-processado';

      case 'CONFERIDO':
        return 'status-conferido';

      case 'SEPARADO':
        return 'status-separado';

      case 'GERADO':
        return 'status-gerado';

      case 'IMPORTADO':
        return 'status-importado';

      case 'CANCELADO':
        return 'status-cancelado';

      default:
        return '';
    }
  };